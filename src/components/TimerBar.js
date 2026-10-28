import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, Animated, Easing } from "react-native";
import { C } from "../theme";

// Countdown pressure bar for timed choices.
export default function TimerBar({ seconds, onExpire }) {
  const anim = useRef(new Animated.Value(1)).current;
  const fired = useRef(false);

  useEffect(() => {
    const a = Animated.timing(anim, {
      toValue: 0,
      duration: seconds * 1000,
      easing: Easing.linear,
      useNativeDriver: false,
    });
    a.start(({ finished }) => {
      if (finished && !fired.current) {
        fired.current = true;
        if (onExpire) onExpire();
      }
    });
    return () => a.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const width = anim.interpolate({ inputRange: [0, 1], outputRange: ["0%", "100%"] });
  const color = anim.interpolate({
    inputRange: [0, 0.35, 1],
    outputRange: [C.redDeep, C.red, C.gold],
  });

  return (
    <View style={s.wrap}>
      <Text style={s.label}>⏳ The moment is closing — decide!</Text>
      <View style={s.bg}>
        <Animated.View style={[s.fill, { width, backgroundColor: color }]} />
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  wrap: { marginBottom: 10 },
  label: {
    color: C.red,
    fontSize: 12,
    fontWeight: "800",
    marginBottom: 6,
    letterSpacing: 0.4,
  },
  bg: {
    height: 10,
    borderRadius: 5,
    backgroundColor: "rgba(255,255,255,0.12)",
    overflow: "hidden",
  },
  fill: { height: 10, borderRadius: 5 },
});
