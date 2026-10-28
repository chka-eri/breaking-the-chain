import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { useGame } from "../state/GameContext";
import { LEVELS } from "../data/story";
import { DREAMS } from "../data/dreams";
import { C } from "../theme";
import StatsHud from "../components/StatsHud";
import { Screen, Card, GhostBtn, ConfirmBtn, PatternBand } from "../components/UI";

export default function MapScreen() {
  const { state, dispatch } = useGame();
  const dream = DREAMS[state.player.dream] || DREAMS.footballer;
  const allDone = state.completed.length >= 5;

  return (
    <Screen scroll style={{ padding: 16 }}>
      <View style={s.headRow}>
        <View>
          <Text style={s.kicker}>THE JOURNEY • IJE</Text>
          <Text style={s.h1}>
            {state.player.name} {dream.emoji}
          </Text>
        </View>
        <Text style={s.proverbCount}>📜 {state.proverbs.length}/7</Text>
      </View>

      <StatsHud stats={state.stats} />
      <View style={{ height: 14 }} />
      <PatternBand height={10} />
      <View style={{ height: 14 }} />

      {LEVELS.map((lv, idx) => {
        const done = state.completed.includes(lv.n);
        const current = !done && lv.n === state.unlocked;
        const locked = lv.n > state.unlocked;
        return (
          <View key={lv.n} style={s.stopRow}>
            {/* Rail */}
            <View style={s.rail}>
              <View
                style={[
                  s.node,
                  done && { backgroundColor: C.greenDeep, borderColor: C.green },
                  current && { backgroundColor: "rgba(245,179,1,0.15)", borderColor: C.gold },
                ]}
              >
                <Text style={s.nodeEmoji}>{locked ? "🔒" : lv.emoji}</Text>
              </View>
              {idx < LEVELS.length - 1 ? (
                <View style={[s.connector, done && { backgroundColor: C.green }]} />
              ) : null}
            </View>

            {/* Card */}
            <Pressable
              disabled={locked || done}
              onPress={() => dispatch({ type: "START_LEVEL", level: lv.n, start: lv.start })}
              style={{ flex: 1 }}
            >
              <Card
                style={[
                  { marginBottom: 18 },
                  current && { borderColor: C.gold },
                  locked && { opacity: 0.55 },
                ]}
              >
                <Text style={s.stopKicker}>
                  CHAPTER {lv.n} {done ? "• COMPLETED ✓" : current ? "• NOW PLAYING" : ""}
                </Text>
                <Text style={s.stopTitle}>{lv.igbo}</Text>
                <Text style={s.stopSub}>{lv.title}</Text>
                <Text style={s.stopBlurb}>{lv.blurb}</Text>
                {current ? <Text style={s.playHint}>▶ Tap to play</Text> : null}
              </Card>
            </Pressable>
          </View>
        );
      })}

      {allDone ? (
        <Card style={{ borderColor: C.gold, marginBottom: 14 }}>
          <Text style={s.doneTitle}>🦅 Journey complete!</Text>
          <Text style={s.doneText}>
            Different choices open different roads — there is a second storyline waiting. Begin a
            new journey and walk it another way.
          </Text>
        </Card>
      ) : null}

      <View style={s.footerRow}>
        <GhostBtn
          small
          label="📜 Akpa Amamihe"
          onPress={() => dispatch({ type: "NAV", screen: "journal", remember: true })}
        />
        <GhostBtn
          small
          label="ℹ️ About & Help"
          onPress={() => dispatch({ type: "NAV", screen: "about", remember: true })}
        />
        <ConfirmBtn
          label="↺ New Game"
          confirmLabel="Tap again — sure?"
          onConfirm={() => dispatch({ type: "NEW_GAME" })}
        />
      </View>
    </Screen>
  );
}

const s = StyleSheet.create({
  headRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginBottom: 12,
  },
  kicker: { color: C.inkDim, fontSize: 11, fontWeight: "800", letterSpacing: 2 },
  h1: { color: C.gold, fontSize: 24, fontWeight: "900" },
  proverbCount: { color: C.gold, fontWeight: "800", fontSize: 14 },
  stopRow: { flexDirection: "row" },
  rail: { width: 56, alignItems: "center" },
  node: {
    width: 46,
    height: 46,
    borderRadius: 23,
    borderWidth: 2,
    borderColor: C.line,
    backgroundColor: C.card,
    alignItems: "center",
    justifyContent: "center",
  },
  nodeEmoji: { fontSize: 20 },
  connector: { flex: 1, width: 3, backgroundColor: C.line, marginVertical: 4, borderRadius: 2 },
  stopKicker: { color: C.inkDim, fontSize: 10, fontWeight: "800", letterSpacing: 1.5, marginBottom: 3 },
  stopTitle: { color: C.ink, fontSize: 17, fontWeight: "900" },
  stopSub: { color: C.gold, fontSize: 12.5, fontWeight: "700", marginBottom: 5 },
  stopBlurb: { color: C.inkDim, fontSize: 12.5, lineHeight: 18 },
  playHint: { color: C.gold, fontWeight: "800", fontSize: 12, marginTop: 8 },
  doneTitle: { color: C.gold, fontWeight: "900", fontSize: 17, marginBottom: 6 },
  doneText: { color: C.ink, fontSize: 13.5, lineHeight: 20 },
  footerRow: {
    flexDirection: "row",
    justifyContent: "center",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 6,
  },
});
