import React, { useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  useWindowDimensions,
  Image,
  ImageBackground,
  PanResponder,
  Pressable,
} from "react-native";
import { COLS, ROWS, canMerge, countNeed, itemFitsOrder } from "../merge/engine";
import { getItemView } from "../data/items";
import { ITEM_ART, SCENE_ART, portraitForName } from "../data/art";
import { C } from "../theme";

const GAP = 2;

function Token({ item, dream, size, dim, glow, lockedPulse }) {
  if (!item) return null;
  const view = getItemView(item.chain, item.level, dream);
  const art = ITEM_ART[item.chain] && item.level <= 2 ? ITEM_ART[item.chain] : null;
  const d = Math.max(28, size * 0.88);
  return (
    <View
      style={[
        s.token,
        {
          width: d,
          height: d,
          borderRadius: d / 2,
          backgroundColor: view.bg,
        },
        glow && { shadowColor: C.gold, shadowOpacity: 0.9, shadowRadius: 10, elevation: 8 },
        dim && { opacity: 0.22 },
      ]}
    >
      {art ? (
        <Image source={art} style={{ width: d - 6, height: d - 6, borderRadius: (d - 6) / 2 }} />
      ) : (
        <Text style={{ fontSize: d * 0.42 }}>{view.emoji}</Text>
      )}
      <View style={[s.lvl, { backgroundColor: view.color }]}>
        <Text style={s.lvlTxt}>{item.level}</Text>
      </View>
      {item.locked || lockedPulse ? (
        <View style={s.lock}>
          <Text style={{ fontSize: d * 0.34 }}>⛓️</Text>
        </View>
      ) : null}
    </View>
  );
}

export default function MergeBoard({
  board,
  dream,
  player,
  orders,
  selected,
  onSelect,
  onMerge,
  onMove,
  onFulfill,
  onTrash,
}) {
  const { width } = useWindowDimensions();
  const pad = 12;
  const cell = Math.floor((Math.min(width, 440) - pad * 2 - GAP * (COLS - 1)) / COLS);
  const gridW = cell * COLS + GAP * (COLS - 1);
  const gridH = cell * ROWS + GAP * (ROWS - 1);

  const boardRef = useRef(board);
  boardRef.current = board;
  const ordersRef = useRef(orders);
  ordersRef.current = orders;
  const cellRef = useRef(cell);
  cellRef.current = cell;
  const gridBox = useRef(null);
  const gridRef = useRef(null);
  const seatBoxes = useRef({});
  const seatRefs = useRef({});
  const dragRef = useRef(null);
  const [drag, setDrag] = useState(null);

  function measureAll() {
    if (gridRef.current && gridRef.current.measureInWindow) {
      gridRef.current.measureInWindow((x, y, w, h) => {
        gridBox.current = { x, y, w, h };
      });
    }
    Object.keys(seatRefs.current).forEach((id) => {
      const node = seatRefs.current[id];
      if (node && node.measureInWindow) {
        node.measureInWindow((x, y, w, h) => {
          seatBoxes.current[id] = { x, y, w, h };
        });
      }
    });
  }

  function cellFromPage(pageX, pageY) {
    const box = gridBox.current;
    if (!box) return -1;
    const lx = pageX - box.x;
    const ly = pageY - box.y;
    const stride = cellRef.current + GAP;
    const col = Math.floor(lx / stride);
    const row = Math.floor(ly / stride);
    if (col < 0 || col >= COLS || row < 0 || row >= ROWS) return -1;
    return row * COLS + col;
  }

  function seatFromPage(pageX, pageY) {
    const seats = seatBoxes.current;
    for (const id of Object.keys(seats)) {
      const b = seats[id];
      if (!b) continue;
      if (pageX >= b.x && pageX <= b.x + b.w && pageY >= b.y && pageY <= b.y + b.h) return id;
    }
    return null;
  }

  const pan = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: (e) => {
          const i = cellFromPage(e.nativeEvent.pageX, e.nativeEvent.pageY);
          const item = i >= 0 ? boardRef.current[i] : null;
          return !!(item && !item.locked);
        },
        onMoveShouldSetPanResponder: () => true,
        onPanResponderTerminationRequest: () => false,
        onShouldBlockNativeResponder: () => true,
        onPanResponderGrant: (e) => {
          measureAll();
          const { pageX, pageY } = e.nativeEvent;
          const i = cellFromPage(pageX, pageY);
          const item = i >= 0 ? boardRef.current[i] : null;
          if (!item || item.locked) return;
          dragRef.current = { from: i, x: pageX, y: pageY, moved: false, seat: null };
          setDrag({ ...dragRef.current });
        },
        onPanResponderMove: (e, g) => {
          if (!dragRef.current) return;
          if (Math.abs(g.dx) + Math.abs(g.dy) > 8) dragRef.current.moved = true;
          const { pageX, pageY } = e.nativeEvent;
          dragRef.current.x = pageX;
          dragRef.current.y = pageY;
          dragRef.current.hover = cellFromPage(pageX, pageY);
          dragRef.current.seat = seatFromPage(pageX, pageY);
          setDrag({ ...dragRef.current });
        },
        onPanResponderRelease: () => {
          const d = dragRef.current;
          dragRef.current = null;
          setDrag(null);
          if (!d) return;
          const b = boardRef.current;
          const item = b[d.from];
          if (!item) return;

          if (d.moved && d.seat) {
            const order = (ordersRef.current || []).find((o) => o.id === d.seat);
            if (order && itemFitsOrder(item, order) && countNeed(b, order.need)) {
              onFulfill(order.id);
              return;
            }
          }

          const hover = d.hover;
          if (d.moved && hover >= 0 && hover !== d.from) {
            if (canMerge(item, b[hover])) {
              onMerge(d.from, hover);
              return;
            }
            if (!b[hover]) {
              onMove(d.from, hover);
              return;
            }
          }

          if (!d.moved) {
            if (selected != null && selected !== d.from && canMerge(b[selected], item)) {
              onMerge(selected, d.from);
            } else {
              onSelect(d.from === selected ? null : d.from);
            }
          }
        },
        onPanResponderTerminate: () => {
          dragRef.current = null;
          setDrag(null);
        },
      }),
    [selected, onMerge, onMove, onFulfill, onSelect]
  );

  const hoverMerge =
    drag &&
    drag.hover >= 0 &&
    drag.hover !== drag.from &&
    canMerge(board[drag.from], board[drag.hover]);

  const ghostPos = (() => {
    const box = gridBox.current;
    if (!drag || !box) return { left: 0, top: 0 };
    return { left: drag.x - box.x - cell / 2, top: drag.y - box.y - cell / 2 };
  })();

  return (
    <View style={s.wrap} {...pan.panHandlers} onLayout={measureAll}>
      <View style={s.seats}>
        {(orders || []).slice(0, 2).map((order) => {
          const ready = countNeed(board, order.need);
          const temptation = order.tag === "temptation";
          const photo = portraitForName(order.from, player);
          const hovering = drag && drag.seat === order.id;
          const canGive = hovering && board[drag.from] && itemFitsOrder(board[drag.from], order) && ready;
          const need = (order.need || [])[0];
          const needView = need ? getItemView(need.chain, need.level, dream) : null;
          return (
            <Pressable
              key={order.id}
              ref={(n) => {
                seatRefs.current[order.id] = n;
              }}
              onLayout={measureAll}
              collapsable={false}
              onPress={() => ready && onFulfill(order.id)}
              style={[
                s.seat,
                temptation && s.seatBad,
                ready && s.seatReady,
                canGive && s.seatDrop,
              ]}
            >
              <Image source={photo} style={[s.face, temptation && { borderColor: C.red }]} />
              <View style={{ flex: 1 }}>
                <Text style={[s.seatName, temptation && { color: C.red }]} numberOfLines={1}>
                  {order.from}
                </Text>
                <Text style={s.seatAsk} numberOfLines={2}>
                  {order.text}
                </Text>
                <Text style={s.seatNeed}>
                  {needView ? `${needView.emoji} ${needView.name}` : ""}
                  {ready ? "  ·  ready" : ""}
                </Text>
              </View>
            </Pressable>
          );
        })}
      </View>

      <ImageBackground
        source={SCENE_ART.compound}
        style={[s.table, { width: gridW + 16, height: gridH + 16 }]}
        imageStyle={{ borderRadius: 28, opacity: 0.55 }}
        onLayout={() => {}}
      >
        <View
          ref={gridRef}
          collapsable={false}
          style={[s.grid, { width: gridW, height: gridH }]}
          onLayout={measureAll}
        >
          {Array.from({ length: COLS * ROWS }).map((_, i) => {
            const item = board[i];
            const isSource = drag && drag.from === i;
            const isHoverMerge = hoverMerge && drag.hover === i;
            const isHoverMove = drag && drag.hover === i && !item && drag.from !== i;
            const match =
              drag && item && i !== drag.from && canMerge(board[drag.from], item);
            return (
              <View
                key={i}
                style={[
                  s.slot,
                  {
                    width: cell,
                    height: cell,
                    marginRight: i % COLS === COLS - 1 ? 0 : GAP,
                    marginBottom: i >= COLS * (ROWS - 1) ? 0 : GAP,
                  },
                  isHoverMove && s.slotMove,
                ]}
              >
                <Token
                  item={item}
                  dream={dream}
                  size={cell}
                  dim={isSource}
                  glow={!!(match || isHoverMerge || selected === i)}
                />
              </View>
            );
          })}

          {drag && board[drag.from] && gridBox.current ? (
            <View pointerEvents="none" style={[s.ghost, ghostPos]}>
              <Token item={board[drag.from]} dream={dream} size={cell} glow />
            </View>
          ) : null}
        </View>
      </ImageBackground>

      {selected != null && board[selected] && !drag ? (
        <Pressable onPress={() => onTrash(selected)} style={s.clearBtn}>
          <Text style={s.clearTxt}>Return to the earth · 1 coin</Text>
        </Pressable>
      ) : null}

      <Text style={s.hint}>
        {drag && drag.seat
          ? "Release to give it to them"
          : drag && hoverMerge
            ? "Release to merge"
            : drag
              ? "Drop on a twin to merge · empty space to slide"
              : "Drag anywhere on the table. Give gifts to the people above."}
      </Text>
    </View>
  );
}

const s = StyleSheet.create({
  wrap: { alignItems: "center" },
  seats: {
    flexDirection: "row",
    width: "100%",
    paddingHorizontal: 10,
    gap: 8,
    marginBottom: 8,
  },
  seat: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "rgba(20,37,25,0.92)",
    borderRadius: 18,
    padding: 8,
  },
  seatReady: { backgroundColor: "rgba(245,179,1,0.14)" },
  seatBad: { backgroundColor: "rgba(228,87,46,0.12)" },
  seatDrop: { backgroundColor: "rgba(245,179,1,0.28)", transform: [{ scale: 1.03 }] },
  face: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: C.gold,
  },
  seatName: { color: C.gold, fontWeight: "900", fontSize: 12 },
  seatAsk: { color: C.ink, fontSize: 11, lineHeight: 14, marginTop: 2 },
  seatNeed: { color: C.inkDim, fontSize: 10, fontWeight: "700", marginTop: 3 },
  table: {
    borderRadius: 28,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#2A1C0E",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    position: "relative",
  },
  slot: {
    alignItems: "center",
    justifyContent: "center",
  },
  slotMove: {
    backgroundColor: "rgba(245,179,1,0.18)",
    borderRadius: 999,
  },
  token: {
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.35,
    shadowRadius: 4,
    elevation: 3,
  },
  lvl: {
    position: "absolute",
    right: 1,
    bottom: 1,
    minWidth: 14,
    height: 14,
    borderRadius: 7,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 3,
  },
  lvlTxt: { color: "#1A1208", fontSize: 9, fontWeight: "900" },
  lock: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.4)",
    alignItems: "center",
    justifyContent: "center",
  },
  ghost: { position: "absolute", zIndex: 20, elevation: 12 },
  hint: {
    color: C.inkDim,
    fontSize: 11,
    marginTop: 8,
    fontWeight: "600",
    textAlign: "center",
    paddingHorizontal: 16,
  },
  clearBtn: { marginTop: 8, paddingHorizontal: 12, paddingVertical: 6 },
  clearTxt: { color: C.red, fontWeight: "800", fontSize: 12 },
});
