import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Image,
  ImageBackground,
  PanResponder,
  useWindowDimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useGame } from "../state/GameContext";
import { DREAMS } from "../data/dreams";
import { WEEKS } from "../data/weeks";
import { SCENE_ART, ITEM_ART, RUN_ART, portraitFor } from "../data/art";
import { C } from "../theme";
import { Screen } from "../components/UI";

const RUN_MS = 90000;
const HIT_X = 0.11;

// The road is a song: a long slow opening, then a gradual climb.
// Smoothstep between these marks so nothing snaps from slow to fast.
const BANDS = [
  { p: 0, speed: 0.0044, every: 1.35, drug: 0, name: "Slow", id: "slow" },
  { p: 0.28, speed: 0.0058, every: 1.1, drug: 0.1, name: "Slow", id: "slow" },
  { p: 0.46, speed: 0.0086, every: 0.84, drug: 0.18, name: "Quickening", id: "quick" },
  { p: 0.66, speed: 0.0122, every: 0.64, drug: 0.26, name: "Fast", id: "fast" },
  { p: 0.84, speed: 0.0162, every: 0.52, drug: 0.32, name: "Fastest", id: "fever" },
  { p: 1, speed: 0.0188, every: 0.48, drug: 0.36, name: "Fastest", id: "fever" },
];

function smoothstep(t) {
  const x = Math.max(0, Math.min(1, t));
  return x * x * (3 - 2 * x);
}

function sampleTempo(p) {
  const x = Math.max(0, Math.min(1, p));
  let i = 0;
  while (i < BANDS.length - 2 && x > BANDS[i + 1].p) i += 1;
  const a = BANDS[i];
  const b = BANDS[i + 1];
  const u = smoothstep((x - a.p) / Math.max(0.0001, b.p - a.p));
  const lerp = (from, to) => from + (to - from) * u;
  const next = u >= 0.55;
  return {
    speed: lerp(a.speed, b.speed),
    every: lerp(a.every, b.every),
    drug: lerp(a.drug, b.drug),
    name: next ? b.name : a.name,
    id: next ? b.id : a.id,
  };
}

function openLane(existing, avoidX) {
  for (let n = 0; n < 8; n += 1) {
    const x = 0.14 + Math.random() * 0.72;
    const crowded = existing.some((it) => Math.abs(it.x - x) < 0.22 && it.y < 0.5);
    const onAvoid = avoidX != null && Math.abs(x - avoidX) < 0.24;
    if (!crowded && !onAvoid) return x;
  }
  return 0.18 + Math.random() * 0.64;
}

const DRUGS = [
  { key: "cup", art: RUN_ART.cup, label: "the cup", kind: "drug", dmg: 1 },
  { key: "bottle", art: RUN_ART.bottle, label: "the mix", kind: "drug", dmg: 1 },
  { key: "crystal", art: RUN_ART.crystal, label: "mkpụrụ", kind: "drug", dmg: 2 },
  { key: "chain", art: RUN_ART.chain, label: "the Chain", kind: "drug", dmg: 1 },
];

const HERBS = [
  { key: "herb", art: RUN_ART.herb, label: "herb", kind: "herb", pts: 16 },
  { key: "kola", art: ITEM_ART.kola, label: "ọjị", kind: "herb", pts: 12 },
];

const GIFTS = [
  { key: "yam", art: ITEM_ART.yam, label: "yam", kind: "gift", pts: 10 },
  { key: "craft", art: ITEM_ART.craft, label: "craft", kind: "gift", pts: 12 },
];

const PRAYER = { key: "prayer", art: RUN_ART.prayer, label: "prayer", kind: "prayer", pts: 32 };

function clamp01(n) {
  return Math.max(0.08, Math.min(0.92, n));
}

function pick(list) {
  return list[Math.floor(Math.random() * list.length)];
}

function drugsForWeek(week) {
  if (week <= 1) return [DRUGS[0]];
  if (week === 2) return [DRUGS[0], DRUGS[1]];
  if (week === 3) return [DRUGS[0], DRUGS[1], DRUGS[3]];
  return DRUGS;
}

export default function RunScreen() {
  const { state, dispatch } = useGame();
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const roadW = width;
  const roadH = height;
  const token = Math.round(Math.max(64, Math.min(84, width * 0.2)));
  const playerW = 120;
  const playerH = 120;
  const playerBottom = Math.max(insets.bottom, 12) + 4;
  const dream = DREAMS[state.player.dream] || DREAMS.footballer;
  const week = WEEKS[(state.week || 1) - 1] || WEEKS[0];
  const you = portraitFor("You", state.player);
  const impair = state.impair || 0;
  const chain = state.stats.chain || 0;
  const weekDrugs = drugsForWeek(week.n);

  const [px, setPx] = useState(0.5);
  const [items, setItems] = useState([]);
  const [score, setScore] = useState(0);
  const [hearts, setHearts] = useState(5);
  const [cups, setCups] = useState(0);
  const [caught, setCaught] = useState(0);
  const [prayers, setPrayers] = useState(0);
  const [combo, setCombo] = useState(0);
  const [shield, setShield] = useState(false);
  const [pop, setPop] = useState(null);
  const [over, setOver] = useState(null);
  const [leftMs, setLeftMs] = useState(RUN_MS);
  const [hint, setHint] = useState(true);
  const [banner, setBanner] = useState(null);

  const playerX = useRef(0.5);
  const itemsRef = useRef([]);
  const invuln = useRef(0);
  const shieldLeft = useRef(0);
  const uid = useRef(1);
  const overRef = useRef(false);
  const spawnAcc = useRef(0);
  const easeLeft = useRef(0);
  const phaseRef = useRef({ id: "slow", name: "Slow" });
  const started = useRef(Date.now());
  const statsRef = useRef({
    score: 0,
    hearts: 5,
    cups: 0,
    caught: 0,
    prayers: 0,
    combo: 0,
    bestCombo: 0,
    dodges: 0,
  });
  const roadLayout = useRef({ x: 0, w: 1 });
  const roadRef = useRef(null);
  const sizeRef = useRef({ w: width, h: height, pb: playerBottom, ps: playerH, hitX: HIT_X });
  sizeRef.current = {
    w: width,
    h: height,
    pb: playerBottom,
    ps: playerH,
    hitX: Math.min(0.2, Math.max(HIT_X, (playerW * 0.45) / Math.max(width, 1))),
  };

  function setX(nx) {
    const v = clamp01(nx);
    playerX.current = v;
    setPx(v);
  }

  const pan = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => !overRef.current,
      onMoveShouldSetPanResponder: () => !overRef.current,
      onPanResponderGrant: (evt, g) => {
        const w = roadLayout.current.w || 1;
        if (typeof evt.nativeEvent.locationX === "number") setX(evt.nativeEvent.locationX / w);
        else setX((g.x0 - (roadLayout.current.x || 0)) / w);
      },
      onPanResponderMove: (evt, g) => {
        const w = roadLayout.current.w || 1;
        setX((g.moveX - (roadLayout.current.x || 0)) / w);
      },
    })
  ).current;

  function finish() {
    if (overRef.current) return;
    overRef.current = true;
    const s = statsRef.current;
    setOver({
      score: s.score,
      caught: s.caught,
      cups: s.cups,
      prayers: s.prayers,
      hearts: s.hearts,
      combo: s.bestCombo,
      dodges: s.dodges,
      clean: s.cups === 0,
      phaseName: phaseRef.current.name,
    });
  }

  function bump(text, color) {
    setPop({ t: text, c: color });
  }

  function makeSpec(drugChance) {
    const roll = Math.random();
    if (roll < drugChance) return pick(weekDrugs);
    if (roll < drugChance + 0.12) return PRAYER;
    if (roll < drugChance + 0.42) return pick(HERBS);
    return { ...pick(GIFTS), emoji: specDream(dream) };
  }

  function makeItem(spec, x) {
    let lane = x;
    if (spec.kind === "drug" && Math.abs(lane - playerX.current) < 0.1) {
      lane = clamp01(lane + (playerX.current < 0.5 ? 0.28 : -0.28));
    }
    return { id: uid.current++, x: lane, y: -0.12, ...spec };
  }

  useEffect(() => {
    const hide = setTimeout(() => setHint(false), 4500);
    let bannerTimer = null;
    itemsRef.current = [{ id: uid.current++, x: 0.36, y: 0.02, ...GIFTS[0] }];
    const tick = setInterval(() => {
      if (overRef.current) return;
      const elapsed = Date.now() - started.current;
      const p = Math.min(1, elapsed / RUN_MS);
      const curve = sampleTempo(p);
      const climb = Math.max(0, (p - 0.18) / 0.82);
      const weekPush = 1 + (week.n - 1) * 0.07 * climb;
      const fogPush = 1 + impair * 0.08 * climb;
      easeLeft.current = Math.max(0, easeLeft.current - 32);
      const speed = curve.speed * weekPush * fogPush * (easeLeft.current > 0 ? 0.62 : 1);
      const spawnEvery = Math.max(0.48, curve.every - (week.n - 1) * 0.015 * climb);
      const drugChance =
        p < 0.12
          ? 0
          : Math.min(0.38, curve.drug + (week.n - 1) * 0.02 * climb + impair * 0.035 * climb + chain / 900);

      if (curve.id !== phaseRef.current.id) {
        phaseRef.current = { id: curve.id, name: curve.name };
        if (curve.id !== "slow") {
          setBanner(curve.name);
          if (bannerTimer) clearTimeout(bannerTimer);
          bannerTimer = setTimeout(() => setBanner(null), 1600);
        }
      }

      invuln.current = Math.max(0, invuln.current - 32);
      shieldLeft.current = Math.max(0, shieldLeft.current - 32);
      setShield(shieldLeft.current > 0 || easeLeft.current > 0);

      spawnAcc.current += 0.032;
      if (spawnAcc.current >= spawnEvery) {
        spawnAcc.current = 0;
        const next = makeItem(makeSpec(drugChance), openLane(itemsRef.current));
        itemsRef.current = [...itemsRef.current, next];
        if (Math.random() < 0.22 && p > 0.5) {
          const pairSpec = makeSpec(drugChance * 0.45);
          const safe = pairSpec.kind === "drug" && next.kind === "drug" ? pick(HERBS) : pairSpec;
          const pair = makeItem(safe, openLane(itemsRef.current, next.x));
          itemsRef.current.push(pair);
        }
      }

      const { h, pb, ps, hitX } = sizeRef.current;
      const centerY = 1 - (pb + ps / 2) / Math.max(h, 1);
      const hitY0 = centerY - 0.08;
      const hitY1 = centerY + 0.08;
      const hits = [];
      const rest = [];
      itemsRef.current.forEach((it) => {
        const ny = it.y + speed;
        const moved = { ...it, y: ny };
        const reach = it.kind === "drug" ? hitX || HIT_X : (hitX || HIT_X) + 0.03;
        if (ny > hitY0 && ny < hitY1 && Math.abs(it.x - playerX.current) < reach) {
          hits.push(moved);
        } else if (ny >= hitY1 && it.kind === "drug" && Math.abs(it.x - playerX.current) < 0.18) {
          statsRef.current.dodges += 1;
          statsRef.current.score += 4;
          setScore(statsRef.current.score);
          bump("sidestep +4", C.teal);
        } else if (ny < 1.08) {
          rest.push(moved);
        }
      });

      hits.forEach((it) => {
        if (it.kind === "drug") {
          if (invuln.current > 0 || shieldLeft.current > 0) {
            rest.push({ ...it, y: 1.2 });
            bump("shield!", C.gold);
            return;
          }
          invuln.current = 700;
          const dmg = it.dmg || 1;
          statsRef.current.hearts = Math.max(0, statsRef.current.hearts - dmg);
          statsRef.current.cups += 1;
          statsRef.current.combo = 0;
          setHearts(statsRef.current.hearts);
          setCups(statsRef.current.cups);
          setCombo(0);
          bump(it.label || "hit", C.red);
          if (statsRef.current.hearts <= 0) finish();
        } else {
          const mult = 1 + Math.min(5, statsRef.current.combo) * 0.25;
          const pts = Math.round((it.pts || 10) * mult);
          statsRef.current.score += pts;
          statsRef.current.caught += 1;
          statsRef.current.combo += 1;
          statsRef.current.bestCombo = Math.max(statsRef.current.bestCombo, statsRef.current.combo);
          setScore(statsRef.current.score);
          setCaught(statsRef.current.caught);
          setCombo(statsRef.current.combo);
          if (it.kind === "prayer") {
            statsRef.current.prayers += 1;
            statsRef.current.hearts = Math.min(5, statsRef.current.hearts + 1);
            shieldLeft.current = 2000;
            easeLeft.current = 2000;
            setPrayers(statsRef.current.prayers);
            setHearts(statsRef.current.hearts);
            setShield(true);
            bump("breathe +" + pts, C.gold);
          } else if (statsRef.current.combo === 4) {
            bump("hands sure", C.gold);
          } else if (statsRef.current.combo === 8) {
            bump("the road knows you", C.gold);
          } else if (it.kind === "herb") {
            bump("herb +" + pts, C.green);
          } else {
            bump("+" + pts, C.gold);
          }
        }
      });

      itemsRef.current = rest;
      setItems(rest);

      const remain = RUN_MS - elapsed;
      setLeftMs(Math.max(0, remain));
      if (remain <= 0) finish();
    }, 32);
    return () => {
      clearInterval(tick);
      clearTimeout(hide);
      if (bannerTimer) clearTimeout(bannerTimer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!pop) return;
    const t = setTimeout(() => setPop(null), 420);
    return () => clearTimeout(t);
  }, [pop]);

  function commit() {
    const s = statsRef.current;
    const clean = s.cups === 0;
    dispatch({
      type: "TRAIN_DONE",
      effects: {
        skill: 6 + Math.min(22, Math.floor(s.caught * 1.3 + s.prayers * 4)),
        hope: clean ? 8 : 2 + s.prayers * 2,
        chain: s.cups * 6,
        health: s.cups ? -2 * s.cups : 2,
      },
      result: {
        hits: s.caught,
        rounds: s.caught + s.cups,
        impaired: s.cups > 0,
        score: s.score,
      },
    });
  }

  const timePct = Math.max(0, leftMs / RUN_MS);
  const shown = sampleTempo(1 - timePct);
  const tempoColor =
    shown.id === "fever" ? C.red : shown.id === "fast" ? "#F4845F" : shown.id === "quick" ? C.gold : C.green;
  const secsLeft = Math.ceil(leftMs / 1000);
  const clock = `${Math.floor(secsLeft / 60)}:${String(secsLeft % 60).padStart(2, "0")}`;

  if (over) {
    return (
      <Screen full>
        <LinearGradient colors={["#0E1A12", "#1B3A26"]} style={[s.endWrap, { paddingTop: insets.top + 16, paddingBottom: insets.bottom + 16 }]}>
          {you ? (
            <View style={s.endFace}>
              <Image source={you} style={s.endImg} resizeMode="cover" />
            </View>
          ) : null}
          <Text style={s.endName}>{state.player.name}</Text>
          <Text style={s.endK}>{over.clean ? "CLEAN RUN — HANDS YOURS" : "YOU STUMBLED — AND KEPT GOING"}</Text>
          <Text style={s.endScore}>{over.score}</Text>
          <Text style={s.endSub}>
            Gifts {over.caught} · prayers {over.prayers} · dodged {over.dodges}
          </Text>
          <Text style={s.endSub}>
            Drugs that tagged you {over.cups}
            {over.combo ? ` · best streak ${over.combo}` : ""}
            {over.hearts <= 0 ? " · hands empty" : ""}
          </Text>
          <Text style={s.endSub}>The road climbed to {over.phaseName.toLowerCase()}.</Text>
          <Text style={s.endStory}>
            {over.hearts <= 0
              ? "Your hands emptied before the road reached its fastest. Rest. The next run still starts slow."
              : over.clean
                ? "You stayed clean while the road went from a walk to its fastest. That climb is the feeling. Tomorrow the dream is louder."
                : "A drug found your hands, and you kept going. That is how it starts — small. The next run still begins slow."}
          </Text>
          <Pressable onPress={commit} style={s.playBtn}>
            <Text style={s.playTxt}>Continue ▸</Text>
          </Pressable>
        </LinearGradient>
      </Screen>
    );
  }

  return (
    <Screen full>
      <View
        ref={roadRef}
        onLayout={() => {
          if (roadRef.current && roadRef.current.measureInWindow) {
            roadRef.current.measureInWindow((x, y, w) => {
              roadLayout.current = { x, w: w || 1 };
            });
          }
        }}
        style={{ flex: 1 }}
        {...pan.panHandlers}
      >
        <ImageBackground source={SCENE_ART[week.art] || SCENE_ART.festival} style={s.fill} resizeMode="cover">
          <LinearGradient colors={["rgba(14,26,18,0.15)", "rgba(14,26,18,0.35)", "rgba(14,26,18,0.72)"]} style={s.fill}>
            <View pointerEvents="none" style={[s.hud, { paddingTop: insets.top + 6 }]}>
              <View style={s.pill}>
                <Text style={s.lives}>{hearts}</Text>
                <Text style={s.livesLab}>lives</Text>
              </View>
              <View style={s.scorePill}>
                <Text style={s.score}>{score}</Text>
                {combo > 1 ? <Text style={s.combo}>×{(1 + Math.min(5, combo) * 0.25).toFixed(2)}</Text> : null}
              </View>
              <View style={s.pill}>
                <Text style={s.goal}>{shield ? "🛡️" : dream.emoji}</Text>
              </View>
            </View>
            <View pointerEvents="none" style={s.timeBg}>
              <View style={[s.timeFill, { width: `${timePct * 100}%`, backgroundColor: tempoColor }]} />
            </View>
            <View pointerEvents="none" style={s.tempoRow}>
              <Text style={[s.tempoName, { color: tempoColor }]}>{shown.name}</Text>
              <Text style={s.clock}>{clock}</Text>
            </View>

            {items.map((it) => {
              const box = token + 36;
              const left = it.x * roadW - box / 2;
              const top = it.y * roadH - token / 2;
              const ring =
                it.kind === "drug" ? C.red : it.kind === "prayer" ? C.gold : it.kind === "herb" ? C.green : C.goldDeep;
              const tagColor =
                it.kind === "drug" ? "#FFD2C8" : it.kind === "herb" ? "#C8F5D4" : it.kind === "prayer" ? "#FFE7A3" : C.ink;
              return (
                <View key={it.id} pointerEvents="none" style={[s.tokenWrap, { left, top, width: box }]}>
                  <View style={[s.token, { width: token, height: token, borderColor: ring }]}>
                    {it.art ? (
                      <Image source={it.art} style={{ width: token - 8, height: token - 8 }} resizeMode="contain" />
                    ) : (
                      <Text style={{ fontSize: 26 }}>{it.emoji || "🌟"}</Text>
                    )}
                  </View>
                  <View style={s.itemTag}>
                    <Text style={[s.itemTagT, { color: tagColor }]} numberOfLines={1}>
                      {it.label}
                    </Text>
                  </View>
                </View>
              );
            })}
            {impair > 0 ? <View pointerEvents="none" style={s.fog} /> : null}
            <View
              pointerEvents="none"
              style={[
                s.player,
                {
                  left: px * roadW - playerW / 2,
                  bottom: playerBottom,
                  width: playerW,
                  height: playerH,
                  borderColor: shield ? "#FFF4C4" : C.gold,
                },
              ]}
            >
              {you ? (
                <Image source={you} style={{ width: playerW, height: playerH }} resizeMode="cover" />
              ) : (
                <Text style={{ fontSize: 36 }}>{dream.emoji}</Text>
              )}
            </View>
            <View
              pointerEvents="none"
              style={[s.nameTag, { left: px * roadW - 76, bottom: playerBottom + playerH + 8, width: 152 }]}
            >
              <View style={s.namePill}>
                <Text style={s.nameTxt} numberOfLines={1}>{state.player.name}</Text>
              </View>
            </View>
            {hint ? (
              <View pointerEvents="none" style={[s.hintBar, { top: insets.top + 86 }]}>
                <View style={s.hintPill}>
                  <Text style={s.hint}>Drag to move</Text>
                </View>
                <Text style={s.hintSub}>It starts slow. It climbs to fastest.</Text>
              </View>
            ) : null}
            {banner ? (
              <Text pointerEvents="none" style={[s.banner, { color: tempoColor }]}>
                {banner}
              </Text>
            ) : null}
            {pop ? (
              <Text pointerEvents="none" style={[s.pop, { color: pop.c }]}>
                {pop.t}
              </Text>
            ) : null}
          </LinearGradient>
        </ImageBackground>
      </View>
    </Screen>
  );
}

function specDream(dream) {
  return dream.emoji;
}

const s = StyleSheet.create({
  fill: { flex: 1 },
  hud: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 14,
    alignItems: "center",
  },
  pill: {
    backgroundColor: "rgba(8,16,10,0.62)",
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
    minWidth: 56,
    alignItems: "center",
  },
  scorePill: {
    backgroundColor: "rgba(8,16,10,0.7)",
    borderRadius: 22,
    paddingHorizontal: 18,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: "rgba(245,179,1,0.45)",
    alignItems: "center",
    minWidth: 96,
  },
  lives: { color: C.ink, fontWeight: "900", fontSize: 18, lineHeight: 20 },
  livesLab: { color: C.inkDim, fontWeight: "700", fontSize: 10, marginTop: 1 },
  score: { color: C.gold, fontWeight: "900", fontSize: 30, lineHeight: 34 },
  combo: { color: C.green, fontWeight: "800", fontSize: 11, marginTop: -2 },
  goal: { fontSize: 20 },
  timeBg: {
    height: 4,
    marginHorizontal: 18,
    marginTop: 8,
    borderRadius: 2,
    backgroundColor: "rgba(255,255,255,0.14)",
    overflow: "hidden",
  },
  timeFill: { height: 4, backgroundColor: C.gold, borderRadius: 2 },
  tempoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 18,
    marginTop: 8,
  },
  tempoName: { fontWeight: "900", fontSize: 13, letterSpacing: 1.4 },
  clock: { color: C.ink, fontWeight: "800", fontSize: 13 },
  banner: {
    position: "absolute",
    top: "28%",
    alignSelf: "center",
    fontWeight: "900",
    fontSize: 34,
    letterSpacing: 1,
  },
  tokenWrap: { position: "absolute", alignItems: "center" },
  token: {
    overflow: "hidden",
    borderWidth: 2,
    borderRadius: 18,
    backgroundColor: "rgba(8,16,10,0.82)",
    alignItems: "center",
    justifyContent: "center",
  },
  itemTag: {
    marginTop: 4,
    backgroundColor: "rgba(8,16,10,0.88)",
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 3,
    maxWidth: "100%",
  },
  itemTagT: { fontWeight: "800", fontSize: 11, textAlign: "center" },
  player: {
    position: "absolute",
    overflow: "hidden",
    borderWidth: 3,
    borderRadius: 24,
    backgroundColor: "#102016",
  },
  nameTag: { position: "absolute", alignItems: "center" },
  namePill: {
    backgroundColor: "rgba(8,16,10,0.92)",
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: C.gold,
    maxWidth: 152,
  },
  nameTxt: { color: C.ink, fontWeight: "900", fontSize: 14, textAlign: "center" },
  fog: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(20,10,8,0.28)" },
  hintBar: { position: "absolute", left: 0, right: 0, alignItems: "center" },
  hintPill: {
    backgroundColor: "rgba(8,16,10,0.88)",
    borderColor: C.gold,
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  hint: { color: C.ink, fontWeight: "900", fontSize: 15 },
  hintSub: { color: C.ink, fontWeight: "700", marginTop: 6, fontSize: 12 },
  pop: {
    position: "absolute",
    alignSelf: "center",
    top: "40%",
    fontSize: 28,
    fontWeight: "900",
  },
  endWrap: { flex: 1, justifyContent: "center", padding: 24, alignItems: "center" },
  endFace: {
    width: 148,
    height: 148,
    borderRadius: 24,
    borderWidth: 3,
    borderColor: C.gold,
    overflow: "hidden",
    backgroundColor: "#102016",
  },
  endImg: { width: 148, height: 148 },
  endName: { color: C.ink, fontWeight: "900", fontSize: 26, marginTop: 12 },
  endK: { color: C.gold, fontWeight: "800", letterSpacing: 1.2, fontSize: 12, textAlign: "center", marginTop: 6 },
  endScore: { color: C.ink, fontWeight: "900", fontSize: 56, marginTop: 6 },
  endSub: { color: C.inkDim, fontWeight: "700", marginTop: 4, textAlign: "center" },
  endStory: { color: C.ink, textAlign: "center", marginTop: 16, lineHeight: 22, fontSize: 15 },
  playBtn: {
    marginTop: 24,
    backgroundColor: C.gold,
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 16,
  },
  playTxt: { color: "#26200A", fontWeight: "900", fontSize: 16 },
});
