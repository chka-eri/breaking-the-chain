// Optional illustrated art. Missing keys fall back to emoji/gradient.

export const TITLE_HERO = require("../../assets/ui/title-hero.jpg");

export const SCENE_ART = {
  compound: require("../../assets/scenes/compound.jpg"),
  craft: require("../../assets/scenes/craft.jpg"),
  festival: require("../../assets/scenes/festival.jpg"),
  market: require("../../assets/scenes/market.jpg"),
  square: require("../../assets/scenes/square.jpg"),
  clinic: require("../../assets/scenes/clinic.jpg"),
  rehab: require("../../assets/scenes/rehab.jpg"),
  stream: require("../../assets/scenes/stream.jpg"),
  morning: require("../../assets/scenes/compound.jpg"),
  road: require("../../assets/scenes/compound.jpg"),
  family: require("../../assets/scenes/compound.jpg"),
  party: require("../../assets/scenes/festival.jpg"),
  wedding: require("../../assets/scenes/festival.jpg"),
  darknight: require("../../assets/scenes/stream.jpg"),
  ndlea: require("../../assets/scenes/square.jpg"),
  mbari: require("../../assets/scenes/square.jpg"),
  school: require("../../assets/scenes/craft.jpg"),
  base: require("../../assets/scenes/market.jpg"),
};

export const ITEM_ART = {
  kola: require("../../assets/items/kola.jpg"),
  yam: require("../../assets/items/yam.jpg"),
  craft: require("../../assets/items/craft.jpg"),
  market: require("../../assets/items/market.jpg"),
  support: require("../../assets/items/support.jpg"),
};

export const RUN_ART = {
  cup: require("../../assets/run/cup.png"),
  crystal: require("../../assets/run/crystal.png"),
  bottle: require("../../assets/run/bottle.png"),
  chain: require("../../assets/run/chain.png"),
  herb: require("../../assets/run/herb.png"),
  prayer: require("../../assets/run/prayer.png"),
};

export const PORTRAITS = {
  youth_m: require("../../assets/portraits/youth_m.jpg"),
  youth_f: require("../../assets/portraits/youth_f.jpg"),
  "Mama Ify": require("../../assets/portraits/mama.jpg"),
  Papa: require("../../assets/portraits/papa.jpg"),
  Ngozi: require("../../assets/portraits/ngozi.jpg"),
  Nnamdi: require("../../assets/portraits/nnamdi.jpg"),
  "Dee Okonkwo": require("../../assets/portraits/dee.jpg"),
  Baros: require("../../assets/portraits/baros.jpg"),
  "Nurse Amara": require("../../assets/portraits/amara.jpg"),
  "Counselor Zeribe": require("../../assets/portraits/zeribe.jpg"),
  "NDLEA Officer": require("../../assets/portraits/ndlea.jpg"),
};

export const ROLES = {
  You: "You",
  "Mama Ify": "Your mother",
  Papa: "Your father",
  Ngozi: "Your friend",
  Nnamdi: "Your cousin",
  "Dee Okonkwo": "Village elder",
  Baros: "He pours the cup",
  "Nurse Amara": "Clinic nurse",
  "Counselor Zeribe": "Counsellor",
  "NDLEA Officer": "NDLEA officer",
};

export function roleFor(speaker) {
  return ROLES[speaker] || "";
}

const FEMALE_NAMES = ["adaeze", "chiamaka"];

export function isFeminineName(name) {
  return FEMALE_NAMES.includes((name || "").trim().toLowerCase());
}

export function portraitFor(speaker, player) {
  if (!speaker || speaker === "Narrator") return null;
  if (speaker === "You") {
    return isFeminineName(player && player.name) ? PORTRAITS.youth_f : PORTRAITS.youth_m;
  }
  return PORTRAITS[speaker] || null;
}

export function portraitForName(name, player) {
  const p = portraitFor(name, player);
  if (p) return p;
  if (PORTRAITS[name]) return PORTRAITS[name];
  return PORTRAITS.youth_m;
}
