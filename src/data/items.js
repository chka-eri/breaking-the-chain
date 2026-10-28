// Life-item merge chains. No drug products. The Chain is a lock, never a recipe.

export const MAX_LEVEL = 6;

export const CHAINS = {
  kola: {
    id: "kola",
    label: "Ọjị",
    english: "Kola",
    color: "#C9A227",
    bg: "#3A2A0A",
    emoji: ["🟤", "🥜", "🥣", "🍽️", "🪔", "✨"],
    names: [
      "Fresh kola pod",
      "Split kola",
      "Kola bowl",
      "Visitor's kola",
      "Family kola tray",
      "Life-bringing ọjị",
    ],
    igbo: ["Ọjị ọhụrụ", "Ọjị gbawara", "Ite ọjị", "Ọjị ndị ọbịa", "Oche ọjị", "Ọjị ndụ"],
  },
  yam: {
    id: "yam",
    label: "Ji",
    english: "Yam",
    color: "#E0A040",
    bg: "#3A2208",
    emoji: ["🥔", "🍠", "🍽️", "🥘", "🎊", "👑"],
    names: [
      "Seed yam",
      "Roasted yam",
      "Festival yam",
      "Shared platter",
      "New-yam offering",
      "Iri Ji feast",
    ],
    igbo: ["Ji mkpụrụ", "Ji ọkụ", "Ji ememme", "Nri ọha", "Àjà ji", "Oriiri Iri Ji"],
  },
  craft: {
    id: "craft",
    label: "Craft",
    english: "Your craft",
    color: "#3DA35D",
    bg: "#0E2A18",
    emoji: ["⭐", "🔥", "💪", "🎯", "🏅", "🦅"],
    names: {
      footballer: ["Worn ball", "Training cones", "Match boots", "Heartland jersey", "Trial pass", "First contract"],
      musician: ["A beat", "A verse", "Studio hour", "EP mix", "Radio play", "Showcase night"],
      engineer: ["Hand tools", "A sketch", "A model", "Exam notes", "FUTO form", "Scholarship letter"],
    },
    igbo: {
      footballer: ["Bọọlụ", "Mma ọzụzụ", "Akpụkpọ ụkwụ", "Uwe Heartland", "Akwụkwọ nnwale", "Nkwekọrịta"],
      musician: ["Ụda", "Ukwe", "Oge studio", "EP", "Redio", "Ngosi"],
      engineer: ["Ngwa ọrụ", "Eserese", "Ihe nlere", "Akwụkwọ", "FUTO", "Scholarship"],
    },
  },
  market: {
    id: "market",
    label: "Ahịa",
    english: "Market",
    color: "#E4572E",
    bg: "#2A1208",
    emoji: ["🍅", "🧺", "📦", "💰", "📒", "🏪"],
    names: [
      "Tomato",
      "Market basket",
      "Stall crate",
      "Honest day's take",
      "Shop ledger",
      "Eke Ukwu stand",
    ],
    igbo: ["Tomato", "Nkata", "Igbe ahịa", "Ego ezi", "Akwụkwọ ụlọ ahịa", "Ebe Eke Ukwu"],
  },
  support: {
    id: "support",
    label: "Nkwado",
    english: "Support",
    color: "#7FC8F8",
    bg: "#0C2233",
    emoji: ["💧", "🫁", "📜", "📞", "🏮", "🕊️"],
    names: [
      "Cool water",
      "Slow breath",
      "Proverb card",
      "A friend's call",
      "Elder's lantern",
      "Blessing of the umunna",
    ],
    igbo: ["Mmiri", "Iku ume", "Ilu", "Oku enyi", "Ọkụ nna nna", "Ngọzi umunna"],
  },
  uli: {
    id: "uli",
    label: "Uli",
    english: "Mbari art",
    color: "#9B72CF",
    bg: "#1A1028",
    emoji: ["⚪", "〰️", "🎨", "🏺", "🗿", "🏛️"],
    names: [
      "White chalk",
      "Uli curve",
      "Body pattern",
      "Mbari clay",
      "Painted figure",
      "House of Mbari",
    ],
    igbo: ["Nzu", "Akara uli", "Ihe a kara", "Uro Mbari", "Ihe e sere", "Ụlọ Mbari"],
  },
};

export const GENERATORS = {
  kiosk: {
    id: "kiosk",
    name: "Mama's Kiosk",
    igbo: "Ụlọ ahịa Mama",
    emoji: "🏪",
    unlockLevel: 1,
    drops: [
      { chain: "kola", weight: 3 },
      { chain: "market", weight: 1, fromLevel: 2 },
    ],
  },
  yamHeap: {
    id: "yamHeap",
    name: "Yam heap",
    igbo: "Okwu ji",
    emoji: "🍠",
    unlockLevel: 1,
    drops: [{ chain: "yam", weight: 1 }],
  },
  craftSpace: {
    id: "craftSpace",
    name: "Your craft",
    igbo: "Ọrụ gị",
    emoji: "⭐",
    unlockLevel: 1,
    drops: [{ chain: "craft", weight: 1 }],
  },
  marketStall: {
    id: "marketStall",
    name: "Eke Ukwu crate",
    igbo: "Igbe ahịa",
    emoji: "🧺",
    unlockLevel: 2,
    drops: [{ chain: "market", weight: 1 }],
  },
  elderStool: {
    id: "elderStool",
    name: "Elder's stool",
    igbo: "Oche Dee",
    emoji: "🪵",
    unlockLevel: 3,
    drops: [
      { chain: "uli", weight: 2 },
      { chain: "kola", weight: 1 },
    ],
  },
  stream: {
    id: "stream",
    name: "Otamiri bank",
    igbo: "Ọnụ mmiri",
    emoji: "🌊",
    unlockLevel: 4,
    drops: [{ chain: "support", weight: 1 }],
  },
};

export function getItemView(chain, level, dream) {
  const c = CHAINS[chain];
  if (!c) return { name: "?", emoji: "?", color: "#888", igbo: "" };
  const i = Math.max(0, Math.min(MAX_LEVEL, level) - 1);
  const names = typeof c.names === "string" || Array.isArray(c.names) ? c.names : c.names[dream] || c.names.footballer;
  const igbo = Array.isArray(c.igbo) ? c.igbo : c.igbo[dream] || c.igbo.footballer;
  return {
    name: names[i],
    igbo: igbo[i],
    emoji: c.emoji[i],
    color: c.color,
    bg: c.bg,
    label: c.label,
  };
}

export function pickDrop(gen, unlockedLevel) {
  const pool = (gen.drops || []).filter((d) => !d.fromLevel || unlockedLevel >= d.fromLevel);
  const total = pool.reduce((s, d) => s + d.weight, 0) || 1;
  let r = Math.random() * total;
  for (const d of pool) {
    r -= d.weight;
    if (r <= 0) return d.chain;
  }
  return pool[0] ? pool[0].chain : null;
}

export function generatorsFor(unlockedLevel) {
  return Object.values(GENERATORS).filter((g) => unlockedLevel >= g.unlockLevel);
}
