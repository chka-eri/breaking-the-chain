import React, { useEffect, useRef, useState } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { useGame } from "../state/GameContext";
import { DREAMS } from "../data/dreams";
import { C } from "../theme";
import { Screen } from "../components/UI";

const ROUNDS = 8;

function flavor(dream) {
  if (dream === "musician") {
    return { verb: "Hit the beat", miss: "The bar slipped.", unit: "bars" };
  }
  if (dream === "engineer") {
    return { verb: "Lock the pattern", miss: "The line drifted.", unit: "fits" };
  }
  return { verb: "Strike the window", miss: "The shot sailed.", unit: "shots" };
}

export default function TrainScreen() {
  const { state, dispatch } = useGame();
  const dream = state.player.dream;
  const f = flavor(dream);
  const impair = state.impair || 0;
  const chain = state.stats.chain || 0;

  const zone = Math.max(10, 24 - chain / 10 - impair * 5);
  const speed = 1.8 + impair * 0.7 + chain / 40;

  const [pos, setPos] = useState(0);
  const [dir, setDir] = useState(1);
  const [round, setRound] = useState(1);
  const [hits, setHits] = useState(0);
  const [flash, setFlash] = useState(null);
  const [done, setDone] = useState(false);
  const posRef = useRef(0);
  const dirRef = useRef(1);
  const lock = useRef(false);

  useEffect(() => {
    posRef.current = pos;
    dirRef.current = dir;
  }, [pos, dir]);

  useEffect(() => {
    if (done) return;
    const t = setInterval(() => {
      let p = posRef.current + dirRef.current * speed;
      let d = dirRef.current;
      if (p >= 100) {
        p = 100;
        d = -1;
      }
      if (p <= 0) {
        p = 0;
        d = 1;
      }
      posRef.current = p;
      dirRef.current = d;
      setPos(p);
      setDir(d);
    }, 16);
    return () => clearInterval(t);
  }, [speed, done]);

  const sweetStart = 50 - zone / 2;
  const sweetEnd = 50 + zone / 2;

  function strike() {
    if (done || lock.current) return;
    lock.current = true;
    const hit = posRef.current >= sweetStart && posRef.current <= sweetEnd;
    setFlash(hit ? "hit" : "miss");
    const nextHits = hits + (hit ? 1 : 0);
    if (hit) setHits(nextHits);
    setTimeout(() => {
      setFlash(null);
      if (round >= ROUNDS) {
        setDone(true);
        const skillGain = 4 + nextHits * 3 - impair * 2;
        const hope = nextHits >= 5 ? 4 : nextHits >= 3 ? 1 : -2;
        dispatch({
          type: "TRAIN_DONE",
          effects: { skill: skillGain, hope },
          result: { hits: nextHits, rounds: ROUNDS, impaired: impair > 0 },
        });
      } else {
        setRound((r) => r + 1);
        lock.current = false;
      }
    }, 280);
  }

  const d = DREAMS[dream] || DREAMS.footballer;

  return (
    <Screen>
      <View style={s.pad}>
        <Text style={s.kicker}>{d.label.toUpperCase()} · WEEK {state.week}</Text>
        <Text style={s.h1}>{f.verb}</Text>
        {impair > 0 ? (
          <Text style={s.warn}>
            The Chain is in your hands. Window is smaller. Timing is late. This is what use costs.
          </Text>
        ) : (
          <Text style={s.sub}>Tap when the fire is inside the gold. {ROUNDS} {f.unit}.</Text>
        )}

        <Text style={s.round}>
          {round}/{ROUNDS} · hits {hits}
        </Text>

        <View style={s.track}>
          <View
            style={[
              s.sweet,
              {
                left: `${sweetStart}%`,
                width: `${zone}%`,
              },
            ]}
          />
          <View style={[s.mark, { left: `${pos}%` }]} />
        </View>

        <Pressable onPress={strike} style={[s.btn, flash === "hit" && s.btnHit, flash === "miss" && s.btnMiss]}>
          <Text style={s.btnTxt}>{flash === "hit" ? "YES" : flash === "miss" ? f.miss : "TAP"}</Text>
        </Pressable>

        <Text style={s.hint}>
          Skill {state.stats.skill} · Chain {state.stats.chain}
          {impair ? ` · fog ${impair}d` : ""}
        </Text>
      </View>
    </Screen>
  );
}

const s = StyleSheet.create({
  pad: { flex: 1, padding: 20, justifyContent: "center" },
  kicker: { color: C.inkDim, fontWeight: "800", letterSpacing: 1.4, fontSize: 11 },
  h1: { color: C.gold, fontWeight: "900", fontSize: 28, marginTop: 4 },
  sub: { color: C.inkDim, marginTop: 8, lineHeight: 20 },
  warn: { color: C.red, marginTop: 8, lineHeight: 20, fontWeight: "700" },
  round: { color: C.ink, fontWeight: "800", marginTop: 22, marginBottom: 12 },
  track: {
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.08)",
    overflow: "hidden",
    justifyContent: "center",
  },
  sweet: {
    position: "absolute",
    top: 6,
    bottom: 6,
    backgroundColor: C.gold,
    borderRadius: 16,
    opacity: 0.9,
  },
  mark: {
    position: "absolute",
    width: 10,
    height: 36,
    marginLeft: -5,
    borderRadius: 4,
    backgroundColor: C.ink,
  },
  btn: {
    marginTop: 28,
    backgroundColor: C.gold,
    borderRadius: 20,
    paddingVertical: 22,
    alignItems: "center",
  },
  btnHit: { backgroundColor: C.green },
  btnMiss: { backgroundColor: C.red },
  btnTxt: { color: "#26200A", fontWeight: "900", fontSize: 20, letterSpacing: 1 },
  hint: { color: C.inkDim, textAlign: "center", marginTop: 16, fontWeight: "700" },
});
