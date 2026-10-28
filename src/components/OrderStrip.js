import React from "react";
import { View, Text, Pressable, StyleSheet, ScrollView } from "react-native";
import { getItemView } from "../data/items";
import { countNeed } from "../merge/engine";
import { C } from "../theme";

export default function OrderStrip({ orders, board, dream, onFulfill }) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.row}>
      {(orders || []).map((order) => {
        const ready = countNeed(board, order.need);
        const temptation = order.tag === "temptation";
        return (
          <Pressable
            key={order.id}
            onPress={() => ready && onFulfill(order.id)}
            style={[
              s.card,
              ready && { borderColor: C.gold, backgroundColor: C.cardAlt },
              temptation && { borderColor: "rgba(228,87,46,0.7)" },
            ]}
          >
            <Text style={[s.from, temptation && { color: C.red }]}>{order.from}</Text>
            <Text style={s.text} numberOfLines={3}>
              {order.text}
            </Text>
            <View style={s.needRow}>
              {(order.need || []).map((n, i) => {
                const v = getItemView(n.chain, n.level, dream);
                return (
                  <Text key={i} style={s.need}>
                    {v.emoji}×{n.qty}
                  </Text>
                );
              })}
            </View>
            <Text style={[s.pay, ready && { color: C.gold }]}>
              {ready ? "Deliver ▸ " : ""}+{order.reward.coins} coins
              {temptation ? "  ⚠️" : ""}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const s = StyleSheet.create({
  row: { paddingHorizontal: 12, gap: 10 },
  card: {
    width: 210,
    backgroundColor: C.card,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: C.line,
    padding: 12,
  },
  from: { color: C.gold, fontWeight: "900", fontSize: 11, letterSpacing: 0.6, marginBottom: 4 },
  text: { color: C.ink, fontSize: 12.5, lineHeight: 18, minHeight: 54 },
  needRow: { flexDirection: "row", gap: 8, marginTop: 8 },
  need: { color: C.ink, fontWeight: "800", fontSize: 13 },
  pay: { color: C.inkDim, fontWeight: "800", fontSize: 11, marginTop: 8 },
});
