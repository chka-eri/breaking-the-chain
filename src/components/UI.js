import React, { useState } from "react";
import { View, Text, Pressable, StyleSheet, ScrollView, Image } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { C } from "../theme";

export function Screen({ children, scroll, style, full }) {
  const insets = useSafeAreaInsets();
  const padTop = full ? 0 : Math.max(insets.top, 8);
  const padBottom = full ? 0 : Math.max(insets.bottom, 8);
  const inner = scroll ? (
    <ScrollView
      style={{ flex: 1 }}
      contentContainerStyle={[{ paddingBottom: 32 + padBottom }, style]}
      showsVerticalScrollIndicator={false}
    >
      {children}
    </ScrollView>
  ) : (
    <View style={[{ flex: 1, paddingBottom: padBottom }, style]}>{children}</View>
  );
  return (
    <View style={{ flex: 1, backgroundColor: C.bgDeep, paddingTop: padTop }}>
      {inner}
    </View>
  );
}

// Uli-inspired decorative band of diamonds
export function PatternBand({ height = 14 }) {
  const items = new Array(16).fill(0);
  const colors = [C.gold, C.red, C.green, C.purple];
  return (
    <View style={[pb.row, { height }]}>
      {items.map((_, i) => (
        <View
          key={i}
          style={[
            pb.diamond,
            {
              backgroundColor: colors[i % colors.length],
              width: height * 0.55,
              height: height * 0.55,
            },
          ]}
        />
      ))}
    </View>
  );
}

const pb = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
    overflow: "hidden",
    opacity: 0.85,
  },
  diamond: { transform: [{ rotate: "45deg" }], borderRadius: 2 },
});

export function PrimaryBtn({ label, onPress, disabled, small }) {
  return (
    <Pressable onPress={onPress} disabled={disabled} style={({ pressed }) => [{ opacity: disabled ? 0.4 : pressed ? 0.8 : 1 }]}>
      <LinearGradient
        colors={[C.gold, C.goldDeep]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[bs.primary, small && { paddingVertical: 10, paddingHorizontal: 16 }]}
      >
        <Text style={[bs.primaryText, small && { fontSize: 14 }]}>{label}</Text>
      </LinearGradient>
    </Pressable>
  );
}

export function GhostBtn({ label, onPress, small, color }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        bs.ghost,
        small && { paddingVertical: 8, paddingHorizontal: 14 },
        { borderColor: color || C.line, opacity: pressed ? 0.7 : 1 },
      ]}
    >
      <Text style={[bs.ghostText, small && { fontSize: 13 }, color && { color }]}>{label}</Text>
    </Pressable>
  );
}

// Two-tap confirm button (works on web where Alert doesn't)
export function ConfirmBtn({ label, confirmLabel, onConfirm }) {
  const [armed, setArmed] = useState(false);
  return (
    <GhostBtn
      small
      color={armed ? C.red : undefined}
      label={armed ? confirmLabel : label}
      onPress={() => {
        if (armed) {
          setArmed(false);
          onConfirm();
        } else {
          setArmed(true);
          setTimeout(() => setArmed(false), 2500);
        }
      }}
    />
  );
}

export function Card({ children, style }) {
  return <View style={[bs.card, style]}>{children}</View>;
}

export function Sheet({ children, style }) {
  return <View style={[bs.sheet, style]}>{children}</View>;
}

export function Portrait({ source, name, role, size = 132 }) {
  const radius = 22;
  return (
    <View style={bs.portraitWrap}>
      <View style={[bs.portraitFrame, { width: size, height: size, borderRadius: radius }]}>
        {source ? (
          <Image source={source} style={{ width: size, height: size }} resizeMode="cover" />
        ) : (
          <View style={bs.portraitFallback}>
            <Text style={{ fontSize: Math.round(size * 0.36) }}>✊</Text>
          </View>
        )}
      </View>
      {name ? (
        <Text numberOfLines={1} style={bs.portraitName}>
          {name}
        </Text>
      ) : null}
      {role ? (
        <Text numberOfLines={2} style={bs.portraitRole}>
          {role}
        </Text>
      ) : null}
    </View>
  );
}

export function TextLink({ label, onPress, color }) {
  return (
    <Pressable onPress={onPress} hitSlop={10} style={({ pressed }) => ({ opacity: pressed ? 0.55 : 1 })}>
      <Text style={[bs.link, color && { color }]}>{label}</Text>
    </Pressable>
  );
}

const bs = StyleSheet.create({
  primary: {
    paddingVertical: 14,
    paddingHorizontal: 22,
    borderRadius: 22,
    alignItems: "center",
  },
  primaryText: {
    color: "#26200A",
    fontWeight: "800",
    fontSize: 16,
    letterSpacing: 0.5,
  },
  ghost: {
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 22,
    borderWidth: 1.5,
    alignItems: "center",
  },
  ghostText: { color: C.inkDim, fontWeight: "700", fontSize: 15 },
  card: {
    backgroundColor: C.card,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: C.line,
  },
  sheet: { width: "100%", maxWidth: 520, alignSelf: "center" },
  portraitWrap: { alignItems: "center", alignSelf: "center", maxWidth: 280 },
  portraitFrame: {
    overflow: "hidden",
    borderWidth: 3,
    borderColor: C.gold,
    backgroundColor: "#102016",
  },
  portraitFallback: { flex: 1, alignItems: "center", justifyContent: "center" },
  portraitName: {
    color: C.ink,
    fontWeight: "900",
    fontSize: 22,
    marginTop: 10,
    textAlign: "center",
  },
  portraitRole: {
    color: C.gold,
    fontWeight: "700",
    fontSize: 14,
    marginTop: 2,
    textAlign: "center",
    lineHeight: 18,
  },
  link: { color: C.inkDim, fontWeight: "700", fontSize: 14 },
});
