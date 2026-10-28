import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { C, STAT_META, STAT_ORDER } from "../theme";

export default function StatsHud({ stats, compact }) {
  return (
    <View style={[s.row, compact && s.rowCompact]}>
      {STAT_ORDER.map((key) => {
        const meta = STAT_META[key];
        const v = stats[key] ?? 0;
        const label = key === "chain" ? "Chain" : meta.label;
        return (
          <View key={key} style={s.cell}>
            <Text style={s.lab} numberOfLines={1}>{label}</Text>
            <View style={s.barBg}>
              <View
                style={[
                  s.barFill,
                  { width: `${v}%`, backgroundColor: meta.color },
                ]}
              />
            </View>
            <Text style={[s.val, meta.inverted && v >= 50 && { color: C.red }]}>
              {v}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

const s = StyleSheet.create({
  row: {
    flexDirection: "row",
    gap: 8,
    backgroundColor: C.card,
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: C.line,
  },
  rowCompact: {
    backgroundColor: "transparent",
    borderWidth: 0,
    paddingVertical: 4,
    paddingHorizontal: 0,
  },
  cell: { flex: 1, alignItems: "center", minWidth: 0 },
  lab: { color: C.inkDim, fontSize: 10, fontWeight: "800", marginBottom: 4, letterSpacing: 0.2 },
  barBg: {
    alignSelf: "stretch",
    height: 5,
    borderRadius: 3,
    backgroundColor: "rgba(255,255,255,0.12)",
    overflow: "hidden",
  },
  barFill: { height: 5, borderRadius: 3 },
  val: { color: C.ink, fontSize: 13, marginTop: 4, fontWeight: "900" },
});
