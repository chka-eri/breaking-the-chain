import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useGame } from "../state/GameContext";
import { DREAMS } from "../data/dreams";
import { HELPLINE } from "../data/facts";
import { portraitFor } from "../data/art";
import { C } from "../theme";
import StatsHud from "../components/StatsHud";
import { Screen, Card, PrimaryBtn, Sheet, Portrait, TextLink } from "../components/UI";

function grade(stats) {
  const score = stats.hope + stats.health + stats.family + (stats.skill || 0) + (100 - stats.chain);
  if (score >= 300)
    return {
      icon: "🦅",
      name: "UGO",
      title: "The Eagle Feather",
      text: "The highest honour in the land. You walked through fire and came out carrying light for others.",
    };
  if (score >= 240)
    return {
      icon: "🛡️",
      name: "ODOGWU",
      title: "The Champion",
      text: "You took wounds, and you took the lessons with them. Umuoma calls you Odogwu — one who stood.",
    };
  return {
    icon: "✊",
    name: "DIKE",
    title: "The Warrior",
    text: "The road was heavy and the chain was strong — but you are HERE, standing. That is what warriors are.",
  };
}

export default function EndingScreen() {
  const { state, dispatch } = useGame();
  const g = grade(state.stats);
  const dream = DREAMS[state.player.dream] || DREAMS.footballer;
  const helper = state.flags.path === "helper";

  const you = portraitFor("You", state.player);

  return (
    <Screen scroll style={{ padding: 16 }}>
      <Sheet>
      <LinearGradient colors={["#2A1F04", "#4A3805"]} style={ss.gradeCard}>
        <Portrait source={you} name={state.player.name} role={dream.label} size={148} />
        <Text style={ss.gradeIcon}>{g.icon}</Text>
        <Text style={ss.gradeName}>{g.name}</Text>
        <Text style={ss.gradeTitle}>{g.title}</Text>
        <Text style={ss.gradeText}>{g.text}</Text>
      </LinearGradient>

      <Card style={{ marginTop: 14 }}>
        <Text style={ss.storyKicker}>ONE YEAR LATER • IRI JI FESTIVAL</Text>
        <Text style={ss.storyText}>
          {helper
            ? "The square roars for two names: yours and Nnamdi's. 'Ndị Nchekwa Ndụ' — Guardians of Life — now meets every Saturday, and the bench behind the timber market sits empty in the sun. "
            : "You finish your speech to a square gone quiet, then loud — market women, elders, the boys from Base, Mama and Papa, Ngozi. Your story has become a door for other people to walk out through. "}
          {dream.win}
        </Text>
        <Text style={[ss.storyText, { marginTop: 10, color: C.gold, fontWeight: "800" }]}>
          "Onye kwe, chi ya ekwe." — When a person says yes, their chi says yes with them.
        </Text>
      </Card>

      <View style={{ marginTop: 14 }}>
        <StatsHud stats={state.stats} />
      </View>

      <Card style={{ marginTop: 14, borderColor: C.green }}>
        <Text style={ss.helpTitle}>For someone real, somewhere near you:</Text>
        <Text style={ss.helpNumber}>NDLEA 24/7 Helpline • {HELPLINE.number}</Text>
        <Text style={ss.helpText}>
          Free and confidential — English, Pidgin, Igbo, Hausa, Yoruba. Recovery is real. Chains
          break. Onye aghana nwanne ya.
        </Text>
      </Card>

      <View style={{ marginTop: 16 }}>
        <PrimaryBtn label="Walk a different road" onPress={() => dispatch({ type: "NEW_GAME" })} />
        <View style={ss.helpLink}>
          <TextLink
            label="Facts and helpline"
            onPress={() => dispatch({ type: "NAV", screen: "about", remember: true })}
          />
        </View>
      </View>
      <Text style={ss.replayNote}>
        {helper
          ? "You walked the Helper's road. A new game can walk the Struggler's road."
          : "You walked the Struggler's road. Refuse in the first two weeks, and a new game walks the Helper's road."}
      </Text>
      </Sheet>
    </Screen>
  );
}

const ss = StyleSheet.create({
  gradeCard: {
    borderRadius: 20,
    padding: 22,
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: C.gold,
  },
  gradeIcon: { fontSize: 52, marginBottom: 6 },
  gradeName: { color: C.gold, fontSize: 34, fontWeight: "900", letterSpacing: 4 },
  gradeTitle: { color: C.ink, fontSize: 15, fontWeight: "700", marginBottom: 12 },
  gradeText: { color: C.ink, textAlign: "center", fontSize: 13.5, lineHeight: 20, marginTop: 12 },
  storyKicker: { color: C.inkDim, fontSize: 10.5, fontWeight: "800", letterSpacing: 2, marginBottom: 8 },
  storyText: { color: C.ink, fontSize: 14.5, lineHeight: 22 },
  helpTitle: { color: C.inkDim, fontSize: 12, fontWeight: "700", marginBottom: 6 },
  helpNumber: { color: C.green, fontSize: 17, fontWeight: "900", marginBottom: 6 },
  helpText: { color: C.ink, fontSize: 14, lineHeight: 20 },
  helpLink: { alignItems: "center", marginTop: 14 },
  replayNote: {
    color: C.inkDim,
    fontSize: 12,
    lineHeight: 18,
    textAlign: "center",
    marginTop: 14,
    fontStyle: "italic",
  },
});
