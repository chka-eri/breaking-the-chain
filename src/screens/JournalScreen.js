import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useGame } from "../state/GameContext";
import { PROVERBS, PROVERB_ORDER } from "../data/proverbs";
import { C } from "../theme";
import { Screen, Card, TextLink, Sheet } from "../components/UI";

export default function JournalScreen() {
  const { state, dispatch } = useGame();

  return (
    <Screen scroll style={{ padding: 16 }}>
      <Sheet>
      <Text style={s.kicker}>AKPA AMAMIHE</Text>
      <Text style={s.h1}>Wisdom</Text>
      <Text style={s.sub}>
        Proverbs gathered on your road: {state.proverbs.length} of {PROVERB_ORDER.length}. Elders
        say a proverb is the palm oil with which words are eaten.
      </Text>

      {PROVERB_ORDER.map((pid) => {
        const got = state.proverbs.includes(pid);
        const p = PROVERBS[pid];
        if (!got) {
          return (
            <Card key={pid} style={s.locked}>
              <Text style={s.lockedText}>🔒  ???</Text>
              <Text style={s.lockedSub}>Keep walking the road — wisdom waits ahead.</Text>
            </Card>
          );
        }
        return (
          <Card key={pid} style={s.item}>
            <Text style={s.igbo}>"{p.igbo}"</Text>
            <Text style={s.eng}>{p.english}</Text>
            <Text style={s.meaning}>{p.meaning}</Text>
            <Text style={s.from}>— {p.from}</Text>
          </Card>
        );
      })}

      <View style={{ marginTop: 16, marginBottom: 12, alignItems: "center" }}>
        <TextLink label="Back" onPress={() => dispatch({ type: "BACK" })} />
      </View>
      </Sheet>
    </Screen>
  );
}

const s = StyleSheet.create({
  kicker: { color: C.inkDim, fontSize: 11, fontWeight: "800", letterSpacing: 2, marginBottom: 6 },
  h1: { color: C.ink, fontSize: 32, fontWeight: "900", marginBottom: 8 },
  sub: { color: C.inkDim, fontSize: 15, lineHeight: 22, marginBottom: 16 },
  item: { marginBottom: 12, borderColor: C.goldDeep },
  igbo: { color: C.ink, fontSize: 18, fontWeight: "800", fontStyle: "italic", lineHeight: 26, marginBottom: 6 },
  eng: { color: C.gold, fontSize: 15, fontWeight: "700", marginBottom: 6, lineHeight: 22 },
  meaning: { color: C.inkDim, fontSize: 14, lineHeight: 21, marginBottom: 8 },
  from: { color: C.inkDim, fontSize: 11.5, fontStyle: "italic" },
  locked: { marginBottom: 12, opacity: 0.6 },
  lockedText: { color: C.inkDim, fontWeight: "800", fontSize: 15, marginBottom: 4 },
  lockedSub: { color: C.inkDim, fontSize: 12 },
});
