import { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Linking } from "react-native";
import { StatusBar } from "expo-status-bar";
import { isSimulatedStore, useUntamedPurchase } from "./purchases";

type CardType = { type: string; text: string };
type LevelType = {
  id: number;
  name: string;
  subtitle: string;
  emoji: string;
  accent: string;
  dark: string;
  darkTheme: boolean;
  cards: CardType[];
};

const LEVELS: LevelType[] = [
  {
    id: 1, name: "Icebreaker", subtitle: "Let's get comfortable", emoji: "🌸", accent: "#c9748a", dark: "#7a3348", darkTheme: false,
    cards: [
      { type: "question", text: "What's your favorite color and why?" },
      { type: "question", text: "Are you a morning person or a night owl?" },
      { type: "question", text: "What's your go-to comfort food?" },
      { type: "challenge", text: "Tell each other one thing you noticed about the other when you first met." },
      { type: "question", text: "What's the last show you binged?" },
      { type: "question", text: "Dogs or cats — and why?" },
      { type: "challenge", text: "Share your most-used emoji right now." },
      { type: "question", text: "What's your favorite season?" },
      { type: "question", text: "Tea, coffee, or neither?" },
      { type: "question", text: "What's your hometown like?" },
      { type: "question", text: "Do you have any siblings?" },
      { type: "question", text: "What's your favorite type of music?" },
      { type: "question", text: "Are you more of a homebody or an adventurer?" },
      { type: "challenge", text: "Show each other your phone's home screen." },
      { type: "question", text: "What did you want to be when you grew up?" },
      { type: "question", text: "What's your favorite movie genre?" },
      { type: "question", text: "Do you prefer sweet or savory?" },
      { type: "question", text: "What's a hobby you could talk about for hours?" },
      { type: "question", text: "What's your favorite day of the week?" },
      { type: "challenge", text: "Name three things you two might have in common." },
      { type: "question", text: "Beach, mountains, or city?" },
      { type: "question", text: "What's the last book you read?" },
      { type: "question", text: "Are you a planner or a spontaneous person?" },
      { type: "question", text: "What's a movie that always makes you laugh?" },
      { type: "question", text: "What's something you collect, even casually?" },
      { type: "challenge", text: "Teach each other a word from a language you know." },
      { type: "question", text: "What's your earliest childhood memory?" },
      { type: "question", text: "Do you prefer cooking at home or eating out?" },
      { type: "question", text: "What's your go-to road trip snack?" },
      { type: "question", text: "Are you more of a texter or a caller?" },
      { type: "question", text: "What's a sport or activity you've always wanted to try?" },
      { type: "challenge", text: "Show each other the last song you listened to." },
      { type: "question", text: "Window seat or aisle seat?" },
      { type: "question", text: "What's your star sign — do you believe in it?" },
      { type: "question", text: "What's your favorite holiday?" },
      { type: "question", text: "What's something you're surprisingly good at?" },
      { type: "challenge", text: "Each pick one word to describe tonight so far." },
      { type: "question", text: "What does your perfect Saturday look like?" },
      { type: "question", text: "What's the weirdest thing you've ever eaten?" },
      { type: "question", text: "Do you have any recurring dreams?" },
      { type: "question", text: "What app do you use the most?" },
      { type: "question", text: "What's your favorite thing about where you live?" },
      { type: "challenge", text: "Say one genuine thing you like about the other person." },
      { type: "question", text: "What's your comfort movie — the one you rewatch?" },
      { type: "question", text: "Are you more introverted or extroverted?" },
      { type: "question", text: "What's a word you always misspell?" },
      { type: "question", text: "What's your favorite type of weather?" },
      { type: "question", text: "What's a skill you wish you had?" },
      { type: "challenge", text: "Take a silly selfie together right now." },
      { type: "question", text: "If you could live anywhere for a year, where would it be?" },
    ],
  },
  {
    id: 2, name: "Getting Warmer", subtitle: "A little more personal", emoji: "🌹", accent: "#c96a4a", dark: "#7a2e1a", darkTheme: false,
    cards: [
      { type: "question", text: "What's something you're really proud of?" },
      { type: "question", text: "What does your perfect Sunday look like?" },
      { type: "challenge", text: "Show each other the last photo on your camera roll." },
      { type: "question", text: "What's one habit you wish you could break?" },
      { type: "question", text: "What's the best trip you've ever taken?" },
      { type: "challenge", text: "Do your best impression of someone — let your date guess who." },
      { type: "question", text: "What's something most people don't know about you?" },
      { type: "question", text: "What's your love language?" },
      { type: "question", text: "What's your biggest fear?" },
      { type: "question", text: "What's a belief you hold that surprises people?" },
      { type: "question", text: "What does success mean to you?" },
      { type: "question", text: "What's the hardest thing you've been through?" },
      { type: "challenge", text: "Show each other a photo of someone important to you and explain why." },
      { type: "question", text: "What's something you're currently working on improving?" },
      { type: "question", text: "What's a value you would never compromise on?" },
      { type: "question", text: "What's been the best year of your life so far?" },
      { type: "question", text: "What kind of relationship did you have with your parents growing up?" },
      { type: "question", text: "What's something you've changed your mind about recently?" },
      { type: "challenge", text: "Each describe your ideal future in exactly three sentences." },
      { type: "question", text: "What does friendship mean to you?" },
      { type: "question", text: "What's a moment that defined who you are today?" },
      { type: "question", text: "What are you most grateful for right now?" },
      { type: "challenge", text: "Tell each other something you are genuinely insecure about." },
      { type: "question", text: "What's a lesson you learned the hard way?" },
      { type: "question", text: "How do you handle conflict?" },
      { type: "question", text: "What's something your younger self would be shocked by today?" },
      { type: "question", text: "What do you need most when you're upset?" },
      { type: "question", text: "Who knows you best in the world?" },
      { type: "challenge", text: "Each send a voice message to someone you love right now." },
      { type: "question", text: "What's a dream you've let go of — and are you at peace with it?" },
      { type: "question", text: "What does a healthy relationship look like to you?" },
      { type: "question", text: "What's something you're still figuring out about yourself?" },
      { type: "question", text: "What's your relationship with money like?" },
      { type: "challenge", text: "Say something kind to each other that you would normally only say after months of knowing someone." },
      { type: "question", text: "What do you think is your biggest strength?" },
      { type: "question", text: "What's something you deeply regret?" },
      { type: "question", text: "How do you recharge after a hard week?" },
      { type: "question", text: "What's your relationship with social media?" },
      { type: "question", text: "What's one thing you want to do before you die?" },
      { type: "challenge", text: "Each share a photo that means a lot to you and tell the story." },
      { type: "question", text: "What's something you've never told anyone on a first date?" },
      { type: "question", text: "How has your childhood shaped who you are?" },
      { type: "question", text: "What's something you've had to forgive yourself for?" },
      { type: "challenge", text: "Describe each other's energy in one word." },
      { type: "question", text: "What's a red flag you've ignored in the past?" },
      { type: "question", text: "What does love look like in action to you?" },
      { type: "question", text: "What's a version of yourself you've outgrown?" },
      { type: "challenge", text: "Hold a 60-second conversation using only questions." },
      { type: "question", text: "What's something that makes you irrationally happy?" },
      { type: "question", text: "If you could change one thing about yourself, what would it be?" },
    ],
  },
  {
    id: 3, name: "Sparks", subtitle: "Now we're flirting", emoji: "🔥", accent: "#c87c2a", dark: "#7a3e08", darkTheme: false,
    cards: [
      { type: "question", text: "What's the most spontaneous thing you've ever done?" },
      { type: "challenge", text: "Hold eye contact for 30 seconds without looking away." },
      { type: "question", text: "What do you find most attractive in a person?" },
      { type: "challenge", text: "Give your date a genuine, specific compliment about their appearance." },
      { type: "question", text: "What's a deal-breaker for you in a relationship?" },
      { type: "question", text: "Do you believe in love at first sight?" },
      { type: "question", text: "What's the most romantic thing someone has ever done for you?" },
      { type: "challenge", text: "Show each other the most flirtatious text you've ever sent." },
      { type: "question", text: "What's your idea of a perfect date — not this one?" },
      { type: "question", text: "What's something you do that you find attractive about yourself?" },
      { type: "challenge", text: "Text your best friend: I think I am falling for someone. Show each other the replies." },
      { type: "question", text: "Have you ever fallen for someone you were not supposed to?" },
      { type: "question", text: "What's your most embarrassing date story?" },
      { type: "question", text: "What's the first thing you noticed about me?" },
      { type: "challenge", text: "Take turns saying one thing that's been on your mind since you arrived." },
      { type: "question", text: "How important is physical attraction to you?" },
      { type: "question", text: "What song would you dedicate to someone you're falling for?" },
      { type: "challenge", text: "Each say the last thing you googled — no hiding it." },
      { type: "question", text: "What makes someone undeniably attractive to you beyond looks?" },
      { type: "question", text: "What's your flirting style?" },
      { type: "challenge", text: "Look your date in the eyes and tell them one thing you find beautiful about them." },
      { type: "question", text: "What's a scent that drives you crazy?" },
      { type: "question", text: "Do you fall fast, or do you take your time?" },
      { type: "question", text: "What's something small that gives you butterflies?" },
      { type: "challenge", text: "Both lean in slightly closer than you normally would. Stay there for the next question." },
      { type: "question", text: "What's the most attractive quality someone can have in a conversation?" },
      { type: "question", text: "Do you believe in soulmates?" },
      { type: "question", text: "What's the boldest move you've ever made on someone you liked?" },
      { type: "challenge", text: "Swap phones for 60 seconds — no reading messages, just feel the vibe of their phone." },
      { type: "question", text: "What song would be playing in the background of your first kiss?" },
      { type: "question", text: "How do you know when chemistry is real?" },
      { type: "challenge", text: "Move closer so your knees are almost touching. Stay like this." },
      { type: "question", text: "Have you ever kissed someone on a first date?" },
      { type: "question", text: "What's your best physical feature — in your own opinion?" },
      { type: "challenge", text: "Describe what you think the other person smells like right now — then confirm." },
      { type: "question", text: "What do you do when you're trying to impress someone?" },
      { type: "question", text: "Do you think we have chemistry?" },
      { type: "challenge", text: "Give your date a slow, intentional once-over. Tell them what you see." },
      { type: "question", text: "Have you been thinking about kissing me tonight?" },
      { type: "question", text: "What's something about yourself that gets better with time?" },
      { type: "challenge", text: "Touch your date's hand for exactly 10 seconds." },
      { type: "question", text: "Would you rather be kissed unexpectedly or asked first?" },
      { type: "question", text: "What's the most irresistible thing someone can do on a date?" },
      { type: "challenge", text: "Whisper something you would only say after three dates." },
      { type: "question", text: "When did you first feel something tonight?" },
      { type: "question", text: "What's your best trait in a relationship?" },
      { type: "challenge", text: "Lean in and say something in your date's ear. Make it worth it." },
      { type: "question", text: "What kind of touch do you find most intimate?" },
      { type: "challenge", text: "Look at each other for 45 seconds. No talking. Just look." },
      { type: "question", text: "If tonight ends with a kiss — would that be too fast?" },
    ],
  },
  {
    id: 4, name: "Desire", subtitle: "Things are heating up", emoji: "💋", accent: "#9c3060", dark: "#5a1030", darkTheme: false,
    cards: [
      { type: "question", text: "What's your biggest turn-on?" },
      { type: "challenge", text: "Feed each other a bite of something on the table." },
      { type: "question", text: "Describe your ideal physical connection with a partner." },
      { type: "challenge", text: "Whisper something you haven't told anyone tonight into your date's ear." },
      { type: "question", text: "What's a fantasy you've never shared with anyone?" },
      { type: "challenge", text: "Take your date's hand and trace slow circles on their palm for 30 seconds." },
      { type: "question", text: "What part of someone's body do you find most attractive?" },
      { type: "challenge", text: "Kiss your date's hand — slowly, looking them in the eyes." },
      { type: "question", text: "What's something that instantly gets you in the mood?" },
      { type: "question", text: "Have you ever had a secret crush on someone you should not have?" },
      { type: "challenge", text: "Run a finger slowly from your date's wrist to their elbow." },
      { type: "question", text: "What's the most passionate thing you've ever done?" },
      { type: "question", text: "What does physical intimacy mean to you?" },
      { type: "challenge", text: "Look your date in the eyes and say: I am attracted to you." },
      { type: "question", text: "Where on your body do you like to be touched most?" },
      { type: "question", text: "What's the longest you've gone without sex — and how did it feel?" },
      { type: "challenge", text: "Gently tuck a strand of hair behind your date's ear." },
      { type: "question", text: "What's something you've always wanted to try in the bedroom?" },
      { type: "question", text: "How do you like to be kissed?" },
      { type: "challenge", text: "Slowly place your hand on your date's thigh. Keep it there for the next card." },
      { type: "question", text: "What's your favorite time of day for intimacy?" },
      { type: "question", text: "Have you ever been attracted to someone the instant you looked at them?" },
      { type: "challenge", text: "Press your foreheads together without saying a word for 30 seconds." },
      { type: "question", text: "What do you think you are like in bed — in one sentence?" },
      { type: "question", text: "What's a sound that turns you on?" },
      { type: "challenge", text: "Kiss your way slowly from your date's hand to their wrist." },
      { type: "question", text: "Do you prefer to give or receive?" },
      { type: "question", text: "What's the difference between passion and love for you?" },
      { type: "challenge", text: "Whisper what you would do if you two were alone right now." },
      { type: "question", text: "What's one thing you always wish a partner would do more of?" },
      { type: "question", text: "What's the sexiest quality about you that is not physical?" },
      { type: "challenge", text: "Lean in as close as possible without kissing. Hold it." },
      { type: "question", text: "When was the last time you felt truly desired?" },
      { type: "question", text: "What's something you want me to know about you, physically?" },
      { type: "challenge", text: "Slowly run your fingers through your date's hair." },
      { type: "question", text: "Fast and passionate, or slow and sensual?" },
      { type: "question", text: "What's the most aroused you've ever felt in public?" },
      { type: "challenge", text: "Put your lips close to your date's ear and describe what you're feeling." },
      { type: "question", text: "What's your go-to move when you want to seduce someone?" },
      { type: "question", text: "What does desire feel like in your body?" },
      { type: "challenge", text: "Tell your date one thing you would like to do to them later." },
      { type: "question", text: "What's a part of your body you want your date to notice?" },
      { type: "question", text: "What's the most turned on you've been from just a conversation?" },
      { type: "challenge", text: "Kiss your date's neck, just once, gently." },
      { type: "question", text: "If we were somewhere completely private right now — what would you do?" },
      { type: "question", text: "What type of touch makes you forget everything else?" },
      { type: "challenge", text: "Hold your date's face in both hands. Look at them. Say nothing." },
      { type: "question", text: "What would make tonight unforgettable?" },
      { type: "challenge", text: "Kiss — wherever feels right." },
      { type: "question", text: "What comes next?" },
    ],
  },
  {
    id: 5, name: "Untamed", subtitle: "No limits", emoji: "🖤", accent: "#e0305a", dark: "#ff6080", darkTheme: true,
    cards: [
      { type: "challenge", text: "Lick a small drop of something sweet off your date's fingertip." },
      { type: "question", text: "What's the wildest place you've ever hooked up — or would want to?" },
      { type: "challenge", text: "Kiss your date somewhere unexpected — not the lips." },
      { type: "question", text: "What's something physical you would love your date to do to you right now?" },
      { type: "challenge", text: "Slowly remove one item of your date's clothing." },
      { type: "challenge", text: "Kiss your way from your date's hand to their shoulder, slowly." },
      { type: "question", text: "How long could you go without — and what would break you first?" },
      { type: "question", text: "What's the dirtiest thought you've had tonight?" },
      { type: "challenge", text: "Blindfold your date with a piece of clothing. Touch them somewhere. They guess where." },
      { type: "question", text: "What's your wildest sexual fantasy?" },
      { type: "challenge", text: "Use your mouth only to remove something small from your date's body — no hands." },
      { type: "question", text: "What's something you would only do with someone you completely trust?" },
      { type: "challenge", text: "Describe out loud what you want to do to your date right now." },
      { type: "question", text: "Have you ever had a one-night stand? Would you again?" },
      { type: "challenge", text: "Take a body shot off your date." },
      { type: "question", text: "What's your most explicit fantasy involving a stranger?" },
      { type: "challenge", text: "Slowly unbutton one button on your date's shirt — or have them do yours." },
      { type: "question", text: "What's the most risque thing you've ever done in public?" },
      { type: "challenge", text: "Bite your date's lower lip gently when you next kiss them." },
      { type: "question", text: "Lights on or off — and why?" },
      { type: "challenge", text: "Sit in your date's lap for the next three cards." },
      { type: "question", text: "What's a position you've always wanted to try?" },
      { type: "challenge", text: "Whisper the filthiest thing you can think of into your date's ear." },
      { type: "question", text: "What's the longest and most intense make-out session you've ever had?" },
      { type: "challenge", text: "Trace your lips slowly across your date's collarbone." },
      { type: "question", text: "Role play — who would you be and what would the scenario be?" },
      { type: "challenge", text: "Feed your date something using only your mouth." },
      { type: "question", text: "What's the most turned on you've ever been in your life?" },
      { type: "challenge", text: "Kiss your date's inner wrist and hold your lips there for five seconds." },
      { type: "question", text: "Describe your perfect intimate evening — hour by hour." },
      { type: "challenge", text: "Tell your date exactly what you want them to do to you in the next hour." },
      { type: "question", text: "Have you ever sent an explicit photo? Would you?" },
      { type: "challenge", text: "Lick your date's neck slowly — just once." },
      { type: "question", text: "What's a limit you have — and what lies just beyond it?" },
      { type: "challenge", text: "Kiss your date's chest." },
      { type: "question", text: "What do you sound like when you're truly into it?" },
      { type: "challenge", text: "Run your hand from your date's knee slowly upward. Stop when they say stop." },
      { type: "question", text: "What's your most powerful physical memory with someone?" },
      { type: "challenge", text: "Undress your date — just a little. Just enough." },
      { type: "question", text: "What do you want from tonight — honestly?" },
      { type: "challenge", text: "Kiss your date's stomach." },
      { type: "question", text: "Is there anything left you haven't done that you want to do tonight?" },
      { type: "challenge", text: "Ask your date's permission to do something you've been holding back. Then do it." },
      { type: "question", text: "What's the most intimate thing that doesn't involve sex?" },
      { type: "challenge", text: "Lick your date's ear — softly." },
      { type: "question", text: "If there were no consequences, what would you do right now?" },
      { type: "challenge", text: "Get as physically close as possible without any clothing coming off." },
      { type: "question", text: "When did you know tonight was going somewhere?" },
      { type: "challenge", text: "The final dare: you decide together. Make it worth it." },
      { type: "question", text: "No more questions. Just you two." },
    ],
  },
];

const PAID_LEVEL_ID = 5;
const PRIVACY_URL = "https://olaimalm.github.io/firstdate-support/privacy.html";

export default function App() {
  const [screen, setScreen] = useState<string>("home");
  const [currentLevel, setCurrentLevel] = useState<number | null>(null);
  const [cardIndex, setCardIndex] = useState<number>(0);
  const purchase = useUntamedPurchase();

  const level = currentLevel ? LEVELS.find((l) => l.id === currentLevel) : null;
  const card = level ? level.cards[cardIndex] : null;
  const isDark = (screen === "card" || screen === "complete") && (level?.darkTheme ?? false);
  const onDarkBackground = screen === "home" || screen === "paywall" || isDark;
  const paidLevel = LEVELS[PAID_LEVEL_ID - 1];

  const startLevel = (lid: number) => {
    if (lid === PAID_LEVEL_ID && !purchase.unlocked) {
      setScreen("paywall");
      return;
    }
    setCurrentLevel(lid);
    setCardIndex(0);
    setScreen("card");
  };

  useEffect(() => {
    if (purchase.unlocked && screen === "paywall") {
      setCurrentLevel(PAID_LEVEL_ID);
      setCardIndex(0);
      setScreen("card");
    }
  }, [purchase.unlocked, screen]);

  const nextCard = () => {
    if (!level) return;
    if (cardIndex + 1 >= level.cards.length) {
      setScreen("complete");
    } else {
      setCardIndex((i) => i + 1);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: screen === "home" || screen === "paywall" ? "#1a0510" : isDark ? "#0d0006" : "#fdf6f8" }]}>
      <StatusBar style={onDarkBackground ? "light" : "dark"} />

      {screen === "home" && (
        <View style={styles.center}>
          <Text style={styles.rose}>🌹</Text>
          <Text style={styles.title}>First{"\n"}<Text style={styles.titleItalic}>Date</Text></Text>
          <Text style={styles.subtitle}>QUESTIONS & DARES</Text>
          <TouchableOpacity style={styles.btnPrimary} onPress={() => setScreen("levels")}>
            <Text style={styles.btnPrimaryText}>Begin the Evening</Text>
          </TouchableOpacity>
          <Text style={styles.hint}>5 levels · 50 cards each · First 4 free</Text>
        </View>
      )}

      {screen === "levels" && (
        <ScrollView style={{ width: "100%" }} contentContainerStyle={{ padding: 24, paddingTop: 60 }}>
          <TouchableOpacity onPress={() => setScreen("home")}>
            <Text style={styles.back}>Back</Text>
          </TouchableOpacity>
          <Text style={styles.heading}>Choose your level</Text>
          <Text style={styles.subheading}>How brave are you feeling tonight?</Text>
          {LEVELS.map((lvl) => (
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
                <Text style={[styles.levelSub, { color: lvl.darkTheme ? "#f5d8e888" : "#9c6070" }]}>{lvl.subtitle}</Text>
              </View>
              {lvl.id === PAID_LEVEL_ID && !purchase.unlocked ? (
                <Text style={{ fontSize: 18 }}>🔒</Text>
              ) : (
                <Text style={{ color: lvl.accent, fontSize: 20 }}>›</Text>
              )}
            </TouchableOpacity>
          ))}
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
            {paidLevel.cards.length} more cards.{"\n"}A one-time purchase, yours to keep.
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
        <ScrollView
          style={{ flex: 1, width: "100%", backgroundColor: isDark ? "#0d0006" : "#fdf6f8" }}
          contentContainerStyle={styles.cardScreen}
        >
          <View style={styles.cardHeader}>
            <TouchableOpacity onPress={() => setScreen("levels")}>
              <Text style={[styles.back, { color: isDark ? "#e0305a" : level.accent, marginBottom: 0 }]}>Levels</Text>
            </TouchableOpacity>
            <Text style={{ color: isDark ? "#ffffff44" : "#9c6070", fontSize: 13 }}>
              {cardIndex + 1} / {level.cards.length}
            </Text>
          </View>
          <View style={styles.progressBg}>
            <View style={[styles.progressFill, {
              width: `${((cardIndex + 1) / level.cards.length) * 100}%`,
              backgroundColor: isDark ? "#e0305a" : level.accent
            }]} />
          </View>
          <View style={[styles.card, { backgroundColor: isDark ? "#1a0510" : "#fff", shadowColor: level.accent }]}>
            <View style={[styles.badge, { borderColor: level.accent + "44", backgroundColor: level.accent + "18" }]}>
              <Text style={[styles.badgeText, { color: isDark ? "#e0305a" : level.accent }]}>
                {card.type === "challenge" ? "DARE" : "QUESTION"}
              </Text>
            </View>
            <Text style={[styles.cardText, { color: isDark ? "#f5d8e8" : "#2d0a1a", fontStyle: card.type === "challenge" ? "italic" : "normal" }]}>
              {card.text}
            </Text>
          </View>
          <Text style={[styles.levelLabel, { color: isDark ? "#ffffff22" : "#9c607066" }]}>
            Level {level.id} — {level.name}
          </Text>
          <TouchableOpacity style={styles.btnPrimary} onPress={nextCard}>
            <Text style={styles.btnPrimaryText}>
              {cardIndex + 1 < level.cards.length ? "Next Card" : "Finish Level"}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      )}

      {screen === "complete" && level && (
        <View style={styles.center}>
          <Text style={{ fontSize: 60, marginBottom: 16 }}>🌹</Text>
          <Text style={[styles.heading, isDark && { color: "#f5d8e8" }]}>Level Complete</Text>
          <Text style={[styles.subheading, { textAlign: "center", marginBottom: 40 }]}>
            You finished {level.name}.{"\n"}The night is just getting started...
          </Text>
          {level.id < 5 && (
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
        </View>
      )}

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center" },
  center: { flex: 1, alignItems: "center", justifyContent: "center", padding: 24, width: "100%" },
  rose: { fontSize: 80, marginBottom: 8 },
  title: { fontSize: 52, fontWeight: "700", color: "#f5d8e8", textAlign: "center", lineHeight: 56 },
  titleItalic: { fontStyle: "italic", fontWeight: "400", color: "#e8a0b8" },
  subtitle: { color: "#f5d8e888", fontSize: 13, letterSpacing: 3, marginTop: 12, marginBottom: 48 },
  hint: { color: "#f5d8e833", fontSize: 12, marginTop: 24, letterSpacing: 1 },
  back: { color: "#c9748a", fontSize: 14, letterSpacing: 1, marginBottom: 24 },
  heading: { fontSize: 30, fontWeight: "700", color: "#2d0a1a", marginBottom: 6 },
  subheading: { color: "#9c6070", fontSize: 14, marginBottom: 28 },
  levelCard: { borderRadius: 20, padding: 20, marginBottom: 14, flexDirection: "row", alignItems: "center", gap: 14, shadowColor: "#9c3060", shadowOpacity: 0.08, shadowRadius: 12, shadowOffset: { width: 0, height: 4 }, elevation: 3 },
  levelIcon: { width: 44, height: 44, borderRadius: 22, alignItems: "center", justifyContent: "center" },
  levelName: { fontSize: 18, fontWeight: "700", marginBottom: 2 },
  levelSub: { fontSize: 13 },
  cardScreen: { flexGrow: 1, padding: 24, paddingTop: 60 },
  cardHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 28 },
  progressBg: { height: 2, backgroundColor: "#e0d0d844", borderRadius: 2, marginBottom: 36 },
  progressFill: { height: 2, borderRadius: 2 },
  card: { borderRadius: 28, padding: 40, marginBottom: 28, shadowOpacity: 0.15, shadowRadius: 20, shadowOffset: { width: 0, height: 10 }, elevation: 6, alignItems: "center" },
  badge: { borderWidth: 1, borderRadius: 20, paddingHorizontal: 14, paddingVertical: 6, marginBottom: 24 },
  badgeText: { fontSize: 11, letterSpacing: 2 },
  cardText: { fontSize: 22, lineHeight: 34, textAlign: "center", fontWeight: "400" },
  levelLabel: { fontSize: 12, letterSpacing: 2, textAlign: "center", marginBottom: 24, textTransform: "uppercase" },
  nextCard: { backgroundColor: "#fff", borderRadius: 20, padding: 24, width: "100%", alignItems: "center", shadowColor: "#9c3060", shadowOpacity: 0.1, shadowRadius: 16, shadowOffset: { width: 0, height: 6 }, elevation: 4 },
  btnPrimary: { backgroundColor: "#9c3060", borderRadius: 50, paddingVertical: 16, paddingHorizontal: 36, width: "100%", alignItems: "center", shadowColor: "#9c3060", shadowOpacity: 0.4, shadowRadius: 12, shadowOffset: { width: 0, height: 4 }, elevation: 4 },
  btnPrimaryText: { color: "#fff", fontSize: 16, letterSpacing: 1.5, textTransform: "uppercase", fontWeight: "600" },
  btnSecondary: { borderWidth: 1.5, borderColor: "#c9748a", borderRadius: 50, paddingVertical: 14, paddingHorizontal: 36, width: "100%", alignItems: "center" },
  btnSecondaryText: { color: "#9c3060", fontSize: 15, letterSpacing: 1 },
  privacyLink: { alignSelf: "center", paddingVertical: 12, marginTop: 4 },
  privacyLinkText: { color: "#9c6070", fontSize: 13, textDecorationLine: "underline" },
  paywallBack: { position: "absolute", top: 60, left: 24 },
  restore: { paddingVertical: 16, marginTop: 8 },
  restoreText: { color: "#e8a0b8", fontSize: 14, letterSpacing: 1 },
  paywallNote: { color: "#f5d8e888", fontSize: 13, textAlign: "center", marginTop: 8 },
});
