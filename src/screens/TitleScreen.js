import React from "react";
import { View, Text, StyleSheet, ImageBackground } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useGame } from "../state/GameContext";
import { C } from "../theme";
import { TITLE_HERO } from "../data/art";
import { Screen, PrimaryBtn, GhostBtn, TextLink, Sheet } from "../components/UI";

export default function TitleScreen() {
  const { dispatch, hasSave, loadSave } = useGame();
  const insets = useSafeAreaInsets();

  return (
    <Screen full>
      <ImageBackground source={TITLE_HERO} style={{ flex: 1 }} resizeMode="cover">
        <LinearGradient
          colors={["rgba(14,26,18,0.25)", "rgba(14,26,18,0.72)", "rgba(14,26,18,0.94)"]}
          style={{
            flex: 1,
            justifyContent: "flex-end",
            paddingTop: insets.top + 24,
            paddingBottom: insets.bottom + 20,
            paddingHorizontal: 24,
          }}
        >
          <Sheet>
            <Text style={s.kicker}>IMO STATE · UMUOMA</Text>
            <Text style={s.title}>Breaking{"\n"}the Chain</Text>
            <Text style={s.subtitle}>Ịgbaji Agbụ</Text>
            <Text style={s.tagline}>
              A long road. It starts slow, then climbs to fastest. Dodge the Chain. Keep your hands.
            </Text>

            <View style={s.buttons}>
              {hasSave ? (
                <PrimaryBtn label="Continue" onPress={loadSave} />
              ) : (
                <PrimaryBtn label="Begin" onPress={() => dispatch({ type: "NEW_GAME" })} />
              )}
              {hasSave ? (
                <View style={{ marginTop: 10 }}>
                  <GhostBtn label="New journey" onPress={() => dispatch({ type: "NEW_GAME" })} />
                </View>
              ) : null}
              <View style={s.help}>
                <TextLink
                  label="Facts and help"
                  onPress={() => dispatch({ type: "NAV", screen: "about", remember: true })}
                />
              </View>
            </View>

            <Text style={s.credit}>Imo State Youth Game Contest 2026</Text>
            <Text style={s.creditDim}>Keep your hands. Onye aghana nwanne ya.</Text>
          </Sheet>
        </LinearGradient>
      </ImageBackground>
    </Screen>
  );
}

const s = StyleSheet.create({
  kicker: { color: C.gold, fontWeight: "800", letterSpacing: 1.6, fontSize: 12, marginBottom: 10 },
  title: {
    color: C.ink,
    fontSize: 46,
    fontWeight: "900",
    letterSpacing: -0.5,
    lineHeight: 50,
  },
  subtitle: {
    color: C.gold,
    fontSize: 18,
    fontWeight: "700",
    marginTop: 8,
  },
  tagline: {
    color: C.inkDim,
    fontSize: 15,
    lineHeight: 22,
    marginTop: 14,
  },
  buttons: { marginTop: 28 },
  help: { alignItems: "center", marginTop: 16 },
  credit: { color: C.gold, fontSize: 12, fontWeight: "800", marginTop: 28, textAlign: "center" },
  creditDim: { color: C.inkDim, fontSize: 12, marginTop: 4, textAlign: "center" },
});
