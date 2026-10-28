import React, { useState } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { C } from "../theme";
import { Card, PrimaryBtn } from "./UI";

// ================================================================
// Interactive selection exercise, two modes:
//  "signs"    -> spot Nnamdi's warning signs (has correct answers)
//  "personal" -> name your own triggers (any honest selection is valid)
// ================================================================

export default function TriggerQuiz({ config, onDone }) {
  const [selected, setSelected] = useState([]);
  const [revealed, setRevealed] = useState(false);
  const items = config.items || [];
  const isSigns = config.mode === "signs";

  function toggle(i) {
    if (revealed) return;
    setSelected((sel) =>
      sel.includes(i) ? sel.filter((x) => x !== i) : [...sel, i]
    );
  }

  function submit() {
    setRevealed(true);
  }

  function finish() {
    let effects = { hope: 4 };
    if (isSigns) {
      const correctHits = selected.filter((i) => items[i] && items[i].correct).length;
      const totalCorrect = items.filter((it) => it.correct).length;
      effects = { hope: correctHits >= totalCorrect - 1 ? 6 : 3 };
    }
    onDone(effects);
  }

  return (
    <Card>
      <Text style={s.h}>🧠 {config.title}</Text>
      <Text style={s.p}>{config.prompt}</Text>

      {items.map((it, i) => {
        const isSel = selected.includes(i);
        let bg = isSel ? C.cardAlt : "transparent";
        let border = isSel ? C.gold : C.line;
        let mark = "";
        if (revealed && isSigns) {
          if (it.correct && isSel) { border = C.green; mark = " ✓"; }
          else if (it.correct && !isSel) { border = C.gold; mark = " (this was a sign)"; }
          else if (!it.correct && isSel) { border = C.red; mark = " ✗ not a warning sign"; }
        }
        return (
          <Pressable
            key={i}
            onPress={() => toggle(i)}
            style={({ pressed }) => [
              s.item,
              { backgroundColor: bg, borderColor: border },
              pressed && !revealed && { opacity: 0.7 },
            ]}
          >
            <Text style={s.itemText}>
              {isSel ? "☑ " : "☐ "}
              {it.text}
              <Text style={{ color: C.inkDim, fontSize: 12 }}>{mark}</Text>
            </Text>
          </Pressable>
        );
      })}

      {!revealed ? (
        <PrimaryBtn
          label={isSigns ? "Check my answers" : "These are mine"}
          onPress={submit}
          disabled={selected.length === 0}
        />
      ) : (
        <View>
          <View style={s.reveal}>
            <Text style={s.revealText}>{config.reveal}</Text>
          </View>
          <PrimaryBtn label="Continue the story ▸" onPress={finish} />
        </View>
      )}
    </Card>
  );
}

const s = StyleSheet.create({
  h: { color: C.gold, fontSize: 17, fontWeight: "900", marginBottom: 8, letterSpacing: 0.4 },
  p: { color: C.ink, fontSize: 14.5, lineHeight: 22, marginBottom: 14 },
  item: {
    borderWidth: 1.5,
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
  },
  itemText: { color: C.ink, fontSize: 14, lineHeight: 20 },
  reveal: {
    backgroundColor: "rgba(245,179,1,0.08)",
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: C.goldDeep,
    marginVertical: 12,
  },
  revealText: { color: C.ink, fontSize: 13.5, lineHeight: 21 },
});
