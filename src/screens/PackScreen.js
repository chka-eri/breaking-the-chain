import React, { useState } from "react";
import { View, Text, Pressable, StyleSheet, Image } from "react-native";
import { useGame } from "../state/GameContext";
import { LEVELS } from "../data/story";
import { TOOLS, TOOL_ORDER, KIT_SIZE, toolsForNight } from "../data/kit";
import { portraitFor } from "../data/art";
import { C } from "../theme";
import { Screen, PrimaryBtn, PatternBand } from "../components/UI";

export default function PackScreen() {
  const { state, dispatch } = useGame();
  const level = LEVELS[(state.level || 1) - 1] || LEVELS[0];
  const allowed = toolsForNight(state.level, state.proverbs);
  const [kit, setKit] = useState([]);

  function toggle(id) {
    setKit((k) => {
      if (k.includes(id)) return k.filter((x) => x !== id);
      if (k.length >= KIT_SIZE) return k;
      return [...k, id];
    });
  }

  return (
    <Screen scroll style={{ padding: 16 }}>
      <Text style={s.kicker}>NIGHT {level.n} · PACK YOUR CHI</Text>
      <Text style={s.h1}>{level.igbo}</Text>
      <Text style={s.sub}>
        Prepare your "no" before the moment. Take {KIT_SIZE} things into the night. What you
        leave behind, you will not have when the crowd pulls.
      </Text>
      <PatternBand height={10} />

      <View style={s.faces}>
        {["Mama Ify", "Ngozi", "Nnamdi"].map((n) => (
          <View key={n} style={s.faceWrap}>
            <Image source={portraitFor(n, state.player)} style={s.face} />
            <Text style={s.faceN}>{n.split(" ")[0]}</Text>
          </View>
        ))}
      </View>

      <Text style={s.picked}>
        Packed {kit.length}/{KIT_SIZE}
      </Text>

      {TOOL_ORDER.filter((id) => allowed.includes(id)).map((id) => {
        const t = TOOLS[id];
        const on = kit.includes(id);
        return (
          <Pressable key={id} onPress={() => toggle(id)} style={[s.row, on && s.rowOn]}>
            <Text style={s.icon}>{t.icon}</Text>
            <View style={{ flex: 1 }}>
              <Text style={s.name}>
                {t.name} · {t.igbo}
              </Text>
              <Text style={s.hint}>{t.hint}</Text>
            </View>
            <Text style={s.mark}>{on ? "✓" : "+"}</Text>
          </Pressable>
        );
      })}

      <View style={{ height: 16 }} />
      <PrimaryBtn
        label={kit.length ? `Walk into the night ▸` : "Walk in empty-handed ▸"}
        onPress={() => dispatch({ type: "PACK", kit })}
      />
      <Text style={s.note}>Empty-handed is a choice. The crowd will notice.</Text>
    </Screen>
  );
}

const s = StyleSheet.create({
  kicker: { color: C.inkDim, fontWeight: "800", letterSpacing: 1.5, fontSize: 11 },
  h1: { color: C.gold, fontWeight: "900", fontSize: 28, marginTop: 4 },
  sub: { color: C.inkDim, marginTop: 8, lineHeight: 20, marginBottom: 12 },
  faces: { flexDirection: "row", justifyContent: "center", gap: 16, marginVertical: 14 },
  faceWrap: { alignItems: "center" },
  face: { width: 56, height: 56, borderRadius: 28, borderWidth: 2, borderColor: C.gold },
  faceN: { color: C.inkDim, fontSize: 10, fontWeight: "700", marginTop: 4 },
  picked: { color: C.gold, fontWeight: "900", marginBottom: 10 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 12,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.04)",
    marginBottom: 8,
  },
  rowOn: { backgroundColor: "rgba(245,179,1,0.14)" },
  icon: { fontSize: 22, width: 32, textAlign: "center" },
  name: { color: C.ink, fontWeight: "800", fontSize: 14 },
  hint: { color: C.inkDim, fontSize: 12, lineHeight: 17, marginTop: 2 },
  mark: { color: C.gold, fontWeight: "900", fontSize: 18 },
  note: { color: C.inkDim, textAlign: "center", marginTop: 10, fontSize: 12 },
});
