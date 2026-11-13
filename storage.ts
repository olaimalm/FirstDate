import AsyncStorage from "@react-native-async-storage/async-storage";
import type { CustomCard } from "./content";

// Everything is stored only on this device. Nothing is sent anywhere.
const CUSTOM_CARDS_KEY = "firstdate.customCards.v1";
const PLAYERS_KEY = "firstdate.players.v1";

async function readJson<T>(key: string, fallback: T): Promise<T> {
  try {
    const raw = await AsyncStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

async function writeJson(key: string, value: unknown): Promise<void> {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage is a convenience; the game still works without it.
  }
}

export const loadCustomCards = () => readJson<CustomCard[]>(CUSTOM_CARDS_KEY, []);
export const saveCustomCards = (cards: CustomCard[]) => writeJson(CUSTOM_CARDS_KEY, cards);
export const loadPlayers = () => readJson<[string, string]>(PLAYERS_KEY, ["", ""]);
export const savePlayers = (names: [string, string]) => writeJson(PLAYERS_KEY, names);
