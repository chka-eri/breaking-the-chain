import React from "react";
import { View, Text, Pressable, StyleSheet, Image } from "react-native";
import { useGame } from "../state/GameContext";
import { LEVELS } from "../data/story";
import { ROOMS, ROOM_ORDER, LOOKS } from "../data/rooms";
import { SCENE_ART } from "../data/art";
import { C } from "../theme";
import { Screen, Card, GhostBtn, ConfirmBtn, PrimaryBtn, PatternBand } from "../components/UI";
import StatsHud from "../components/StatsHud";

export default function VillageScreen() {
  const { state, dispatch } = useGame();
  const pending = state.pendingRestore ? ROOMS[state.pendingRestore] : null;
  const allDone = state.completed.length >= 5;

  return (
    <Screen scroll style={{ padding: 16 }}>
      <Text style={s.kicker}>UMUOMA • RESTORE THE VILLAGE</Text>
      <Text style={s.h1}>{state.player.name}'s Umuoma</Text>
      <PatternBand height={10} />
      <View style={{ height: 12 }} />
      <StatsHud stats={state.stats} />
      <View style={{ height: 14 }} />

      {pending ? (
        <Card style={{ borderColor: C.gold, marginBottom: 16 }}>
          <Text style={s.restK}>RESTORE · {pending.igbo}</Text>
          <Text style={s.restT}>{pending.name}</Text>
          <Text style={s.restB}>{pending.blurb}</Text>
          <Text style={s.pick}>Choose a look — you can change it later.</Text>
          <View style={s.looks}>
            {LOOKS.map((lk) => (
              <Pressable
                key={lk.id}
                onPress={() => dispatch({ type: "RESTORE", room: pending.id, look: lk.id })}
                style={s.lookBtn}
              >
                <Text style={s.lookTxt}>{lk.name}</Text>
              </Pressable>
            ))}
          </View>
        </Card>
      ) : null}

      {ROOM_ORDER.map((id) => {
        const room = ROOMS[id];
        const done = !!(state.restore && state.restore[id]);
        const locked = state.unlocked < room.restoreChapter && !done;
        const art = SCENE_ART[room.scene];
        const look = LOOKS[state.looks && state.looks[id] != null ? state.looks[id] : 0];
        return (
          <View key={id} style={[s.room, locked && { opacity: 0.45 }]}>
            <View style={s.artWrap}>
              {art ? (
                <Image source={art} style={s.art} />
              ) : (
                <View style={[s.art, { backgroundColor: C.card, alignItems: "center", justifyContent: "center" }]}>
                  <Text style={{ fontSize: 36 }}>{room.emoji}</Text>
                </View>
              )}
              {done ? <View style={[s.tint, { backgroundColor: look.tint }]} pointerEvents="none" /> : null}
            </View>
            <View style={s.roomMeta}>
              <Text style={s.roomName}>
                {room.emoji} {room.name} {done ? "✓" : locked ? "🔒" : ""}
              </Text>
              <Text style={s.roomIgbo}>{room.igbo}</Text>
              {done ? (
                <View style={s.looks}>
                  {LOOKS.map((lk) => (
                    <Pressable
                      key={lk.id}
                      onPress={() => dispatch({ type: "SET_LOOK", room: id, look: lk.id })}
                      style={[s.lookMini, state.looks && state.looks[id] === lk.id && { borderColor: C.gold }]}
                    >
                      <Text style={s.lookMiniTxt}>{lk.name}</Text>
                    </Pressable>
                  ))}
                </View>
              ) : (
                <Text style={s.roomBlurb}>{room.blurb}</Text>
              )}
            </View>
          </View>
        );
      })}

      <Text style={[s.kicker, { marginTop: 18 }]}>THE FIVE STAGES</Text>
      {LEVELS.map((lv) => {
        const done = state.completed.includes(lv.n);
        const current = !done && lv.n === state.unlocked;
        const locked = lv.n > state.unlocked;
        return (
          <Pressable
            key={lv.n}
            disabled={locked}
            onPress={() => {
              if (current) dispatch({ type: "NAV", screen: "board" });
              else if (done) dispatch({ type: "START_LEVEL", level: lv.n, start: lv.start });
            }}
          >
            <Card
              style={[
                { marginTop: 10 },
                current && { borderColor: C.gold },
                locked && { opacity: 0.5 },
              ]}
            >
              <Text style={s.stopK}>
                CHAPTER {lv.n} {done ? "• RESTORED ✓" : current ? "• NOW PLAYING" : ""}
              </Text>
              <Text style={s.stopT}>{lv.igbo} — {lv.title}</Text>
              <Text style={s.stopB}>{lv.blurb}</Text>
            </Card>
          </Pressable>
        );
      })}

      {allDone ? (
        <View style={{ marginTop: 16 }}>
          <PrimaryBtn label="See your ending ▸" onPress={() => dispatch({ type: "NAV", screen: "ending" })} />
        </View>
      ) : (
        <View style={{ marginTop: 16 }}>
          <PrimaryBtn label="Back to the board ▸" onPress={() => dispatch({ type: "NAV", screen: "board" })} />
        </View>
      )}

      <View style={s.footer}>
        <GhostBtn small label="📜 Journal" onPress={() => dispatch({ type: "NAV", screen: "journal", remember: true })} />
        <GhostBtn small label="ℹ️ Help" onPress={() => dispatch({ type: "NAV", screen: "about", remember: true })} />
        <ConfirmBtn label="↺ New Game" confirmLabel="Tap again — sure?" onConfirm={() => dispatch({ type: "NEW_GAME" })} />
      </View>
    </Screen>
  );
}

const s = StyleSheet.create({
  kicker: { color: C.inkDim, fontSize: 11, fontWeight: "800", letterSpacing: 2, marginBottom: 4 },
  h1: { color: C.gold, fontSize: 24, fontWeight: "900", marginBottom: 10 },
  restK: { color: C.gold, fontWeight: "800", fontSize: 11, letterSpacing: 1.2 },
  restT: { color: C.ink, fontWeight: "900", fontSize: 20, marginTop: 4 },
  restB: { color: C.inkDim, marginTop: 6, lineHeight: 20 },
  pick: { color: C.ink, marginTop: 12, fontWeight: "700", fontSize: 13 },
  looks: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 10 },
  lookBtn: {
    backgroundColor: C.gold,
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  lookTxt: { color: "#26200A", fontWeight: "800", fontSize: 12 },
  lookMini: { borderWidth: 1, borderColor: C.line, borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4 },
  lookMiniTxt: { color: C.inkDim, fontSize: 10, fontWeight: "700" },
  room: { marginBottom: 14, borderRadius: 16, overflow: "hidden", borderWidth: 1, borderColor: C.line, backgroundColor: C.card },
  artWrap: { height: 120, overflow: "hidden" },
  art: { width: "100%", height: 120 },
  tint: { ...StyleSheet.absoluteFillObject },
  roomMeta: { padding: 12 },
  roomName: { color: C.ink, fontWeight: "900", fontSize: 15 },
  roomIgbo: { color: C.gold, fontSize: 12, fontWeight: "700", marginBottom: 4 },
  roomBlurb: { color: C.inkDim, fontSize: 12.5, lineHeight: 18 },
  stopK: { color: C.inkDim, fontSize: 10, fontWeight: "800", letterSpacing: 1.2 },
  stopT: { color: C.ink, fontWeight: "900", fontSize: 16, marginTop: 2 },
  stopB: { color: C.inkDim, marginTop: 4, fontSize: 12.5 },
  footer: { flexDirection: "row", flexWrap: "wrap", justifyContent: "center", gap: 8, marginTop: 18, marginBottom: 12 },
});
