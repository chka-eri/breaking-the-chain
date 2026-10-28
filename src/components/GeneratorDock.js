import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { generatorsFor } from "../data/items";
import { empties } from "../merge/engine";
import { C } from "../theme";

export default function GeneratorDock({ unlocked, ike, board, onGen }) {
  const gens = generatorsFor(unlocked);
  const full = empties(board).length === 0;
  return (
    <View style={s.wrap}>
      {full ? <Text style={s.warn}>Table is full — give a gift or merge</Text> : null}
      <View style={s.row}>
        {gens.map((g) => (
          <Pressable
            key={g.id}
            onPress={() => onGen(g.id)}
            disabled={ike < 1 || full}
            style={({ pressed }) => [
              s.bowl,
              (ike < 1 || full) && { opacity: 0.35 },
              pressed && { transform: [{ scale: 0.96 }] },
            ]}
          >
            <Text style={s.emoji}>{g.emoji}</Text>
            <Text style={s.name} numberOfLines={1}>
              {g.name}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  wrap: { paddingHorizontal: 8, marginTop: 6 },
  warn: { color: C.red, fontWeight: "700", fontSize: 11, textAlign: "center", marginBottom: 4 },
  row: { flexDirection: "row", justifyContent: "center", flexWrap: "wrap", gap: 8 },
  bowl: {
    width: 72,
    height: 64,
    borderRadius: 32,
    backgroundColor: "rgba(255,255,255,0.06)",
    alignItems: "center",
    justifyContent: "center",
  },
  emoji: { fontSize: 20 },
  name: { color: C.inkDim, fontSize: 9, fontWeight: "800", marginTop: 2, textAlign: "center" },
});
