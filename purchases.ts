import { useCallback, useEffect, useState } from "react";
import { requireOptionalNativeModule } from "expo";

// Must match the non-consumable in-app purchase created in App Store Connect.
// The price is set there and shown from the store, never hardcoded for real purchases.
export const UNTAMED_PRODUCT_ID = "com.olaimalm.FirstDate.untamed";

type Iap = typeof import("expo-iap");

// Expo Go and web don't contain the native store module, and loading expo-iap there throws.
const iap: Iap | null = requireOptionalNativeModule("ExpoIap") ? require("expo-iap") : null;

// Lets the paywall be tried in Expo Go. __DEV__ is false in App Store builds, so this can't unlock anything there.
export const isSimulatedStore = iap === null && __DEV__;

export function useUntamedPurchase() {
  const [unlocked, setUnlocked] = useState(false);
  const [price, setPrice] = useState<string | null>(isSimulatedStore ? "11 kr" : null);
  const [loadFailed, setLoadFailed] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (isSimulatedStore) return;
    setLoadFailed(false);
    setMessage(null);
    try {
      if (!iap) throw new Error("Store not available");
      await iap.initConnection();
      const [products, owned] = await Promise.all([
        iap.fetchProducts({ skus: [UNTAMED_PRODUCT_ID], type: "in-app" }),
        iap.getAvailablePurchases(),
      ]);
      if (owned.some((p) => p.productId === UNTAMED_PRODUCT_ID)) setUnlocked(true);
      const product = products?.find((p) => p.id === UNTAMED_PRODUCT_ID);
      if (!product) throw new Error("Product not found");
      setPrice(product.displayPrice);
    } catch {
      setLoadFailed(true);
    }
  }, []);

  useEffect(() => {
    if (!iap) {
      void load();
      return;
    }
    const store = iap;
    const updated = store.purchaseUpdatedListener(async (purchase) => {
      if (purchase.productId !== UNTAMED_PRODUCT_ID || purchase.purchaseState !== "purchased") return;
      setUnlocked(true);
      setBusy(false);
      try {
        await store.finishTransaction({ purchase, isConsumable: false });
      } catch {
        // The store redelivers unfinished transactions on the next launch.
      }
    });
    const failed = store.purchaseErrorListener((error) => {
      setBusy(false);
      if (error.code !== store.ErrorCode.UserCancelled) {
        setMessage("The purchase didn't go through. Please try again.");
      }
    });
    void load();
    return () => {
      updated.remove();
      failed.remove();
      store.endConnection().catch(() => {});
    };
  }, [load]);

  const buy = useCallback(async () => {
    setMessage(null);
    if (isSimulatedStore) {
      setUnlocked(true);
      return;
    }
    if (!iap) return;
    setBusy(true);
    try {
      await iap.requestPurchase({
        request: { apple: { sku: UNTAMED_PRODUCT_ID }, google: { skus: [UNTAMED_PRODUCT_ID] } },
        type: "in-app",
      });
    } catch {
      setBusy(false);
      setMessage("The purchase didn't go through. Please try again.");
    }
  }, []);

  const restore = useCallback(async () => {
    setMessage(null);
    if (!iap) {
      setMessage(isSimulatedStore ? "Test mode: there is nothing to restore." : "Purchases aren't available here.");
      return;
    }
    setBusy(true);
    try {
      await iap.restorePurchases();
      const owned = await iap.getAvailablePurchases();
      if (owned.some((p) => p.productId === UNTAMED_PRODUCT_ID)) {
        setUnlocked(true);
      } else {
        setMessage("No previous purchase found.");
      }
    } catch {
      setMessage("Couldn't restore your purchase. Please try again.");
    } finally {
      setBusy(false);
    }
  }, []);

  return { unlocked, price, loadFailed, busy, message, buy, restore, retry: load };
}
