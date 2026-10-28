// Breaking the Chain (Igbaji Agbu) - visual theme
// Palette inspired by Igbo uli art, palm groves, red earth and festival gold.

export const C = {
  bgDeep: "#0E1A12",
  bg: "#142519",
  card: "#1D3325",
  cardAlt: "#254230",
  line: "#3B5744",
  ink: "#F7F3E8",
  inkDim: "#C7BFA9",
  gold: "#F5B301",
  goldDeep: "#D08C00",
  green: "#3DA35D",
  greenDeep: "#0B6E4F",
  red: "#E4572E",
  redDeep: "#C1121F",
  blue: "#7FC8F8",
  purple: "#9B72CF",
  teal: "#4ECDC4",
};

export const STAT_META = {
  hope: { key: "hope", label: "Hope", igbo: "Nchekwube", icon: "🌟", color: C.gold },
  health: { key: "health", label: "Health", igbo: "Ahụike", icon: "❤️", color: C.green },
  family: { key: "family", label: "Family", igbo: "Ezinụlọ", icon: "🤝", color: C.blue },
  money: { key: "money", label: "Money", igbo: "Ego", icon: "💰", color: C.teal },
  chain: { key: "chain", label: "The Chain", igbo: "Agbụ", icon: "⛓️", color: C.red, inverted: true },
};

export const STAT_ORDER = ["hope", "health", "family", "money", "chain"];

export const SPEAKER_COLORS = {
  Narrator: C.inkDim,
  "Mama Ify": C.gold,
  Papa: "#8FD694",
  Ngozi: C.blue,
  Nnamdi: "#F4845F",
  "Dee Okonkwo": C.purple,
  Baros: "#FF7B6B",
  "Nurse Amara": C.teal,
  "Counselor Zeribe": C.green,
  "NDLEA Officer": "#8FB8DE",
  You: C.ink,
};
