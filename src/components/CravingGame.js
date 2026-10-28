import React, { useEffect, useRef, useState } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { C } from "../theme";
import { Card, PrimaryBtn } from "./UI";

// ================================================================
// THE CRAVING BATTLE
// Tap to hold the craving below the flood line until the wave passes.
// framing "self"   -> you fight your own craving (Chapter 5A)
// framing "friend" -> you steady Nnamdi through a midnight call (5B)
// ================================================================

const ROUND_SECONDS = 8;

const COPING = {
  self: [
    { icon: "🫁", text: "Iku ume — slow breathing. In... hold... out." },
    { icon: "📞", text: "Call Ngozi. Her voice is solid ground." },
    { icon: "📜", text: "Recite a proverb from your Akpa Amamihe." },
    { icon: "🚶", text: "Walk to the mango tree. Drink water slowly." },
  ],
  friend: [
    { icon: "🫁", text: "Guide him: 'Breathe with me. In... hold... out.'" },
    { icon: "🎵", text: "Sing the old choir song with him, badly, together." },
    { icon: "📜", text: "Remind him: ọdịda abụghị njedebe ụzọ." },
    { icon: "🗣️", text: "Keep him talking about tomorrow's plans." },
  ],
};

export default function CravingGame({ config, onDone }) {
  const framing = (config && config.framing) || "self";
  const totalRounds = (config && config.rounds) || 3;

  const [phase, setPhase] = useState("intro"); // intro | play | coping | summary
  const [round, setRound] = useState(1);
  const [craving, setCraving] = useState(30);
  const [timeLeft, setTimeLeft] = useState(ROUND_SECONDS);
  const [results, setResults] = useState([]);
  const [buff, setBuff] = useState(0);
  const [flash, setFlash] = useState(false);
  const endedRef = useRef(false);

  const rate = Math.max(4, 10 + round * 2 - buff); // craving rise per second

  // Game tick
  useEffect(() => {
    if (phase !== "play") return;
    endedRef.current = false;
    const iv = setInterval(() => {
      setCraving((c) => Math.min(100, c + rate / 10));
      setTimeLeft((t) => Math.max(0, +(t - 0.1).toFixed(2)));
    }, 100);
    return () => clearInterval(iv);
  }, [phase, rate]);

  // Round end detection
  useEffect(() => {
    if (phase !== "play" || endedRef.current) return;
    if (craving >= 100) {
      endedRef.current = true;
      endRound(false);
    } else if (timeLeft <= 0) {
      endedRef.current = true;
      endRound(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [craving, timeLeft, phase]);

  function startRound(n) {
    setRound(n);
    setCraving(30);
    setTimeLeft(ROUND_SECONDS);
    setPhase("play");
  }

  function endRound(won) {
    const next = [...results, won];
    setResults(next);
    if (next.length >= totalRounds) setPhase("summary");
    else setPhase("coping");
  }

  function resist() {
    setCraving((c) => Math.max(0, c - 9));
    setFlash(true);
    setTimeout(() => setFlash(false), 90);
  }

  function finish() {
    const wins = results.filter(Boolean).length;
    const losses = results.length - wins;
    const effects = {
      chain: -(4 * wins) + 6 * losses,
      hope: 2 * wins,
      health: wins >= 2 ? 3 : 0,
    };
    onDone(effects);
  }

  const wins = results.filter(Boolean).length;

  // ---------------- INTRO ----------------
  if (phase === "intro") {
    return (
      <Card>
        <Text style={s.h}>
          {framing === "self" ? "⚔️ THE CRAVING BATTLE" : "📞 HOLD THE LINE FOR NNAMDI"}
        </Text>
        <Text style={s.p}>
          {framing === "self"
            ? "The craving rises like harmattan fire. It will come in waves — " +
              totalRounds +
              " of them. Tap KWỤSỊ! fast to hold it below the flood line until each wave passes. Cravings are terrible liars: they scream, then they PASS."
            : "Nnamdi's craving speaks through the phone. Every tap is a steady word: 'I dey here. Breathe. E go pass.' Hold his craving below the flood line until each wave passes — " +
              totalRounds +
              " waves tonight."}
        </Text>
        <PrimaryBtn label="Face the first wave" onPress={() => startRound(1)} />
      </Card>
    );
  }

  // ---------------- PLAY ----------------
  if (phase === "play") {
    const danger = craving > 70;
    return (
      <Card style={danger ? { borderColor: C.red } : null}>
        <Text style={s.wave}>
          Wave {round} of {totalRounds} • {Math.ceil(timeLeft)}s
        </Text>
        <Text style={[s.meterLabel, danger && { color: C.red }]}>
          {framing === "self" ? "AGỤỤ — The Craving" : "His craving"} {Math.round(craving)}%
        </Text>
        <View style={s.meterBg}>
          <View
            style={[
              s.meterFill,
              {
                width: `${craving}%`,
                backgroundColor: danger ? C.redDeep : C.red,
              },
            ]}
          />
        </View>
        <Pressable onPress={resist} style={({ pressed }) => [s.tapBtn, (pressed || flash) && s.tapBtnActive]}>
          <Text style={s.tapText}>KWỤSỊ!</Text>
          <Text style={s.tapSub}>{framing === "self" ? "RESIST — tap fast!" : "'I dey here. Breathe.' — tap fast!"}</Text>
        </Pressable>
      </Card>
    );
  }

  // ---------------- COPING ----------------
  if (phase === "coping") {
    const lastWon = results[results.length - 1];
    return (
      <Card>
        <Text style={s.h}>{lastWon ? "🌊 The wave passed." : "🌊 The wave broke through..."}</Text>
        <Text style={s.p}>
          {lastWon
            ? "See? It screamed, and then it passed. They always pass."
            : framing === "self"
            ? "It won this round — but you are still standing, and the next wave meets a wiser you."
            : "His voice dips... then steadies. 'I still dey here,' he whispers. The next wave meets both of you wiser."}
          {" "}Choose a tool before the next wave — every tool slows the fire.
        </Text>
        {COPING[framing].map((cItem, i) => (
          <Pressable
            key={i}
            onPress={() => {
              setBuff((b) => b + 4);
              startRound(round + 1);
            }}
            style={({ pressed }) => [s.copeBtn, pressed && { opacity: 0.7 }]}
          >
            <Text style={s.copeText}>
              {cItem.icon} {cItem.text}
            </Text>
          </Pressable>
        ))}
      </Card>
    );
  }

  // ---------------- SUMMARY ----------------
  return (
    <Card>
      <Text style={s.h}>
        {wins === totalRounds
          ? "🏆 EVERY WAVE HELD!"
          : wins > 0
          ? "💪 You held " + wins + " of " + totalRounds + " waves"
          : "🌧️ The waves won tonight..."}
      </Text>
      <Text style={s.p}>
        {framing === "self"
          ? wins === totalRounds
            ? "Counselor Zeribe watches you unclench your fists. 'Remember this feeling, " +
              "warrior. The craving is loud, but it is NOT in charge. You are.'"
            : wins > 0
            ? "'Some waves win,' Zeribe says quietly. 'The fight is not to be perfect. The fight is to keep fighting. And you are still here.'"
            : "'You lost the rounds and STAYED,' Zeribe says. 'Staying is the victory nobody claps for. Tomorrow we train the grip.'"
          : wins === totalRounds
          ? "The line goes quiet, then: 'E don pass, Nedu. E don pass.' His breathing slows. Tonight, two people held one rope — and the rope held."
          : "Near dawn his voice finally settles. 'Thank you, Nna. If you no pick call this night, hmm.' You both sit in the silence that follows — alive, on the same rope."}
      </Text>
      <PrimaryBtn label="Continue the story ▸" onPress={finish} />
    </Card>
  );
}

const s = StyleSheet.create({
  h: { color: C.gold, fontSize: 17, fontWeight: "900", marginBottom: 8, letterSpacing: 0.4 },
  p: { color: C.ink, fontSize: 14.5, lineHeight: 22, marginBottom: 14 },
  wave: { color: C.inkDim, fontWeight: "800", fontSize: 12, letterSpacing: 1, marginBottom: 8 },
  meterLabel: { color: C.inkDim, fontSize: 12, fontWeight: "800", marginBottom: 5 },
  meterBg: {
    height: 16,
    borderRadius: 8,
    backgroundColor: "rgba(255,255,255,0.12)",
    overflow: "hidden",
    marginBottom: 16,
  },
  meterFill: { height: 16, borderRadius: 8 },
  tapBtn: {
    backgroundColor: C.greenDeep,
    borderRadius: 18,
    paddingVertical: 26,
    alignItems: "center",
    borderWidth: 2,
    borderColor: C.green,
  },
  tapBtnActive: { backgroundColor: C.green, transform: [{ scale: 0.97 }] },
  tapText: { color: "#FFFFFF", fontSize: 26, fontWeight: "900", letterSpacing: 2 },
  tapSub: { color: "rgba(255,255,255,0.8)", fontSize: 12, marginTop: 4, fontWeight: "600" },
  copeBtn: {
    backgroundColor: C.cardAlt,
    borderRadius: 12,
    padding: 13,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: C.line,
  },
  copeText: { color: C.ink, fontSize: 13.5, lineHeight: 19 },
});
