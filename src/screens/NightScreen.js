import React, { useState } from "react";
import { View, Text, Pressable, StyleSheet, ScrollView, ImageBackground } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useGame } from "../state/GameContext";
import { nightFor, fillNight } from "../data/weeks";
import { DREAMS } from "../data/dreams";
import { SCENE_ART, portraitFor, roleFor } from "../data/art";
import { C } from "../theme";
import { Screen, PrimaryBtn, Portrait, Sheet } from "../components/UI";
import TimerBar from "../components/TimerBar";
import CravingGame from "../components/CravingGame";

function outcomeHint(choice, helper) {
  switch (choice.tag) {
    case "use":
      return helper ? "He slips. Tomorrow is heavier." : "You slip. Tomorrow your hands are heavier.";
    case "refuse":
      return "You refuse. Your hands stay yours.";
    case "leave":
      return "You leave the circle.";
    case "goal":
      return "You protect the dream.";
    case "family":
      return "Family carries this with you.";
    case "ask":
      return "You ask for help. The chain loosens.";
    case "social":
      return "You do not face it alone.";
    default:
      return helper ? "You stand with him." : "You choose for yourself.";
  }
}

export default function NightScreen() {
  const { state, dispatch } = useGame();
  const night = nightFor(state.week, state.flags);
  const [picked, setPicked] = useState(null);
  const [wave, setWave] = useState(false);
  const photo = portraitFor(night.speaker, state.player);
  const role = roleFor(night.speaker);
  const art = SCENE_ART[night.scene] || SCENE_ART.festival;
  const text = fillNight(night.text, state.player, DREAMS);
  const helper = state.flags.path === "helper";
  const insets = useSafeAreaInsets();

  function choose(choice) {
    if (picked) return;
    setPicked(choice);
  }

  function expire() {
    if (picked) return;
    const pressured = night.choices.find((c) => c.pressured) || night.choices[0];
    setPicked(pressured);
  }

  function finishNight(cravingEffects) {
    dispatch({ type: "NIGHT_DONE", choice: picked, cravingEffects });
  }

  if (picked && wave) {
    return (
      <Screen scroll style={{ padding: 16, paddingTop: insets.top + 12 }}>
        <Sheet>
          <Portrait source={photo} name={night.speaker} role={role} size={120} />
          <Text style={[s.kicker, { marginTop: 16 }]}>
            {night.framing === "friend" ? "HOLD THE LINE" : "THE WAVE COMES"}
          </Text>
          <CravingGame
            config={{ framing: night.framing || (helper ? "friend" : "self"), rounds: 3 }}
            onDone={(effects) => finishNight(effects)}
          />
        </Sheet>
      </Screen>
    );
  }

  if (picked) {
    return (
      <Screen scroll style={{ padding: 20, paddingTop: insets.top + 16 }}>
        <Sheet>
          <Portrait source={photo} name={night.speaker} role={role} size={168} />
          <Text style={[s.kicker, { marginTop: 18 }]}>
            {picked.tag === "use" ? "THE COST SHOWS UP IN YOUR HANDS" : "YOUR HANDS STAY YOURS"}
          </Text>
          <Text style={s.result}>{fillNight(picked.result, state.player, DREAMS)}</Text>
          {picked.impair ? (
            <Text style={s.warn}>
              Training will be slower for {picked.impair} days. That is the cost, not a lecture.
            </Text>
          ) : (
            <Text style={s.good}>Tomorrow the gold window stays wide.</Text>
          )}
          <View style={{ height: 20 }} />
          <PrimaryBtn
            label={night.craving ? "The wave is coming" : "Back to the week"}
            onPress={() => {
              if (night.craving) setWave(true);
              else finishNight();
            }}
          />
        </Sheet>
      </Screen>
    );
  }

  return (
    <Screen full>
      <ImageBackground source={art} style={{ flex: 1 }} imageStyle={{ opacity: 0.55 }}>
        <LinearGradient colors={["rgba(14,26,18,0.2)", "rgba(14,26,18,0.94)"]} style={{ flex: 1 }}>
          <ScrollView
            contentContainerStyle={{
              flexGrow: 1,
              paddingTop: insets.top + 16,
              paddingBottom: insets.bottom + 16,
              paddingHorizontal: 16,
            }}
          >
            <Sheet>
              <Text style={s.kicker}>
                NIGHT {state.week} · {helper ? "YOU ARE WATCHING FOR HIM" : "THEY ARE WATCHING"}
              </Text>
              <View style={s.who}>
                <Portrait source={photo} name={night.speaker} role={role} size={168} />
              </View>
              <View style={s.dialogue}>
                <Text style={s.body}>{text}</Text>
              </View>
              {night.timed ? <TimerBar seconds={night.timed} onExpire={expire} /> : null}
              {night.choices.map((c) => (
                <Pressable
                  key={c.id}
                  onPress={() => choose(c)}
                  style={[s.choice, c.tag === "use" && s.choiceBad]}
                >
                  <Text style={s.choiceT}>{c.text}</Text>
                  <Text style={s.choiceS}>{outcomeHint(c, helper)}</Text>
                </Pressable>
              ))}
            </Sheet>
          </ScrollView>
        </LinearGradient>
      </ImageBackground>
    </Screen>
  );
}

const s = StyleSheet.create({
  kicker: { color: C.gold, fontWeight: "800", letterSpacing: 1.2, fontSize: 12, marginBottom: 8 },
  who: { alignItems: "center", marginBottom: 14, marginTop: 4 },
  dialogue: {
    backgroundColor: "rgba(8,16,10,0.92)",
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  body: { color: C.ink, fontSize: 18, lineHeight: 28, fontWeight: "500" },
  choice: {
    backgroundColor: "rgba(14,26,18,0.94)",
    borderRadius: 16,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: C.line,
  },
  choiceBad: { borderColor: "rgba(228,87,46,0.7)" },
  choiceT: { color: C.ink, fontWeight: "800", fontSize: 16, lineHeight: 22 },
  choiceS: { color: C.gold, fontSize: 13, marginTop: 6, fontWeight: "700" },
  result: { color: C.ink, fontSize: 18, lineHeight: 28, fontWeight: "500", marginTop: 8 },
  warn: { color: C.red, marginTop: 16, fontWeight: "700", lineHeight: 22, fontSize: 15 },
  good: { color: C.green, marginTop: 16, fontWeight: "700", fontSize: 15 },
});
