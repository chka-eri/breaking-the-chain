import React, { useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useGame } from "../state/GameContext";
import { DREAMS, DREAM_ORDER } from "../data/dreams";
import { C } from "../theme";
import { Screen, Card, PrimaryBtn, Portrait, Sheet } from "../components/UI";
import { portraitFor } from "../data/art";

const NAME_PRESETS = ["Chinedu", "Adaeze", "Ikenna", "Chiamaka"];

export default function SetupScreen() {
  const { dispatch } = useGame();
  const insets = useSafeAreaInsets();
  const [name, setName] = useState("Chinedu");
  const [dream, setDream] = useState("footballer");

  const clean = name.trim().slice(0, 14);
  const face = portraitFor("You", { name: clean || "Chinedu" });

  return (
    <Screen scroll style={{ paddingHorizontal: 20, paddingTop: Math.max(insets.top, 12) }}>
      <Sheet>
        <Text style={s.kicker}>UMUOMA · IMO STATE</Text>
        <Text style={s.h1}>Who is walking?</Text>

        <View style={s.who}>
          <Portrait source={face} name={clean || "Your name"} role="This is you" size={180} />
        </View>

        <Text style={s.label}>Name</Text>
        <View style={s.chipsRow}>
          {NAME_PRESETS.map((n) => (
            <Pressable key={n} onPress={() => setName(n)} style={[s.chip, name === n && s.chipOn]}>
              <Text style={[s.chipText, name === n && s.chipTextOn]}>{n}</Text>
            </Pressable>
          ))}
        </View>
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="Or type a name"
          placeholderTextColor={C.inkDim}
          maxLength={14}
          style={s.input}
        />

        <Text style={s.label}>Dream</Text>
        {DREAM_ORDER.map((key) => {
          const d = DREAMS[key];
          const on = dream === key;
          return (
            <Pressable key={key} onPress={() => setDream(key)}>
              <Card style={[s.dreamCard, on && { borderColor: C.gold, backgroundColor: C.cardAlt }]}>
                <Text style={s.dreamTitle}>
                  {d.emoji}  {d.label}
                </Text>
                <Text style={s.dreamDesc}>{d.desc}</Text>
              </Card>
            </Pressable>
          );
        })}

        <View style={{ height: 8 }} />
        <PrimaryBtn
          label="Enter Umuoma"
          disabled={clean.length < 2}
          onPress={() =>
            dispatch({ type: "SETUP", player: { name: clean || "Chinedu", dream } })
          }
        />
        <Text style={s.note}>
          Each run lasts a minute and a half. It starts as a walk, then quickens, then becomes fastest.
          Drag to move. A prayer lets the road breathe. What your hands refuse is the lesson.
        </Text>
      </Sheet>
    </Screen>
  );
}

const s = StyleSheet.create({
  kicker: { color: C.inkDim, fontSize: 12, fontWeight: "800", letterSpacing: 1.6, marginBottom: 6 },
  h1: { color: C.ink, fontSize: 32, fontWeight: "900", marginBottom: 8 },
  who: { alignItems: "center", marginVertical: 12 },
  label: {
    color: C.ink,
    fontWeight: "800",
    fontSize: 14,
    marginTop: 16,
    marginBottom: 8,
  },
  chipsRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  chip: {
    borderWidth: 1.5,
    borderColor: C.line,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  chipOn: { borderColor: C.gold, backgroundColor: "rgba(245,179,1,0.12)" },
  chipText: { color: C.inkDim, fontWeight: "700", fontSize: 14 },
  chipTextOn: { color: C.gold },
  input: {
    backgroundColor: C.card,
    borderWidth: 1,
    borderColor: C.line,
    borderRadius: 14,
    color: C.ink,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginTop: 10,
    fontSize: 16,
  },
  dreamCard: { marginBottom: 10 },
  dreamTitle: { color: C.ink, fontWeight: "900", fontSize: 16, marginBottom: 4 },
  dreamDesc: { color: C.inkDim, fontSize: 14, lineHeight: 20 },
  note: { color: C.inkDim, fontSize: 13, lineHeight: 20, marginTop: 14, marginBottom: 24, textAlign: "center" },
});
