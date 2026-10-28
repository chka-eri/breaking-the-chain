import React from "react";
import { View, Text, Pressable, StyleSheet, ImageBackground, Image } from "react-native";
import { useGame, villagePulse } from "../state/GameContext";
import { LEVELS } from "../data/story";
import { DREAMS } from "../data/dreams";
import { SCENE_ART, portraitFor } from "../data/art";
import { C } from "../theme";
import { Screen, GhostBtn, ConfirmBtn, PatternBand } from "../components/UI";
import StatsHud from "../components/StatsHud";

const NIGHT_ART = ["festival", "compound", "craft", "market", "square"];

export default function NightMapScreen() {
  const { state, dispatch } = useGame();
  const dream = DREAMS[state.player.dream] || DREAMS.footballer;
  const pulse = villagePulse(state.stats);
  const you = portraitFor("You", state.player);
  const allDone = state.completed.length >= 5;

  return (
    <Screen scroll style={{ padding: 16 }}>
      <View style={s.head}>
        {you ? <Image source={you} style={s.you} /> : null}
        <View style={{ flex: 1 }}>
          <Text style={s.kicker}>FIVE NIGHTS OF UMUOMA</Text>
          <Text style={s.h1}>
            {state.player.name} {dream.emoji}
          </Text>
        </View>
        <Text style={s.pro}>📜 {state.proverbs.length}/7</Text>
      </View>

      <Text style={s.pulseL}>Village pulse · how alive is the square</Text>
      <View style={s.pulseBg}>
        <View
          style={[
            s.pulseFill,
            { width: `${pulse}%`, backgroundColor: pulse > 55 ? C.gold : C.red },
          ]}
        />
      </View>
      <Text style={s.pulseN}>
        {pulse >= 70 ? "Children still play at dusk." : pulse >= 40 ? "The square is quieter." : "Base is louder than the drums."}
      </Text>

      <View style={{ height: 8 }} />
      <StatsHud stats={state.stats} compact />
      <PatternBand height={8} />
      <View style={{ height: 10 }} />

      {LEVELS.map((lv, i) => {
        const done = state.completed.includes(lv.n);
        const current = !done && lv.n === state.unlocked;
        const locked = lv.n > state.unlocked;
        const art = SCENE_ART[NIGHT_ART[i]];
        return (
          <Pressable
            key={lv.n}
            disabled={locked}
            onPress={() => current && dispatch({ type: "START_LEVEL", level: lv.n, start: lv.start })}
          >
            <ImageBackground source={art} style={[s.night, locked && { opacity: 0.4 }]} imageStyle={{ borderRadius: 18 }}>
              <View style={s.nightShade}>
                <Text style={s.nightK}>
                  NIGHT {lv.n} {done ? "· SURVIVED" : current ? "· TONIGHT" : "· LOCKED"}
                </Text>
                <Text style={s.nightT}>{lv.igbo}</Text>
                <Text style={s.nightS}>{lv.title}</Text>
                <Text style={s.nightB}>{lv.blurb}</Text>
                {current ? <Text style={s.play}>Pack your chi ▸</Text> : null}
              </View>
            </ImageBackground>
          </Pressable>
        );
      })}

      {allDone ? (
        <Pressable style={s.end} onPress={() => dispatch({ type: "NAV", screen: "ending" })}>
          <Text style={s.endT}>The square is waiting for your name ▸</Text>
        </Pressable>
      ) : null}

      <View style={s.footer}>
        <GhostBtn small label="📜 Journal" onPress={() => dispatch({ type: "NAV", screen: "journal", remember: true })} />
        <GhostBtn small label="ℹ️ Help" onPress={() => dispatch({ type: "NAV", screen: "about", remember: true })} />
        <ConfirmBtn label="↺ New Game" confirmLabel="Tap again — sure?" onConfirm={() => dispatch({ type: "NEW_GAME" })} />
      </View>
    </Screen>
  );
}

const s = StyleSheet.create({
  head: { flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 12 },
  you: { width: 52, height: 52, borderRadius: 26, borderWidth: 2, borderColor: C.gold },
  kicker: { color: C.inkDim, fontWeight: "800", fontSize: 11, letterSpacing: 1.2 },
  h1: { color: C.gold, fontWeight: "900", fontSize: 22 },
  pro: { color: C.gold, fontWeight: "800" },
  pulseL: { color: C.inkDim, fontSize: 11, fontWeight: "700", marginBottom: 6 },
  pulseBg: { height: 10, borderRadius: 5, backgroundColor: "rgba(255,255,255,0.08)", overflow: "hidden" },
  pulseFill: { height: 10, borderRadius: 5 },
  pulseN: { color: C.ink, fontSize: 12, marginTop: 6, marginBottom: 8, fontWeight: "600" },
  night: { height: 132, marginBottom: 12, borderRadius: 18, overflow: "hidden" },
  nightShade: {
    flex: 1,
    backgroundColor: "rgba(8,16,10,0.55)",
    padding: 14,
    justifyContent: "flex-end",
  },
  nightK: { color: C.gold, fontWeight: "800", fontSize: 10, letterSpacing: 1.4 },
  nightT: { color: C.ink, fontWeight: "900", fontSize: 20 },
  nightS: { color: C.gold, fontWeight: "700", fontSize: 13 },
  nightB: { color: C.inkDim, fontSize: 12, marginTop: 2 },
  play: { color: C.gold, fontWeight: "900", marginTop: 6 },
  end: { backgroundColor: C.gold, borderRadius: 14, padding: 14, alignItems: "center", marginTop: 4 },
  endT: { color: "#26200A", fontWeight: "900" },
  footer: { flexDirection: "row", flexWrap: "wrap", justifyContent: "center", gap: 8, marginTop: 16, marginBottom: 12 },
});
