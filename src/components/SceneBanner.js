import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { getScene } from "../data/scenes";
import { SCENE_ART } from "../data/art";
import { C } from "../theme";
import { PatternBand } from "./UI";

export default function SceneBanner({ sceneKey }) {
  const scene = getScene(sceneKey);
  const art = SCENE_ART[sceneKey];
  return (
    <View style={s.wrap}>
      {art ? (
        <View style={s.artBox}>
          <Image source={art} style={s.art} />
          <LinearGradient
            colors={["transparent", "rgba(8,16,10,0.88)"]}
            style={s.artFade}
          />
          <Text style={s.artLabel}>{scene.label}</Text>
        </View>
      ) : (
        <LinearGradient
          colors={scene.colors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={s.grad}
        >
          <Text style={s.emojis}>{scene.emojis}</Text>
          <Text style={s.label}>{scene.label}</Text>
        </LinearGradient>
      )}
      <PatternBand height={10} />
    </View>
  );
}

const s = StyleSheet.create({
  wrap: {
    borderRadius: 18,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: C.line,
    backgroundColor: C.card,
  },
  artBox: { height: 140, justifyContent: "flex-end" },
  art: { ...StyleSheet.absoluteFillObject, width: "100%", height: 140 },
  artFade: { ...StyleSheet.absoluteFillObject },
  artLabel: {
    color: "rgba(255,255,255,0.95)",
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 1.1,
    textTransform: "uppercase",
    paddingHorizontal: 12,
    paddingBottom: 10,
  },
  grad: {
    paddingVertical: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  emojis: { fontSize: 34, letterSpacing: 4, marginBottom: 8 },
  label: {
    color: "rgba(255,255,255,0.92)",
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1.2,
    textTransform: "uppercase",
  },
});
