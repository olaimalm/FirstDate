import { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Linking,
  KeyboardAvoidingView,
  Platform,
  Share,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { isSimulatedStore, useUntamedPurchase } from "./purchases";
import { LEVELS, buildDeck, forfeitFor, type CustomCard, type DeckCard } from "./content";
import { loadCustomCards, loadPlayers, saveCustomCards, savePlayers } from "./storage";

const PAID_LEVEL_ID = 5;
const PRIVACY_URL = "https://olaimalm.github.io/firstdate-support/privacy.html";
const MAX_CARD_LENGTH = 200;

type Screen = "home" | "setup" | "levels" | "paywall" | "card" | "complete" | "mycards" | "summary";
type PlayerStats = { hearts: number; questions: number; dares: number; skips: number };
type KeptCard = { text: string; type: string; levelId: number };

const emptyStats = (): [PlayerStats, PlayerStats] => [
  { hearts: 0, questions: 0, dares: 0, skips: 0 },
  { hearts: 0, questions: 0, dares: 0, skips: 0 },
];

const isDare = (type: string) => type === "challenge";
const heartsFor = (type: string) => (isDare(type) ? 2 : 1);
const plural = (n: number, word: string) => `${n} ${word}${n === 1 ? "" : "s"}`;

export default function App() {
  const [screen, setScreen] = useState<Screen>("home");
  const purchase = useUntamedPurchase();

  // The evening: players, turns, score and the cards they kept.
  const [names, setNames] = useState<[string, string]>(["", ""]);
  const [eveningStart, setEveningStart] = useState<number | null>(null);
  const [turn, setTurn] = useState<0 | 1>(0);
  const [stats, setStats] = useState<[PlayerStats, PlayerStats]>(emptyStats);
  const [kept, setKept] = useState<KeptCard[]>([]);
  const [levelsFinished, setLevelsFinished] = useState<number[]>([]);

  // The level being played.
  const [currentLevel, setCurrentLevel] = useState<number | null>(null);
  const [deck, setDeck] = useState<DeckCard[]>([]);
  const [cardIndex, setCardIndex] = useState(0);
  const [forfeit, setForfeit] = useState<string | null>(null);

  // The couple's own cards.
  const [customCards, setCustomCards] = useState<CustomCard[]>([]);
  const [draftText, setDraftText] = useState("");
  const [draftType, setDraftType] = useState<"question" | "challenge">("question");
  const [draftLevel, setDraftLevel] = useState(1);
  const [myCardsBack, setMyCardsBack] = useState<Screen>("home");

  useEffect(() => {
    loadCustomCards().then(setCustomCards);
    loadPlayers().then(setNames);
  }, []);

  const level = currentLevel ? LEVELS.find((l) => l.id === currentLevel) ?? null : null;
  const card = deck[cardIndex] ?? null;
  const isDark = (screen === "card" || screen === "complete") && (level?.darkTheme ?? false);
  const onDarkBackground = screen === "home" || screen === "paywall" || screen === "setup" || screen === "summary" || isDark;
  const paidLevel = LEVELS[PAID_LEVEL_ID - 1];
  const playerName = (i: 0 | 1) => names[i].trim() || `Player ${i + 1}`;

  const openLevel = (lid: number) => {
    const lvl = LEVELS.find((l) => l.id === lid);
    if (!lvl) return;
    setCurrentLevel(lid);
    setDeck(buildDeck(lvl, customCards));
    setCardIndex(0);
    setForfeit(null);
    setScreen("card");
  };

  const startLevel = (lid: number) => {
    if (lid === PAID_LEVEL_ID && !purchase.unlocked) {
      setScreen("paywall");
      return;
    }
    openLevel(lid);
  };

  useEffect(() => {
    if (purchase.unlocked && screen === "paywall") openLevel(PAID_LEVEL_ID);
    // openLevel only reads state that is current on this render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [purchase.unlocked, screen]);

  const startEvening = () => {
    const trimmed: [string, string] = [names[0].trim(), names[1].trim()];
    setNames(trimmed);
    savePlayers(trimmed);
    setEveningStart(Date.now());
    setTurn(0);
    setStats(emptyStats());
    setKept([]);
    setLevelsFinished([]);
    setScreen("levels");
  };

  const updateStats = (change: (s: PlayerStats) => PlayerStats) => {
    setStats((prev) => {
      const next: [PlayerStats, PlayerStats] = [{ ...prev[0] }, { ...prev[1] }];
      next[turn] = change(next[turn]);
      return next;
    });
  };

  const advance = () => {
    setForfeit(null);
    setTurn((t) => (t === 0 ? 1 : 0));
    if (cardIndex + 1 >= deck.length) {
      if (level && !levelsFinished.includes(level.id)) setLevelsFinished((f) => [...f, level.id]);
      setScreen("complete");
    } else {
      setCardIndex((i) => i + 1);
    }
  };

  const completeCard = () => {
    if (!card) return;
    updateStats((s) => ({
      ...s,
      hearts: s.hearts + heartsFor(card.type),
      questions: s.questions + (isDare(card.type) ? 0 : 1),
      dares: s.dares + (isDare(card.type) ? 1 : 0),
    }));
    advance();
  };

  const skipCard = () => {
    if (!level) return;
    updateStats((s) => ({ ...s, skips: s.skips + 1 }));
    setForfeit(forfeitFor(level.id));
  };

  const isKept = (c: DeckCard | null) => !!c && kept.some((k) => k.text === c.text);
  const toggleKeep = () => {
    if (!card || !level) return;
    setKept((prev) =>
      isKept(card) ? prev.filter((k) => k.text !== card.text) : [...prev, { text: card.text, type: card.type, levelId: level.id }]
    );
  };

  const openMyCards = (from: Screen) => {
    setMyCardsBack(from);
    setScreen("mycards");
  };

  const addCustomCard = () => {
    const text = draftText.trim();
    if (!text) return;
    const next = [...customCards, { id: `${Date.now()}`, type: draftType, text, levelId: draftLevel }];
    setCustomCards(next);
    saveCustomCards(next);
    setDraftText("");
  };

  const deleteCustomCard = (id: string) => {
    const next = customCards.filter((c) => c.id !== id);
    setCustomCards(next);
    saveCustomCards(next);
  };

  const endEvening = () => setScreen("summary");
  const newEvening = () => {
    setEveningStart(null);
    setCurrentLevel(null);
    setScreen("home");
  };

  const minutes = eveningStart ? Math.max(1, Math.round((Date.now() - eveningStart) / 60000)) : 0;
  const cardsPlayed = stats.reduce((n, s) => n + s.questions + s.dares + s.skips, 0);
  const result =
    stats[0].hearts === stats[1].hearts
      ? "A perfect tie. You're even."
      : `${playerName(stats[0].hearts > stats[1].hearts ? 0 : 1)} takes the evening.`;

  const shareSummary = () => {
    const lines = [
      `Our First Date evening 🌹`,
      `${minutes} min · ${plural(cardsPlayed, "card")}${levelsFinished.length ? ` · ${plural(levelsFinished.length, "level")} finished` : ""}`,
      `${playerName(0)}: ${stats[0].hearts} ♥  ·  ${playerName(1)}: ${stats[1].hearts} ♥`,
      result,
      ...(kept.length ? ["", "Cards we kept:", ...kept.map((k) => `• ${k.text}`)] : []),
    ];
    Share.share({ message: lines.join("\n") }).catch(() => {});
  };

  const background =
    screen === "home" || screen === "paywall" || screen === "setup" || screen === "summary"
      ? "#1a0510"
      : isDark
      ? "#0d0006"
      : "#fdf6f8";

  const Scoreboard = ({ dark }: { dark: boolean }) => (
    <View style={[styles.scoreboard, { backgroundColor: dark ? "#ffffff0d" : "#fff" }]}>
      {([0, 1] as const).map((i) => (
        <View key={i} style={styles.scoreCell}>
          <Text
            style={[styles.scoreName, { color: dark ? "#f5d8e8" : "#2d0a1a" }, screen === "card" && turn === i && styles.scoreNameActive]}
            numberOfLines={1}
          >
            {playerName(i)}
          </Text>
          <Text style={[styles.scoreHearts, { color: dark ? "#e0305a" : "#9c3060" }]}>{stats[i].hearts} ♥</Text>
        </View>
      ))}
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: background }]}>
      <StatusBar style={onDarkBackground ? "light" : "dark"} />

      {screen === "home" && (
        <View style={styles.center}>
          <Text style={styles.rose}>🌹</Text>
          <Text style={styles.title}>First{"\n"}<Text style={styles.titleItalic}>Date</Text></Text>
          <Text style={styles.subtitle}>QUESTIONS & DARES</Text>
          <TouchableOpacity style={styles.btnPrimary} onPress={() => setScreen(eveningStart ? "levels" : "setup")}>
            <Text style={styles.btnPrimaryText}>{eveningStart ? "Continue the Evening" : "Begin the Evening"}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.btnGhost, { marginTop: 12 }]} onPress={() => openMyCards("home")}>
            <Text style={styles.btnGhostText}>
              Your Cards{customCards.length ? ` (${customCards.length})` : ""}
            </Text>
          </TouchableOpacity>
          <Text style={styles.hint}>Take turns · Earn hearts · Write your own cards</Text>
        </View>
      )}

      {screen === "setup" && (
        <KeyboardAvoidingView style={styles.fill} behavior={Platform.OS === "ios" ? "padding" : undefined}>
          <ScrollView contentContainerStyle={styles.setupScreen} keyboardShouldPersistTaps="handled">
            <TouchableOpacity onPress={() => setScreen("home")}>
              <Text style={styles.back}>Back</Text>
            </TouchableOpacity>
            <Text style={[styles.heading, { color: "#f5d8e8" }]}>Who's playing?</Text>
            <Text style={[styles.subheading, { color: "#f5d8e888" }]}>
              You take turns. Answer a question for 1 ♥, do a dare for 2 ♥. Skip, and you get a forfeit instead.
            </Text>
            {([0, 1] as const).map((i) => (
              <TextInput
                key={i}
                style={styles.nameInput}
                placeholder={`Player ${i + 1}`}
                placeholderTextColor="#f5d8e855"
                value={names[i]}
                maxLength={20}
                autoCapitalize="words"
                returnKeyType={i === 0 ? "next" : "done"}
                onChangeText={(t) => setNames((n) => (i === 0 ? [t, n[1]] : [n[0], t]))}
              />
            ))}
            <TouchableOpacity style={[styles.btnPrimary, { marginTop: 16 }]} onPress={startEvening}>
              <Text style={styles.btnPrimaryText}>Start</Text>
            </TouchableOpacity>
          </ScrollView>
        </KeyboardAvoidingView>
      )}

      {screen === "levels" && (
        <ScrollView style={styles.fill} contentContainerStyle={{ padding: 24, paddingTop: 60 }}>
          <TouchableOpacity onPress={() => setScreen("home")}>
            <Text style={styles.back}>Home</Text>
          </TouchableOpacity>
          <Text style={styles.heading}>Choose your level</Text>
          <Text style={styles.subheading}>How brave are you feeling tonight?</Text>
          <Scoreboard dark={false} />
          {LEVELS.map((lvl) => {
            const mine = customCards.filter((c) => c.levelId === lvl.id).length;
            const finished = levelsFinished.includes(lvl.id);
            return (
              <TouchableOpacity
                key={lvl.id}
                style={[styles.levelCard, { backgroundColor: lvl.darkTheme ? "#1a0510" : "#fff" }]}
                onPress={() => startLevel(lvl.id)}
              >
                <View style={[styles.levelIcon, { backgroundColor: lvl.accent + "22" }]}>
                  <Text style={{ fontSize: 22 }}>{lvl.emoji}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.levelName, { color: lvl.darkTheme ? "#f5d8e8" : lvl.dark }]}>
                    Level {lvl.id} — {lvl.name}
                  </Text>
                  <Text style={[styles.levelSub, { color: lvl.darkTheme ? "#f5d8e888" : "#9c6070" }]}>
                    {lvl.subtitle}
                    {mine ? ` · +${mine} of yours` : ""}
                    {finished ? " · Done ✓" : ""}
                  </Text>
                </View>
                {lvl.id === PAID_LEVEL_ID && !purchase.unlocked ? (
                  <Text style={{ fontSize: 18 }}>🔒</Text>
                ) : (
                  <Text style={{ color: lvl.accent, fontSize: 20 }}>›</Text>
                )}
              </TouchableOpacity>
            );
          })}
          <View style={styles.row}>
            <TouchableOpacity style={[styles.btnSecondary, styles.half]} onPress={() => openMyCards("levels")}>
              <Text style={styles.btnSecondaryText}>Your Cards</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.btnSecondary, styles.half]} onPress={endEvening}>
              <Text style={styles.btnSecondaryText}>End Evening</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.privacyLink} onPress={() => Linking.openURL(PRIVACY_URL)}>
            <Text style={styles.privacyLinkText}>Privacy Policy</Text>
          </TouchableOpacity>
        </ScrollView>
      )}

      {screen === "paywall" && (
        <View style={styles.center}>
          <TouchableOpacity style={styles.paywallBack} onPress={() => setScreen("levels")}>
            <Text style={styles.back}>Back</Text>
          </TouchableOpacity>
          <Text style={{ fontSize: 60, marginBottom: 16 }}>{paidLevel.emoji}</Text>
          <Text style={[styles.heading, { color: "#f5d8e8", textAlign: "center" }]}>
            Level {paidLevel.id} — {paidLevel.name}
          </Text>
          <Text style={[styles.subheading, { color: "#f5d8e888", textAlign: "center", marginBottom: 40 }]}>
            {paidLevel.cards.length} more cards, and you can add your own.{"\n"}A one-time purchase, yours to keep.
          </Text>
          {purchase.loadFailed ? (
            <TouchableOpacity style={styles.btnPrimary} onPress={purchase.retry}>
              <Text style={styles.btnPrimaryText}>Try Again</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[styles.btnPrimary, (!purchase.price || purchase.busy) && { opacity: 0.5 }]}
              disabled={!purchase.price || purchase.busy}
              onPress={purchase.buy}
            >
              <Text style={styles.btnPrimaryText}>
                {purchase.price ? `Unlock for ${purchase.price}` : "Loading price…"}
              </Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity style={styles.restore} disabled={purchase.busy} onPress={purchase.restore}>
            <Text style={styles.restoreText}>Restore Purchase</Text>
          </TouchableOpacity>
          {purchase.loadFailed && (
            <Text style={styles.paywallNote}>Couldn't load the price. Check your connection and try again.</Text>
          )}
          {purchase.message && <Text style={styles.paywallNote}>{purchase.message}</Text>}
          {isSimulatedStore && <Text style={styles.paywallNote}>Test mode: no real payment is made here.</Text>}
        </View>
      )}

      {screen === "card" && level && card && (
        <ScrollView style={[styles.fill, { backgroundColor: background }]} contentContainerStyle={styles.cardScreen}>
          <View style={styles.cardHeader}>
            <TouchableOpacity onPress={() => setScreen("levels")}>
              <Text style={[styles.back, { color: isDark ? "#e0305a" : level.accent, marginBottom: 0 }]}>Levels</Text>
            </TouchableOpacity>
            <Text style={{ color: isDark ? "#ffffff44" : "#9c6070", fontSize: 13 }}>
              {cardIndex + 1} / {deck.length}
            </Text>
          </View>
          <View style={styles.progressBg}>
            <View
              style={[
                styles.progressFill,
                { width: `${((cardIndex + 1) / deck.length) * 100}%`, backgroundColor: isDark ? "#e0305a" : level.accent },
              ]}
            />
          </View>

          <Text style={[styles.turn, { color: isDark ? "#f5d8e8" : level.dark }]}>
            {forfeit ? `Forfeit for ${playerName(turn)}` : `${playerName(turn)}'s turn`}
          </Text>

          <View
            style={[
              styles.card,
              { backgroundColor: isDark ? "#1a0510" : "#fff", shadowColor: level.accent },
              forfeit && { borderWidth: 1.5, borderColor: level.accent },
            ]}
          >
            {!forfeit && (
              <TouchableOpacity style={styles.keep} onPress={toggleKeep} hitSlop={12}>
                <Text style={{ fontSize: 22, color: isDark ? "#e0305a" : level.accent }}>{isKept(card) ? "★" : "☆"}</Text>
              </TouchableOpacity>
            )}
            <View style={[styles.badge, { borderColor: level.accent + "44", backgroundColor: level.accent + "18" }]}>
              <Text style={[styles.badgeText, { color: isDark ? "#e0305a" : level.accent }]}>
                {forfeit ? "FORFEIT" : `${card.custom ? "YOUR " : ""}${isDare(card.type) ? "DARE" : "QUESTION"}`}
              </Text>
            </View>
            <Text
              style={[
                styles.cardText,
                { color: isDark ? "#f5d8e8" : "#2d0a1a", fontStyle: forfeit || isDare(card.type) ? "italic" : "normal" },
              ]}
            >
              {forfeit ?? card.text}
            </Text>
          </View>

          {forfeit ? (
            <TouchableOpacity style={styles.btnPrimary} onPress={advance}>
              <Text style={styles.btnPrimaryText}>Forfeit Done</Text>
            </TouchableOpacity>
          ) : (
            <>
              <TouchableOpacity style={styles.btnPrimary} onPress={completeCard}>
                <Text style={styles.btnPrimaryText}>
                  {isDare(card.type) ? "Dare Done" : "Answered"}  +{heartsFor(card.type)} ♥
                </Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.skip} onPress={skipCard}>
                <Text style={[styles.skipText, { color: isDark ? "#f5d8e888" : "#9c6070" }]}>Skip and take a forfeit</Text>
              </TouchableOpacity>
            </>
          )}

          <View style={{ marginTop: 20 }}>
            <Scoreboard dark={isDark} />
          </View>
          <Text style={[styles.levelLabel, { color: isDark ? "#ffffff22" : "#9c607066" }]}>
            Level {level.id} — {level.name} · ☆ keeps a card for the end of the evening
          </Text>
        </ScrollView>
      )}

      {screen === "complete" && level && (
        <ScrollView style={styles.fill} contentContainerStyle={[styles.center, { paddingTop: 60 }]}>
          <Text style={{ fontSize: 60, marginBottom: 16 }}>🌹</Text>
          <Text style={[styles.heading, isDark && { color: "#f5d8e8" }]}>Level Complete</Text>
          <Text style={[styles.subheading, { textAlign: "center", marginBottom: 24 }]}>
            You finished {level.name}.{"\n"}The night is just getting started...
          </Text>
          <View style={{ width: "100%", marginBottom: 20 }}>
            <Scoreboard dark={isDark} />
          </View>
          {level.id < LEVELS.length && (
            <View style={styles.nextCard}>
              <Text style={{ fontSize: 28, marginBottom: 8 }}>{LEVELS[level.id].emoji}</Text>
              <Text style={styles.levelName}>Level {level.id + 1} — {LEVELS[level.id].name}</Text>
              <Text style={[styles.levelSub, { marginBottom: 16 }]}>{LEVELS[level.id].subtitle}</Text>
              <TouchableOpacity style={styles.btnPrimary} onPress={() => startLevel(level.id + 1)}>
                <Text style={styles.btnPrimaryText}>Play Next Level</Text>
              </TouchableOpacity>
            </View>
          )}
          <TouchableOpacity style={[styles.btnSecondary, { marginTop: 12 }]} onPress={() => setScreen("levels")}>
            <Text style={styles.btnSecondaryText}>Back to Levels</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.btnSecondary, { marginTop: 12 }]} onPress={endEvening}>
            <Text style={styles.btnSecondaryText}>End the Evening</Text>
          </TouchableOpacity>
        </ScrollView>
      )}

      {screen === "mycards" && (
        <KeyboardAvoidingView style={styles.fill} behavior={Platform.OS === "ios" ? "padding" : undefined}>
          <ScrollView contentContainerStyle={{ padding: 24, paddingTop: 60 }} keyboardShouldPersistTaps="handled">
            <TouchableOpacity onPress={() => setScreen(myCardsBack)}>
              <Text style={styles.back}>Back</Text>
            </TouchableOpacity>
            <Text style={styles.heading}>Your Cards</Text>
            <Text style={styles.subheading}>
              Write your own questions and dares. They're shuffled into the level you choose, and they stay on this phone.
            </Text>

            <View style={styles.formCard}>
              <View style={styles.row}>
                {(["question", "challenge"] as const).map((t) => (
                  <TouchableOpacity
                    key={t}
                    style={[styles.chip, draftType === t && styles.chipActive]}
                    onPress={() => setDraftType(t)}
                  >
                    <Text style={[styles.chipText, draftType === t && styles.chipTextActive]}>
                      {isDare(t) ? "Dare" : "Question"}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              <TextInput
                style={styles.cardInput}
                placeholder={draftType === "question" ? "What would you like to ask?" : "What should they do?"}
                placeholderTextColor="#9c607088"
                value={draftText}
                onChangeText={setDraftText}
                maxLength={MAX_CARD_LENGTH}
                multiline
              />
              <Text style={styles.formLabel}>Add to level</Text>
              <View style={styles.levelRow}>
                {LEVELS.map((lvl) => {
                  const locked = lvl.id === PAID_LEVEL_ID && !purchase.unlocked;
                  return (
                    <TouchableOpacity
                      key={lvl.id}
                      disabled={locked}
                      style={[styles.levelChip, draftLevel === lvl.id && { borderColor: lvl.accent, backgroundColor: lvl.accent + "18" }, locked && { opacity: 0.4 }]}
                      onPress={() => setDraftLevel(lvl.id)}
                    >
                      <Text style={{ fontSize: 18 }}>{locked ? "🔒" : lvl.emoji}</Text>
                      <Text style={styles.levelChipText}>{lvl.id}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
              <TouchableOpacity
                style={[styles.btnPrimary, { marginTop: 16 }, !draftText.trim() && { opacity: 0.5 }]}
                disabled={!draftText.trim()}
                onPress={addCustomCard}
              >
                <Text style={styles.btnPrimaryText}>Add Card</Text>
              </TouchableOpacity>
            </View>

            {customCards.length === 0 ? (
              <Text style={[styles.subheading, { textAlign: "center", marginTop: 8 }]}>No cards yet. Your first one goes here.</Text>
            ) : (
              LEVELS.map((lvl) => {
                const mine = customCards.filter((c) => c.levelId === lvl.id);
                if (!mine.length) return null;
                return (
                  <View key={lvl.id} style={{ marginBottom: 12 }}>
                    <Text style={[styles.formLabel, { color: lvl.dark }]}>
                      {lvl.emoji} Level {lvl.id} — {lvl.name}
                    </Text>
                    {mine.map((c) => (
                      <View key={c.id} style={styles.myCardRow}>
                        <View style={{ flex: 1 }}>
                          <Text style={[styles.badgeText, { color: lvl.accent, marginBottom: 4 }]}>
                            {isDare(c.type) ? "DARE" : "QUESTION"}
                          </Text>
                          <Text style={styles.myCardText}>{c.text}</Text>
                        </View>
                        <TouchableOpacity onPress={() => deleteCustomCard(c.id)} hitSlop={10}>
                          <Text style={styles.deleteText}>Delete</Text>
                        </TouchableOpacity>
                      </View>
                    ))}
                  </View>
                );
              })
            )}
          </ScrollView>
        </KeyboardAvoidingView>
      )}

      {screen === "summary" && (
        <ScrollView style={styles.fill} contentContainerStyle={{ padding: 24, paddingTop: 70 }}>
          <Text style={{ fontSize: 56, textAlign: "center", marginBottom: 8 }}>🌹</Text>
          <Text style={[styles.heading, { color: "#f5d8e8", textAlign: "center" }]}>Your Evening</Text>
          <Text style={[styles.subheading, { color: "#f5d8e888", textAlign: "center" }]}>
            {minutes} min · {plural(cardsPlayed, "card")}
            {levelsFinished.length ? ` · ${plural(levelsFinished.length, "level")} finished` : ""}
          </Text>

          <Text style={styles.result}>{result}</Text>

          <View style={styles.row}>
            {([0, 1] as const).map((i) => (
              <View key={i} style={[styles.summaryCard, styles.half]}>
                <Text style={styles.summaryName} numberOfLines={1}>{playerName(i)}</Text>
                <Text style={styles.summaryHearts}>{stats[i].hearts} ♥</Text>
                <Text style={styles.summaryLine}>{stats[i].questions} answered</Text>
                <Text style={styles.summaryLine}>{plural(stats[i].dares, "dare")} done</Text>
                <Text style={styles.summaryLine}>{plural(stats[i].skips, "forfeit")}</Text>
              </View>
            ))}
          </View>

          <Text style={styles.summarySection}>Cards you kept</Text>
          {kept.length === 0 ? (
            <Text style={styles.summaryLine}>None tonight. Tap ☆ on a card to keep it here next time.</Text>
          ) : (
            kept.map((k, i) => (
              <View key={i} style={styles.keptRow}>
                <Text style={{ fontSize: 16 }}>{LEVELS[k.levelId - 1].emoji}</Text>
                <Text style={styles.keptText}>{k.text}</Text>
              </View>
            ))
          )}

          <TouchableOpacity style={[styles.btnPrimary, { marginTop: 28 }]} onPress={shareSummary}>
            <Text style={styles.btnPrimaryText}>Share Our Evening</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.btnGhost, { marginTop: 12 }]} onPress={() => setScreen("levels")}>
            <Text style={styles.btnGhostText}>Keep Playing</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.btnGhost, { marginTop: 12 }]} onPress={newEvening}>
            <Text style={styles.btnGhostText}>New Evening</Text>
          </TouchableOpacity>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center" },
  fill: { flex: 1, width: "100%" },
  center: { flexGrow: 1, alignItems: "center", justifyContent: "center", padding: 24, width: "100%" },
  row: { flexDirection: "row", gap: 10, flexWrap: "wrap" },
  half: { flex: 1 },
  rose: { fontSize: 80, marginBottom: 8 },
  title: { fontSize: 52, fontWeight: "700", color: "#f5d8e8", textAlign: "center", lineHeight: 56 },
  titleItalic: { fontStyle: "italic", fontWeight: "400", color: "#e8a0b8" },
  subtitle: { color: "#f5d8e888", fontSize: 13, letterSpacing: 3, marginTop: 12, marginBottom: 48 },
  hint: { color: "#f5d8e855", fontSize: 12, marginTop: 24, letterSpacing: 1, textAlign: "center" },
  back: { color: "#c9748a", fontSize: 14, letterSpacing: 1, marginBottom: 24 },
  heading: { fontSize: 30, fontWeight: "700", color: "#2d0a1a", marginBottom: 6 },
  subheading: { color: "#9c6070", fontSize: 14, marginBottom: 28, lineHeight: 20 },
  setupScreen: { flexGrow: 1, padding: 24, paddingTop: 60 },
  nameInput: { borderWidth: 1.5, borderColor: "#f5d8e833", borderRadius: 16, paddingHorizontal: 18, paddingVertical: 16, fontSize: 18, color: "#f5d8e8", marginBottom: 14 },
  scoreboard: { flexDirection: "row", borderRadius: 18, paddingVertical: 12, paddingHorizontal: 8, marginBottom: 18, shadowColor: "#9c3060", shadowOpacity: 0.06, shadowRadius: 10, shadowOffset: { width: 0, height: 3 }, elevation: 2 },
  scoreCell: { flex: 1, alignItems: "center" },
  scoreName: { fontSize: 14, marginBottom: 2, maxWidth: "90%" },
  scoreNameActive: { fontWeight: "700", textDecorationLine: "underline" },
  scoreHearts: { fontSize: 20, fontWeight: "700" },
  levelCard: { borderRadius: 20, padding: 20, marginBottom: 14, flexDirection: "row", alignItems: "center", gap: 14, shadowColor: "#9c3060", shadowOpacity: 0.08, shadowRadius: 12, shadowOffset: { width: 0, height: 4 }, elevation: 3 },
  levelIcon: { width: 44, height: 44, borderRadius: 22, alignItems: "center", justifyContent: "center" },
  levelName: { fontSize: 18, fontWeight: "700", marginBottom: 2 },
  levelSub: { fontSize: 13 },
  cardScreen: { flexGrow: 1, padding: 24, paddingTop: 60 },
  cardHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 28 },
  progressBg: { height: 2, backgroundColor: "#e0d0d844", borderRadius: 2, marginBottom: 24 },
  progressFill: { height: 2, borderRadius: 2 },
  turn: { fontSize: 15, fontWeight: "600", letterSpacing: 1, textAlign: "center", marginBottom: 14 },
  card: { borderRadius: 28, padding: 40, marginBottom: 24, shadowOpacity: 0.15, shadowRadius: 20, shadowOffset: { width: 0, height: 10 }, elevation: 6, alignItems: "center" },
  keep: { position: "absolute", top: 16, right: 18 },
  badge: { borderWidth: 1, borderRadius: 20, paddingHorizontal: 14, paddingVertical: 6, marginBottom: 24 },
  badgeText: { fontSize: 11, letterSpacing: 2 },
  cardText: { fontSize: 22, lineHeight: 34, textAlign: "center", fontWeight: "400" },
  skip: { paddingVertical: 14, alignItems: "center" },
  skipText: { fontSize: 14, letterSpacing: 1 },
  levelLabel: { fontSize: 11, letterSpacing: 1.5, textAlign: "center", marginTop: 8, textTransform: "uppercase", lineHeight: 18 },
  nextCard: { backgroundColor: "#fff", borderRadius: 20, padding: 24, width: "100%", alignItems: "center", shadowColor: "#9c3060", shadowOpacity: 0.1, shadowRadius: 16, shadowOffset: { width: 0, height: 6 }, elevation: 4 },
  btnPrimary: { backgroundColor: "#9c3060", borderRadius: 50, paddingVertical: 16, paddingHorizontal: 36, width: "100%", alignItems: "center", shadowColor: "#9c3060", shadowOpacity: 0.4, shadowRadius: 12, shadowOffset: { width: 0, height: 4 }, elevation: 4 },
  btnPrimaryText: { color: "#fff", fontSize: 16, letterSpacing: 1.5, textTransform: "uppercase", fontWeight: "600" },
  btnSecondary: { borderWidth: 1.5, borderColor: "#c9748a", borderRadius: 50, paddingVertical: 14, paddingHorizontal: 20, width: "100%", alignItems: "center" },
  btnSecondaryText: { color: "#9c3060", fontSize: 15, letterSpacing: 1 },
  btnGhost: { borderWidth: 1.5, borderColor: "#f5d8e844", borderRadius: 50, paddingVertical: 14, paddingHorizontal: 20, width: "100%", alignItems: "center" },
  btnGhostText: { color: "#f5d8e8", fontSize: 15, letterSpacing: 1 },
  privacyLink: { alignSelf: "center", paddingVertical: 12, marginTop: 12 },
  privacyLinkText: { color: "#9c6070", fontSize: 13, textDecorationLine: "underline" },
  paywallBack: { position: "absolute", top: 60, left: 24 },
  restore: { paddingVertical: 16, marginTop: 8 },
  restoreText: { color: "#e8a0b8", fontSize: 14, letterSpacing: 1 },
  paywallNote: { color: "#f5d8e888", fontSize: 13, textAlign: "center", marginTop: 8 },
  formCard: { backgroundColor: "#fff", borderRadius: 20, padding: 18, marginBottom: 24, shadowColor: "#9c3060", shadowOpacity: 0.08, shadowRadius: 12, shadowOffset: { width: 0, height: 4 }, elevation: 3 },
  chip: { borderWidth: 1.5, borderColor: "#e0d0d8", borderRadius: 20, paddingHorizontal: 16, paddingVertical: 8 },
  chipActive: { borderColor: "#9c3060", backgroundColor: "#9c306018" },
  chipText: { color: "#9c6070", fontSize: 14 },
  chipTextActive: { color: "#9c3060", fontWeight: "600" },
  cardInput: { borderWidth: 1.5, borderColor: "#e0d0d8", borderRadius: 14, padding: 14, minHeight: 90, fontSize: 16, color: "#2d0a1a", marginTop: 14, textAlignVertical: "top" },
  formLabel: { fontSize: 12, letterSpacing: 1.5, textTransform: "uppercase", color: "#9c6070", marginTop: 16, marginBottom: 8 },
  levelRow: { flexDirection: "row", gap: 8 },
  levelChip: { flex: 1, borderWidth: 1.5, borderColor: "#e0d0d8", borderRadius: 14, paddingVertical: 6, alignItems: "center" },
  levelChipText: { fontSize: 12, color: "#9c6070", marginTop: 2 },
  myCardRow: { backgroundColor: "#fff", borderRadius: 14, padding: 14, marginBottom: 8, flexDirection: "row", alignItems: "center", gap: 12 },
  myCardText: { fontSize: 15, color: "#2d0a1a", lineHeight: 21 },
  deleteText: { color: "#c9748a", fontSize: 13 },
  result: { color: "#e8a0b8", fontSize: 20, fontStyle: "italic", textAlign: "center", marginBottom: 20 },
  summaryCard: { backgroundColor: "#ffffff0d", borderRadius: 18, padding: 18, alignItems: "center" },
  summaryName: { color: "#f5d8e8", fontSize: 16, fontWeight: "600", marginBottom: 4 },
  summaryHearts: { color: "#e0305a", fontSize: 28, fontWeight: "700", marginBottom: 8 },
  summaryLine: { color: "#f5d8e888", fontSize: 13, lineHeight: 20 },
  summarySection: { color: "#f5d8e8", fontSize: 13, letterSpacing: 2, textTransform: "uppercase", marginTop: 28, marginBottom: 10 },
  keptRow: { flexDirection: "row", gap: 10, paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: "#ffffff11" },
  keptText: { flex: 1, color: "#f5d8e8", fontSize: 15, lineHeight: 21 },
});
