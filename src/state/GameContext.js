import React, { createContext, useContext, useEffect, useReducer, useRef } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SAVE_KEY = "btc_save_v4";

export const START = {
  hope: 60,
  health: 88,
  family: 78,
  money: 40,
  chain: 0,
  skill: 20,
};

const initialState = {
  booted: false,
  screen: "title",
  backScreen: "title",
  player: { name: "Chinedu", dream: "footballer" },
  stats: { ...START },
  week: 1,
  unlocked: 1,
  completed: [],
  impair: 0,
  proverbs: [],
  flags: {},
  lastTrain: null,
  lastNight: null,
  startedAt: null,
};

function clamp(stats) {
  const out = { ...stats };
  Object.keys(out).forEach((k) => {
    out[k] = Math.max(0, Math.min(100, Math.round(out[k])));
  });
  return out;
}

function apply(state, effects) {
  if (!effects) return state;
  const stats = { ...state.stats };
  Object.entries(effects).forEach(([k, v]) => {
    if (typeof stats[k] === "number") stats[k] += v;
  });
  return { ...state, stats: clamp(stats) };
}

function grantProverb(state, id) {
  if (!id || (state.proverbs || []).includes(id)) return state;
  return { ...state, proverbs: [...state.proverbs, id] };
}

function reducer(state, action) {
  switch (action.type) {
    case "BOOT":
      return { ...state, booted: true };
    case "NAV":
      return {
        ...state,
        screen: action.screen,
        backScreen: action.remember ? state.screen : state.backScreen,
      };
    case "BACK":
      return { ...state, screen: state.backScreen || "hub" };
    case "NEW_GAME":
      return { ...initialState, booted: true, screen: "setup" };
    case "SETUP":
      return {
        ...initialState,
        booted: true,
        player: action.player,
        startedAt: Date.now(),
        proverbs: ["prv_stand"],
        screen: "hub",
      };
    case "GO_TRAIN":
      return { ...state, screen: "train" };
    case "GO_NIGHT":
      return { ...state, screen: "night" };
    case "TRAIN_DONE": {
      let s = apply(state, action.effects);
      s = {
        ...s,
        lastTrain: action.result,
        impair: Math.max(0, (s.impair || 0) - 1),
        screen: "hub",
      };
      return s;
    }
    case "NIGHT_DONE": {
      const choice = action.choice || {};
      let s = apply(state, choice.effects);
      s = apply(s, action.cravingEffects);
      const completed = s.completed.includes(s.week) ? s.completed : [...s.completed, s.week];
      const unlocked = Math.max(s.unlocked, Math.min(5, s.week + 1));
      if (choice.impair) s = { ...s, impair: Math.max(s.impair || 0, choice.impair) };
      s = grantProverb(s, choice.proverb);
      if (choice.tag === "refuse") s = grantProverb(s, "prv_goat");
      if (choice.tag === "ask") s = grantProverb(s, "prv_ask");
      if (choice.tag === "family") s = grantProverb(s, "prv_kin");
      const lockedPath = state.flags.path;
      const path =
        state.week === 2
          ? s.stats.chain < 22
            ? "helper"
            : "struggler"
          : lockedPath || (s.stats.chain < 22 ? "helper" : "struggler");
      const week = s.week < 5 && completed.includes(s.week) ? s.week + 1 : s.week;
      const screen = completed.length >= 5 ? "ending" : "hub";
      return {
        ...s,
        completed,
        unlocked,
        week: screen === "ending" ? 5 : week,
        lastNight: { week: state.week, choice, result: choice.result },
        flags: { ...s.flags, ["w" + state.week]: choice.id, path },
        screen,
      };
    }
    case "LOAD": {
      const save = action.save || {};
      let screen = save.screen === "train" || save.screen === "night" ? save.screen : "hub";
      if (["title", "setup", "ending", "journal", "about"].includes(save.screen)) screen = save.screen;
      return { ...initialState, ...save, screen, booted: true };
    }
    default:
      return state;
  }
}

const Ctx = createContext(null);

export function GameProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const savedRef = useRef(null);
  const [hasSave, setHasSave] = React.useState(false);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(SAVE_KEY);
        if (raw) {
          savedRef.current = JSON.parse(raw);
          setHasSave(true);
        }
      } catch (e) {}
      dispatch({ type: "BOOT" });
    })();
  }, []);

  useEffect(() => {
    if (!state.startedAt) return;
    const snapshot = {
      player: state.player,
      stats: state.stats,
      week: state.week,
      unlocked: state.unlocked,
      completed: state.completed,
      impair: state.impair,
      proverbs: state.proverbs,
      flags: state.flags,
      lastTrain: state.lastTrain,
      lastNight: state.lastNight,
      startedAt: state.startedAt,
      screen: state.screen === "train" || state.screen === "night" ? "hub" : state.screen,
    };
    savedRef.current = snapshot;
    setHasSave(true);
    AsyncStorage.setItem(SAVE_KEY, JSON.stringify(snapshot)).catch(() => {});
  }, [state]);

  return (
    <Ctx.Provider
      value={{
        state,
        dispatch,
        hasSave,
        loadSave: () => savedRef.current && dispatch({ type: "LOAD", save: savedRef.current }),
      }}
    >
      {children}
    </Ctx.Provider>
  );
}

export function useGame() {
  return useContext(Ctx);
}
