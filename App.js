import React from "react";
import { View, Text } from "react-native";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { GameProvider, useGame } from "./src/state/GameContext";
import { C } from "./src/theme";
import TitleScreen from "./src/screens/TitleScreen";
import SetupScreen from "./src/screens/SetupScreen";
import HubScreen from "./src/screens/HubScreen";
import RunScreen from "./src/screens/RunScreen";
import NightScreen from "./src/screens/NightScreen";
import JournalScreen from "./src/screens/JournalScreen";
import AboutScreen from "./src/screens/AboutScreen";
import EndingScreen from "./src/screens/EndingScreen";

function Router() {
  const { state } = useGame();
  if (!state.booted) {
    return (
      <View style={{ flex: 1, backgroundColor: C.bgDeep, alignItems: "center", justifyContent: "center" }}>
        <Text style={{ fontSize: 40 }}>✊</Text>
        <Text style={{ color: C.inkDim, marginTop: 10, fontWeight: "700" }}>Jide aka gị...</Text>
      </View>
    );
  }
  switch (state.screen) {
    case "title":
      return <TitleScreen />;
    case "setup":
      return <SetupScreen />;
    case "hub":
      return <HubScreen />;
    case "train":
    case "run":
      return <RunScreen />;
    case "night":
      return <NightScreen />;
    case "journal":
      return <JournalScreen />;
    case "about":
      return <AboutScreen />;
    case "ending":
      return <EndingScreen />;
    default:
      return <TitleScreen />;
  }
}

export default function App() {
  return (
    <SafeAreaProvider>
      <GameProvider>
        <StatusBar style="light" translucent backgroundColor="transparent" />
        <Router />
      </GameProvider>
    </SafeAreaProvider>
  );
}
