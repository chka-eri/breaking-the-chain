import React, { useState } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useGame } from "../state/GameContext";
import { LEVELS } from "../data/story";
import { getSessions } from "../data/chores";
import { C } from "../theme";
import { Screen, Card } from "../components/UI";
import StatsHud from "../components/StatsHud";
import MergeBoard from "../components/MergeBoard";
import GeneratorDock from "../components/GeneratorDock";
import { IKE_MAX } from "../merge/engine";

export default function BoardScreen() {
  const { state, dispatch } = useGame();
  const [selected, setSelected] = useState(null);
  const level = LEVELS[(state.level || 1) - 1] || LEVELS[0];
  const sessions = getSessions(state.level, state.flags, state.stats);
  const sess = sessions[state.sessionIndex];
  const canStory =
    sess && (state.coins || 0) >= sess.cost && (sess.start !== "continue" || state.storyCursor);

  if (state.tutorial === 0) {
    return (
      <Screen>
        <Pressable style={s.tutPage} onPress={() => dispatch({ type: "TUTORIAL", step: 1 })}>
          <Card style={{ borderColor: C.gold }}>
            <Text style={s.tutK}>THE UMUNNA TABLE · KA ANYỊ MALITE</Text>
            <Text style={s.tutT}>Sit. Merge. Give.</Text>
            <Text style={s.tutB}>
              The board is the family table — no cages, no boxes.{"\n\n"}
              Drag a gift from anywhere onto its twin to grow it.{"\n"}
              Slide it across empty space.{"\n"}
              Drag it onto a person above the table to give it.{"\n\n"}
              Baros may sit with the family. Giving to him feeds the Chain.
            </Text>
            <Text style={s.tutGold}>The Chain locks gifts. It is never a recipe. Sit down.</Text>
          </Card>
        </Pressable>
      </Screen>
    );
  }

  return (
    <Screen>
      <LinearGradient colors={[C.bgDeep, "#1A2E20"]} style={{ flex: 1 }}>
        <View style={s.head}>
          <View>
            <Text style={s.kicker}>
              {level.emoji}  {level.igbo}
            </Text>
            <Text style={s.name}>{state.player.name}</Text>
          </View>
          <View style={s.pills}>
            <Text style={s.pill}>💰 {state.coins}</Text>
            <Text style={s.pill}>⚡ {state.ike}/{IKE_MAX}</Text>
            <Text style={s.pill}>📜 {state.proverbs.length}/7</Text>
          </View>
        </View>
        <View style={{ paddingHorizontal: 10, marginBottom: 6 }}>
          <StatsHud stats={state.stats} compact />
        </View>

        <MergeBoard
          board={state.board || []}
          dream={state.player.dream}
          player={state.player}
          orders={state.orders}
          selected={selected}
          onSelect={setSelected}
          onMerge={(from, to) => {
            dispatch({ type: "MERGE", from, to });
            setSelected(null);
          }}
          onMove={(from, to) => {
            dispatch({ type: "MOVE", from, to });
            setSelected(null);
          }}
          onFulfill={(id) => {
            dispatch({ type: "FULFILL", orderId: id });
            setSelected(null);
          }}
          onTrash={(index) => {
            dispatch({ type: "TRASH", index });
            setSelected(null);
          }}
        />

        <GeneratorDock
          unlocked={state.unlocked}
          ike={state.ike}
          board={state.board || []}
          onGen={(genId) => dispatch({ type: "GEN", genId })}
        />

        <View style={{ paddingHorizontal: 14, marginTop: 8 }}>
          {sess ? (
            canStory ? (
              <Pressable onPress={() => dispatch({ type: "START_STORY" })} style={s.storyGo}>
                <Text style={s.storyGoTxt}>▶  {sess.title}</Text>
                <Text style={s.storyGoSub}>{sess.cost} coins · the table is listening</Text>
              </Pressable>
            ) : (
              <Text style={s.storyWait}>
                Next: {sess.title} · {Math.max(0, sess.cost - (state.coins || 0))} more coins
              </Text>
            )
          ) : (
            <Text style={s.storyWait}>The chapter is walking itself out.</Text>
          )}
        </View>

        <View style={s.tabs}>
          <Pressable onPress={() => dispatch({ type: "NAV", screen: "village", remember: true })}>
            <Text style={s.tab}>🏡 Village</Text>
          </Pressable>
          <Pressable onPress={() => dispatch({ type: "NAV", screen: "journal", remember: true })}>
            <Text style={s.tab}>📜 Journal</Text>
          </Pressable>
          <Pressable onPress={() => dispatch({ type: "NAV", screen: "about", remember: true })}>
            <Text style={s.tab}>ℹ️ Help</Text>
          </Pressable>
        </View>
      </LinearGradient>
    </Screen>
  );
}

const s = StyleSheet.create({
  head: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    paddingHorizontal: 14,
    paddingBottom: 6,
  },
  kicker: { color: C.inkDim, fontSize: 11, fontWeight: "800", letterSpacing: 1.2 },
  name: { color: C.gold, fontSize: 22, fontWeight: "900" },
  pills: { flexDirection: "row", gap: 6 },
  pill: {
    color: C.ink,
    backgroundColor: "rgba(255,255,255,0.06)",
    overflow: "hidden",
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 4,
    fontSize: 11,
    fontWeight: "800",
  },
  storyGo: {
    backgroundColor: C.gold,
    borderRadius: 16,
    paddingVertical: 12,
    alignItems: "center",
  },
  storyGoTxt: { color: "#26200A", fontWeight: "900", fontSize: 16 },
  storyGoSub: { color: "#26200A", fontWeight: "600", fontSize: 11, marginTop: 2, opacity: 0.8 },
  storyWait: { color: C.inkDim, textAlign: "center", fontSize: 12, fontWeight: "700" },
  tabs: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    paddingVertical: 12,
    paddingBottom: 18,
  },
  tab: { color: C.inkDim, fontWeight: "800", fontSize: 13 },
  tutPage: { flex: 1, justifyContent: "center", padding: 18 },
  tutK: { color: C.inkDim, fontWeight: "800", fontSize: 11, letterSpacing: 1.5, marginBottom: 6 },
  tutT: { color: C.gold, fontWeight: "900", fontSize: 22, marginBottom: 10 },
  tutB: { color: C.ink, fontSize: 14, lineHeight: 22 },
  tutGold: { color: C.gold, fontWeight: "800", marginTop: 12 },
});
