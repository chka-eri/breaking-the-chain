import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useGame } from "../state/GameContext";
import { HELPLINE, FACTS, CREDITS } from "../data/facts";
import { C } from "../theme";
import { Screen, Card, TextLink, Sheet } from "../components/UI";

export default function AboutScreen() {
  const { dispatch } = useGame();

  return (
    <Screen scroll style={{ padding: 16 }}>
      <Sheet>
      <Text style={s.kicker}>EZIOKWU</Text>
      <Text style={s.h1}>Facts and help</Text>

      {/* GET HELP */}
      <Card style={[s.section, { borderColor: C.green }]}>
        <Text style={s.sectionTitle}>🤝 {HELPLINE.headline}</Text>
        <Text style={s.bigNumber}>{HELPLINE.number}</Text>
        {HELPLINE.lines.map((l, i) => (
          <Text key={i} style={s.body}>
            • {l}
          </Text>
        ))}
      </Card>

      {/* FACTS */}
      <Text style={s.groupLabel}>THE FACTS</Text>
      {FACTS.map((f, i) => (
        <Card key={i} style={s.section}>
          <Text style={s.factTitle}>{f.t}</Text>
          <Text style={s.body}>{f.d}</Text>
        </Card>
      ))}

      {/* ABOUT THE GAME */}
      <Text style={s.groupLabel}>ABOUT THIS GAME</Text>
      <Card style={s.section}>
        <Text style={s.factTitle}>Breaking the Chain — Ịgbaji Agbụ</Text>
        <Text style={s.body}>
          This game is built on what prevention science actually supports — not lectures,
          not merge puzzles, not "just say no" without a skill.
        </Text>
        <Text style={s.body}>
          LifeSkills Training (Botvin): practice refusal, goals, family, asking for help.{"\n"}
          Pure Rush (Matilda Centre): if you take the drug, the next session of play is impaired
          — you feel it in your hands.{"\n"}
          play2PREVENT (Yale): small choices change a life trajectory you can still repair.{"\n"}
          CDC ENGAGE: skills, family, extracurricular dreams, and a door to treatment.
        </Text>
        <Text style={s.body}>
          You drag across the Umuoma road: dodge the drugs, catch herbs and prayers. Speed rises.
          A hit from last night fogs your hands. Five Igbo nights. Recovery is treatment, not
          shame. NDLEA 0800-1020-3040.
        </Text>
      </Card>

      {/* CREDITS */}
      <Text style={s.groupLabel}>CONTEST & CREDITS</Text>
      <Card style={s.section}>
        {CREDITS.map((c, i) => (
          <Text key={i} style={[s.body, i === 0 && { color: C.gold, fontWeight: "800" }]}>
            {c}
          </Text>
        ))}
      </Card>

      <View style={{ alignItems: "center", marginTop: 16, marginBottom: 12 }}>
        <TextLink label="Back" onPress={() => dispatch({ type: "BACK" })} />
      </View>
      </Sheet>
    </Screen>
  );
}

const s = StyleSheet.create({
  kicker: { color: C.inkDim, fontSize: 11, fontWeight: "800", letterSpacing: 2, marginBottom: 6 },
  h1: { color: C.ink, fontSize: 32, fontWeight: "900", marginBottom: 12 },
  section: { marginTop: 12 },
  sectionTitle: { color: C.ink, fontWeight: "900", fontSize: 16, marginBottom: 8 },
  bigNumber: {
    color: C.green,
    fontSize: 28,
    fontWeight: "900",
    letterSpacing: 1,
    marginBottom: 10,
  },
  groupLabel: {
    color: C.inkDim,
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 2,
    marginTop: 22,
  },
  factTitle: { color: C.gold, fontWeight: "800", fontSize: 14.5, marginBottom: 6 },
  body: { color: C.ink, fontSize: 15, lineHeight: 22, marginBottom: 8 },
});
