import React, { useEffect, useRef, useState } from "react";
import { View, Text, Pressable, StyleSheet, ScrollView, Image } from "react-native";
import { useGame } from "../state/GameContext";
import { getNode, LEVELS } from "../data/story";
import { fill } from "../data/dreams";
import { PROVERBS } from "../data/proverbs";
import { C, SPEAKER_COLORS, STAT_META } from "../theme";
import SceneBanner from "../components/SceneBanner";
import TypeText from "../components/TypeText";
import StatsHud from "../components/StatsHud";
import CravingGame from "../components/CravingGame";
import TriggerQuiz from "../components/TriggerQuiz";
import PressureDuel from "../components/PressureDuel";
import { Screen, Card, PrimaryBtn, PatternBand } from "../components/UI";
import { portraitFor } from "../data/art";
import { TOOLS } from "../data/kit";

export default function StoryScreen() {
  const { state, dispatch } = useGame();
  const node = getNode(state.nodeId);

  const [typed, setTyped] = useState(false);
  const [forceDone, setForceDone] = useState(false);
  const [chips, setChips] = useState([]);
  const [autoNote, setAutoNote] = useState(false);
  const prevStats = useRef(state.stats);
  const prevProverbs = useRef(state.proverbs.length);
  const answeredRef = useRef(false);
  const chipTimer = useRef(null);
  const [pressure, setPressure] = useState("idle"); // idle | fight | held | broke

  // Reset per-node UI state
  useEffect(() => {
    setTyped(false);
    setForceDone(false);
    answeredRef.current = false;
    setPressure("idle");
  }, [state.nodeId]);

  // Stat-change toast chips
  useEffect(() => {
    const diffs = [];
    Object.keys(state.stats).forEach((k) => {
      const d = state.stats[k] - (prevStats.current[k] ?? state.stats[k]);
      if (d !== 0) diffs.push({ k, d });
    });
    if (state.proverbs.length > prevProverbs.current) {
      diffs.push({ k: "_proverb", d: 1 });
    }
    prevStats.current = state.stats;
    prevProverbs.current = state.proverbs.length;
    if (diffs.length || autoNote) {
      setChips(diffs);
      if (chipTimer.current) clearTimeout(chipTimer.current);
      chipTimer.current = setTimeout(() => {
        setChips([]);
        setAutoNote(false);
      }, 2600);
    }
  }, [state.stats, state.proverbs, autoNote]);

  useEffect(() => {
    if (!node) dispatch({ type: "NAV", screen: "nights" });
  }, [node, dispatch]);

  if (!node) return <Screen />;

  const level = LEVELS[(state.level || 1) - 1] || LEVELS[0];

  function choose(option, auto) {
    if (answeredRef.current) return;
    answeredRef.current = true;
    if (auto) setAutoNote(true);
    dispatch({
      type: "CHOOSE",
      effects: option.effects,
      setFlags: option.setFlags,
      collect: option.collect,
      next: option.next,
    });
  }

  function onTimerExpire() {
    if (answeredRef.current) return;
    const pressured =
      (node.options || []).find((o) => o.pressured) || (node.options || [])[0];
    if (pressured) choose(pressured, true);
  }

  function onMinigameDone(effects) {
    if (answeredRef.current) return;
    answeredRef.current = true;
    dispatch({ type: "CHOOSE", effects, next: node.next });
  }

  const speaker = node.speaker ? fill(node.speaker, state.player) : null;
  const speakerColor = SPEAKER_COLORS[node.speaker] || C.gold;

  return (
    <Screen>
      {/* Header */}
      <View style={s.header}>
        <Text style={s.levelChip}>
          {level.emoji} Chapter {level.n} • {level.igbo}
        </Text>
        <Text style={s.journalChip}>
          {(state.kit || []).map((id) => (TOOLS[id] ? TOOLS[id].icon : "")).join(" ")}  📜 {state.proverbs.length}/7
        </Text>
      </View>
      <View style={{ paddingHorizontal: 14, marginBottom: 8 }}>
        <StatsHud stats={state.stats} />
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 14, paddingBottom: 60 }}
        showsVerticalScrollIndicator={false}
      >
        {/* LESSON CARD */}
        {node.type === "lesson" ? (
          <LessonCard node={node} dispatch={dispatch} />
        ) : (
          <View>
            <SceneBanner sceneKey={node.scene} />

            {/* MINIGAMES */}
            {node.type === "minigame" ? (
              <View style={{ marginTop: 12 }}>
                {node.game === "craving" ? (
                  <CravingGame config={node.config} onDone={onMinigameDone} />
                ) : (
                  <TriggerQuiz
                    config={{
                      ...node.config,
                      prompt: fill(node.config.prompt, state.player),
                    }}
                    onDone={onMinigameDone}
                  />
                )}
              </View>
            ) : (
              <View>
                {/* Speaker + text */}
                {speaker ? (
                  <View style={s.speakerRow}>
                    {portraitFor(node.speaker, state.player) ? (
                      <Image
                        source={portraitFor(node.speaker, state.player)}
                        style={[s.portrait, { borderColor: speakerColor }]}
                      />
                    ) : (
                      <View style={[s.speakerDot, { backgroundColor: speakerColor }]} />
                    )}
                    <Text style={[s.speakerName, { color: speakerColor }]}>
                      {speaker === "You" ? state.player.name : speaker}
                    </Text>
                  </View>
                ) : null}
                <Card style={{ marginTop: 8 }}>
                  <TypeText
                    text={fill(node.text, state.player)}
                    style={s.bodyText}
                    complete={forceDone}
                    onDone={() => setTyped(true)}
                  />
                </Card>

                {/* LINE -> continue */}
                {node.type === "line" && (
                  <View style={{ marginTop: 14 }}>
                    <PrimaryBtn
                      label={typed ? "Gaa n'ihu ▸  (Continue)" : "Show all text"}
                      onPress={() => {
                        if (!typed) return setForceDone(true);
                        dispatch({ type: "CHOOSE", next: node.next });
                      }}
                    />
                  </View>
                )}

                {node.type === "choice" && !typed && (
                  <View style={{ marginTop: 14 }}>
                    <PrimaryBtn label="Show all text" onPress={() => setForceDone(true)} />
                  </View>
                )}

                {node.type === "choice" && typed && node.timed && pressure === "idle" && (
                  <View style={{ marginTop: 12 }}>
                    <PrimaryBtn label="The crowd is pulling — stand ▸" onPress={() => setPressure("fight")} />
                  </View>
                )}

                {node.type === "choice" && typed && node.timed && pressure === "fight" && (
                  <PressureDuel
                    kit={state.kit}
                    onHeld={() => setPressure("held")}
                    onBroke={() => {
                      setPressure("broke");
                      onTimerExpire();
                    }}
                  />
                )}

                {node.type === "choice" && typed && (!node.timed || pressure === "held") && (
                  <View style={{ marginTop: 14 }}>
                    <Witnesses player={state.player} />
                    {(node.options || []).map((opt, i) => {
                      const locked = opt.needKit && !(state.kit || []).includes(opt.needKit);
                      const tool = opt.needKit ? TOOLS[opt.needKit] : null;
                      return (
                        <Pressable
                          key={i}
                          disabled={locked}
                          onPress={() => choose(opt)}
                          style={({ pressed }) => [
                            s.choice,
                            opt.pressured && s.choicePressured,
                            locked && { opacity: 0.38 },
                            pressed && !locked && { opacity: 0.75 },
                          ]}
                        >
                          <Text style={s.choiceText}>{fill(opt.text, state.player)}</Text>
                          {opt.sub ? <Text style={s.choiceSub}>{opt.sub}</Text> : null}
                          {locked && tool ? (
                            <Text style={s.locked}>
                              Locked — you did not pack {tool.igbo}
                            </Text>
                          ) : null}
                        </Pressable>
                      );
                    })}
                  </View>
                )}
              </View>
            )}
          </View>
        )}
      </ScrollView>

      {/* Stat-change toast */}
      {chips.length > 0 || autoNote ? (
        <View style={s.toast} pointerEvents="none">
          {autoNote ? (
            <Text style={s.toastNote}>⏳ You hesitated — the moment chose for you.</Text>
          ) : null}
          <View style={s.chipRow}>
            {chips.map((c, i) => {
              if (c.k === "_proverb") {
                return (
                  <Text key={i} style={[s.chip, { color: C.gold, borderColor: C.gold }]}>
                    📜 New wisdom collected!
                  </Text>
                );
              }
              const meta = STAT_META[c.k];
              if (!meta) return null;
              const good = meta.inverted ? c.d < 0 : c.d > 0;
              return (
                <Text
                  key={i}
                  style={[
                    s.chip,
                    { color: good ? C.green : C.red, borderColor: good ? C.green : C.red },
                  ]}
                >
                  {meta.icon} {c.d > 0 ? "+" : ""}
                  {c.d} {meta.igbo}
                </Text>
              );
            })}
          </View>
        </View>
      ) : null}
    </Screen>
  );
}

function Witnesses({ player }) {
  const names = ["Mama Ify", "Ngozi", "Nnamdi", "Baros"];
  return (
    <View style={{ flexDirection: "row", gap: 8, marginBottom: 12 }}>
      {names.map((n) => {
        const p = portraitFor(n, player);
        return p ? <Image key={n} source={p} style={{ width: 36, height: 36, borderRadius: 18, borderWidth: 1, borderColor: C.line }} /> : null;
      })}
      <Text style={{ color: C.inkDim, fontSize: 11, fontWeight: "700", alignSelf: "center" }}>They are watching</Text>
    </View>
  );
}

function LessonCard({ node, dispatch }) {
  const L = node.lesson;
  const prov = PROVERBS[L.proverb];
  return (
    <View>
      <Card style={{ borderColor: C.goldDeep }}>
        <Text style={s.lessonKicker}>{L.igbo}</Text>
        <Text style={s.lessonTitle}>{L.title}</Text>
        <PatternBand height={10} />
        <Text style={[s.bodyText, { marginTop: 12 }]}>{L.body}</Text>
        <View style={{ marginTop: 12 }}>
          {L.bullets.map((b, i) => (
            <View key={i} style={s.bulletRow}>
              <Text style={s.bulletDot}>◆</Text>
              <Text style={s.bulletText}>{b}</Text>
            </View>
          ))}
        </View>
      </Card>
      {prov ? (
        <Card style={{ marginTop: 12, backgroundColor: "rgba(245,179,1,0.07)", borderColor: C.goldDeep }}>
          <Text style={s.provKicker}>📜 WISDOM OF THE ELDERS</Text>
          <Text style={s.provIgbo}>"{prov.igbo}"</Text>
          <Text style={s.provEng}>{prov.english}</Text>
          <Text style={s.provMeaning}>{prov.meaning}</Text>
        </Card>
      ) : null}
      <View style={{ marginTop: 16 }}>
        <PrimaryBtn
          label="Restore this place ▸"
          onPress={() => dispatch({ type: "COMPLETE_LEVEL", level: node.completeLevel })}
        />
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  levelChip: { color: C.inkDim, fontWeight: "800", fontSize: 12, letterSpacing: 0.8 },
  journalChip: { color: C.gold, fontWeight: "800", fontSize: 12 },
  speakerRow: { flexDirection: "row", alignItems: "center", marginTop: 14 },
  speakerDot: { width: 10, height: 10, borderRadius: 5, marginRight: 8 },
  portrait: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: 10,
    borderWidth: 2,
    backgroundColor: C.card,
  },
  speakerName: { fontWeight: "900", fontSize: 13, letterSpacing: 1, textTransform: "uppercase" },
  bodyText: { color: C.ink, fontSize: 15.5, lineHeight: 24 },
  choice: {
    backgroundColor: C.card,
    borderWidth: 1.5,
    borderColor: C.line,
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
  },
  choicePressured: { borderColor: "rgba(228,87,46,0.55)" },
  choiceText: { color: C.ink, fontSize: 14.5, fontWeight: "700", lineHeight: 21 },
  choiceSub: { color: C.inkDim, fontSize: 12, marginTop: 4, fontStyle: "italic" },
  locked: { color: C.red, fontSize: 11, fontWeight: "800", marginTop: 6 },
  toast: {
    position: "absolute",
    bottom: 14,
    left: 14,
    right: 14,
    alignItems: "center",
  },
  toastNote: {
    color: C.red,
    fontWeight: "800",
    fontSize: 12,
    marginBottom: 6,
    backgroundColor: "rgba(14,26,18,0.95)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    overflow: "hidden",
  },
  chipRow: { flexDirection: "row", flexWrap: "wrap", justifyContent: "center", gap: 6 },
  chip: {
    backgroundColor: "rgba(14,26,18,0.95)",
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
    fontSize: 12,
    fontWeight: "800",
    overflow: "hidden",
    marginHorizontal: 3,
    marginBottom: 4,
  },
  lessonKicker: { color: C.inkDim, fontSize: 11, fontWeight: "800", letterSpacing: 2, textTransform: "uppercase", marginBottom: 4 },
  lessonTitle: { color: C.gold, fontSize: 24, fontWeight: "900", marginBottom: 12 },
  bulletRow: { flexDirection: "row", marginBottom: 8 },
  bulletDot: { color: C.gold, marginRight: 8, fontSize: 12, lineHeight: 20 },
  bulletText: { color: C.ink, fontSize: 13.5, lineHeight: 20, flex: 1 },
  provKicker: { color: C.gold, fontSize: 11, fontWeight: "900", letterSpacing: 1.5, marginBottom: 8 },
  provIgbo: { color: C.ink, fontSize: 17, fontWeight: "800", fontStyle: "italic", lineHeight: 25, marginBottom: 6 },
  provEng: { color: C.gold, fontSize: 14, fontWeight: "700", marginBottom: 8 },
  provMeaning: { color: C.inkDim, fontSize: 13, lineHeight: 20 },
});
