import React, { useState } from "react";
import { View, Text, Pressable, StyleSheet, ImageBackground } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useGame } from "../state/GameContext";
import { WEEKS } from "../data/weeks";
import { DREAMS } from "../data/dreams";
import { SCENE_ART, portraitFor } from "../data/art";
import { C } from "../theme";
import { Screen, Sheet, Portrait, TextLink } from "../components/UI";
import StatsHud from "../components/StatsHud";

export default function HubScreen() {
  const { state, dispatch } = useGame();
  const week = WEEKS[(state.week || 1) - 1] || WEEKS[0];
  const dream = DREAMS[state.player.dream] || DREAMS.footballer;
  const you = portraitFor("You", state.player);
  const nightDone = state.completed.includes(state.week);
  const trialReady = state.completed.length >= 5;
  const hands = Math.max(0, 100 - state.stats.chain - (state.impair || 0) * 12);
  const insets = useSafeAreaInsets();
  const [armReset, setArmReset] = useState(false);
  const road =
    state.completed.length >= 2
      ? state.flags.path === "helper"
        ? "Helper's road"
        : "Struggler's road"
      : "The road is still open";

  return (
    <Screen scroll full>
      <Sheet>
        <ImageBackground source={SCENE_ART[week.art]} style={s.hero}>
          <LinearGradient
            colors={["rgba(14,26,18,0.15)", "rgba(14,26,18,0.88)"]}
            style={[s.heroShade, { paddingTop: insets.top + 16 }]}
          >
            <Text style={s.kicker}>WEEK {week.n} · {week.stage.toUpperCase()}</Text>
            <Text style={s.igbo}>{week.igbo}</Text>
            <Text style={s.blurb}>{week.blurb}</Text>
          </LinearGradient>
        </ImageBackground>

        <View style={[s.body, { paddingBottom: Math.max(insets.bottom, 16) + 8 }]}>
          <View style={s.who}>
            <Portrait source={you} name={state.player.name} role={dream.label} size={156} />
            <Text style={s.dream}>{dream.goal}</Text>
            <Text style={s.road}>{road}</Text>
          </View>

          <View style={s.card}>
            <View style={s.meterHead}>
              <Text style={s.lab}>Your hands</Text>
              <Text style={[s.meterVal, { color: hands > 55 ? C.gold : C.red }]}>{hands}</Text>
            </View>
            <View style={s.barBg}>
              <View style={[s.bar, { width: `${hands}%`, backgroundColor: hands > 55 ? C.gold : C.red }]} />
            </View>
            <Text style={s.meta}>
              Skill {state.stats.skill}
              {state.impair ? ` · fog for ${state.impair} more trainings` : " · clear"}
            </Text>
          </View>

          <View style={{ marginTop: 12 }}>
            <StatsHud stats={state.stats} compact />
          </View>

          {state.lastTrain ? (
            <Text style={s.note}>
              Last run: {state.lastTrain.score || 0} points · {state.lastTrain.hits} gifts
              {state.lastTrain.impaired ? " · a cup tagged you" : " · clean"}
            </Text>
          ) : null}
          {state.lastNight ? (
            <Text style={s.note}>
              Last night:{" "}
              {state.lastNight.choice && state.lastNight.choice.tag === "use"
                ? "the cup found someone"
                : "hands stayed yours"}
            </Text>
          ) : null}

          <Pressable onPress={() => dispatch({ type: "GO_TRAIN" })} style={s.primary}>
            <Text style={s.primaryT}>{week.runLabel || "Run Umuoma"}</Text>
            <Text style={s.primaryS}>{week.runTip || "Drag · dodge drugs · catch prayers"}</Text>
          </Pressable>

          {!nightDone ? (
            <Pressable onPress={() => dispatch({ type: "GO_NIGHT" })} style={s.nightBtn}>
              <Text style={s.nightT}>Face the night</Text>
              <Text style={s.nightS}>One choice. Tomorrow's hands will show it.</Text>
            </Pressable>
          ) : trialReady ? (
            <Pressable onPress={() => dispatch({ type: "NAV", screen: "ending" })} style={s.primary}>
              <Text style={s.primaryT}>Walk to the trial</Text>
            </Pressable>
          ) : (
            <Text style={s.done}>Night survived. Train, then the next week opens.</Text>
          )}

          <View style={s.weeks}>
            {WEEKS.map((w) => {
              const done = state.completed.includes(w.n);
              const on = w.n === state.week;
              return (
                <View key={w.n} style={[s.seg, done && s.segDone, on && s.segOn]}>
                  <Text style={[s.segN, on && s.segNOn]}>{w.n}</Text>
                </View>
              );
            })}
          </View>
          <Text style={s.weekCap}>{week.title}</Text>

          <View style={s.links}>
            <TextLink
              label={`Wisdom ${state.proverbs.length}/7`}
              onPress={() => dispatch({ type: "NAV", screen: "journal", remember: true })}
            />
            <Text style={s.dot}>·</Text>
            <TextLink
              label="Help"
              onPress={() => dispatch({ type: "NAV", screen: "about", remember: true })}
            />
            <Text style={s.dot}>·</Text>
            <TextLink
              label={armReset ? "Tap again to start over" : "Start over"}
              color={armReset ? C.red : C.inkDim}
              onPress={() => {
                if (armReset) {
                  setArmReset(false);
                  dispatch({ type: "NEW_GAME" });
                } else {
                  setArmReset(true);
                  setTimeout(() => setArmReset(false), 2500);
                }
              }}
            />
          </View>
        </View>
      </Sheet>
    </Screen>
  );
}

const s = StyleSheet.create({
  hero: { minHeight: 168, width: "100%" },
  heroShade: { minHeight: 168, paddingHorizontal: 22, paddingBottom: 22, justifyContent: "flex-end" },
  kicker: { color: C.gold, fontWeight: "800", fontSize: 11, letterSpacing: 1.4 },
  igbo: { color: C.ink, fontWeight: "900", fontSize: 32, marginTop: 4 },
  blurb: { color: C.inkDim, fontSize: 15, lineHeight: 21, marginTop: 6 },
  body: { paddingHorizontal: 20, paddingTop: 8 },
  who: { alignItems: "center", marginTop: -28 },
  dream: { color: C.inkDim, fontSize: 14, textAlign: "center", marginTop: 8, lineHeight: 20 },
  road: { color: C.ink, fontWeight: "800", fontSize: 13, marginTop: 4 },
  card: {
    marginTop: 18,
    backgroundColor: C.card,
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: C.line,
  },
  meterHead: { flexDirection: "row", justifyContent: "space-between", alignItems: "baseline", marginBottom: 8 },
  lab: { color: C.inkDim, fontWeight: "800", fontSize: 12, letterSpacing: 0.4 },
  meterVal: { fontWeight: "900", fontSize: 22 },
  barBg: { height: 8, borderRadius: 4, backgroundColor: "rgba(255,255,255,0.08)", overflow: "hidden" },
  bar: { height: 8, borderRadius: 4 },
  meta: { color: C.ink, fontWeight: "700", marginTop: 8, fontSize: 13 },
  note: { color: C.inkDim, marginTop: 10, fontSize: 13, lineHeight: 18 },
  primary: {
    backgroundColor: C.gold,
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 16,
    alignItems: "center",
    marginBottom: 10,
    marginTop: 16,
  },
  primaryT: { color: "#26200A", fontWeight: "900", fontSize: 17 },
  primaryS: { color: "#26200A", fontSize: 13, marginTop: 4, textAlign: "center", lineHeight: 18 },
  nightBtn: {
    borderWidth: 1.5,
    borderColor: C.gold,
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 16,
    alignItems: "center",
    marginBottom: 8,
  },
  nightT: { color: C.gold, fontWeight: "900", fontSize: 16 },
  nightS: { color: C.inkDim, fontSize: 13, marginTop: 4, textAlign: "center" },
  done: { color: C.green, textAlign: "center", fontWeight: "700", marginVertical: 12, fontSize: 14 },
  weeks: { flexDirection: "row", gap: 8, marginTop: 18 },
  seg: {
    flex: 1,
    height: 36,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: C.line,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.03)",
  },
  segOn: { borderColor: C.gold, backgroundColor: "rgba(245,179,1,0.16)" },
  segDone: { backgroundColor: C.greenDeep, borderColor: C.green },
  segN: { color: C.inkDim, fontWeight: "800", fontSize: 13 },
  segNOn: { color: C.ink },
  weekCap: { color: C.inkDim, textAlign: "center", marginTop: 8, fontWeight: "700", fontSize: 12 },
  links: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 22,
  },
  dot: { color: C.line, fontSize: 16 },
});
