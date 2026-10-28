import React, { useEffect, useRef, useState } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { C } from "../theme";
import { TOOLS } from "../data/kit";

const SECONDS = 8;

export default function PressureDuel({ kit, onHeld, onBroke }) {
  const packed = kit || [];
  const ease = packed.includes("breath") ? 0.55 : packed.includes("no") ? 0.7 : 1;
  const [hold, setHold] = useState(false);
  const [resist, setResist] = useState(55);
  const [left, setLeft] = useState(SECONDS);
  const holdRef = useRef(false);
  const ended = useRef(false);

  useEffect(() => {
    holdRef.current = hold;
  }, [hold]);

  useEffect(() => {
    const tick = setInterval(() => {
      if (ended.current) return;
      setResist((r) => {
        const pull = 7 * ease;
        const push = holdRef.current ? 11 : 0;
        return Math.max(0, Math.min(100, r - pull + push));
      });
      setLeft((t) => t - 0.1);
    }, 100);
    return () => clearInterval(tick);
  }, [ease]);

  useEffect(() => {
    if (ended.current) return;
    if (resist <= 0) {
      ended.current = true;
      onBroke();
    } else if (left <= 0) {
      ended.current = true;
      if (resist >= 42) onHeld();
      else onBroke();
    }
  }, [resist, left, onHeld, onBroke]);

  const helpers = packed.filter((id) => TOOLS[id]).slice(0, 3);

  return (
    <View style={s.wrap}>
      <Text style={s.kicker}>THE CROWD PULLS</Text>
      <Text style={s.title}>Hold your ground</Text>
      <Text style={s.sub}>
        The circle is chanting. Your chi is a rope. Press and HOLD — do not let the Chain take the line.
      </Text>

      <View style={s.barBg}>
        <View style={[s.barFill, { width: `${resist}%`, backgroundColor: resist < 35 ? C.red : C.gold }]} />
      </View>
      <Text style={s.pct}>{Math.round(resist)} · will</Text>

      <Pressable
        onPressIn={() => setHold(true)}
        onPressOut={() => setHold(false)}
        style={[s.hold, hold && s.holdOn]}
      >
        <Text style={[s.holdTxt, hold && { color: "#26200A" }]}>{hold ? "STANDING" : "HOLD TO STAND"}</Text>
      </Pressable>

      {helpers.length ? (
        <View style={s.kitRow}>
          {helpers.map((id) => (
            <Text key={id} style={s.kitChip}>
              {TOOLS[id].icon} {TOOLS[id].igbo}
            </Text>
          ))}
        </View>
      ) : (
        <Text style={s.warn}>You packed nothing. The night is heavier.</Text>
      )}
      <Text style={s.time}>{Math.max(0, left).toFixed(1)}s</Text>
    </View>
  );
}

const s = StyleSheet.create({
  wrap: { marginTop: 12, alignItems: "center" },
  kicker: { color: C.red, fontWeight: "900", letterSpacing: 2, fontSize: 11 },
  title: { color: C.gold, fontWeight: "900", fontSize: 24, marginTop: 4 },
  sub: { color: C.inkDim, textAlign: "center", marginTop: 8, lineHeight: 20, paddingHorizontal: 8 },
  barBg: {
    width: "100%",
    height: 16,
    borderRadius: 8,
    backgroundColor: "rgba(255,255,255,0.08)",
    overflow: "hidden",
    marginTop: 18,
  },
  barFill: { height: 16, borderRadius: 8 },
  pct: { color: C.ink, fontWeight: "800", marginTop: 8 },
  hold: {
    marginTop: 18,
    width: "100%",
    paddingVertical: 22,
    borderRadius: 20,
    backgroundColor: C.card,
    alignItems: "center",
    borderWidth: 2,
    borderColor: C.gold,
  },
  holdOn: { backgroundColor: C.gold },
  holdTxt: { color: C.ink, fontWeight: "900", fontSize: 16, letterSpacing: 1 },
  kitRow: { flexDirection: "row", flexWrap: "wrap", gap: 6, marginTop: 14, justifyContent: "center" },
  kitChip: {
    color: C.gold,
    fontWeight: "800",
    fontSize: 11,
    backgroundColor: "rgba(245,179,1,0.12)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
    overflow: "hidden",
  },
  warn: { color: C.red, marginTop: 12, fontWeight: "700", fontSize: 12 },
  time: { color: C.inkDim, marginTop: 8, fontWeight: "700" },
});
