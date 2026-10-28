// Village restore rooms — the "restaurant" meta, mapped to Umuoma.

export const ROOMS = {
  compound: {
    id: "compound",
    name: "Okafor Compound",
    igbo: "Ngwuru Okafor",
    scene: "compound",
    emoji: "🏠",
    blurb: "Hearth, isiagu, the kola bowl on the low table.",
    restoreChapter: 1,
  },
  craft: {
    id: "craft",
    name: "Your craft corner",
    igbo: "Ebe ọrụ",
    scene: "craft",
    emoji: "⭐",
    blurb: "The place your dream trains — field, studio, or desk.",
    restoreChapter: 2,
  },
  market: {
    id: "market",
    name: "Eke Ukwu stall",
    igbo: "Ebe ahịa",
    scene: "market",
    emoji: "🧺",
    blurb: "Mama's corner of the great Owerri market.",
    restoreChapter: 2,
  },
  stream: {
    id: "stream",
    name: "Otamiri bank",
    igbo: "Ọnụ Otamiri",
    scene: "stream",
    emoji: "🌊",
    blurb: "Where truth is spoken when the village sleeps.",
    restoreChapter: 3,
  },
  clinic: {
    id: "clinic",
    name: "Nurse Amara's clinic",
    igbo: "Ụlọ ọgwụ",
    scene: "clinic",
    emoji: "🏥",
    blurb: "A bench, a pulse, and a door that says it is not too late.",
    restoreChapter: 4,
  },
  rehab: {
    id: "rehab",
    name: "Hope Recovery Centre",
    igbo: "Ebe Olileanya",
    scene: "rehab",
    emoji: "🌿",
    blurb: "Mango trees, plastic chairs, work that is real.",
    restoreChapter: 5,
  },
  square: {
    id: "square",
    name: "Village square",
    igbo: "Ama obodo",
    scene: "square",
    emoji: "🥁",
    blurb: "Iri Ji stage — where the village hears your name again.",
    restoreChapter: 5,
  },
};

export const ROOM_ORDER = ["compound", "craft", "market", "stream", "clinic", "rehab", "square"];

export const LOOKS = [
  { id: 0, name: "Red earth & palm", tint: "rgba(139,90,43,0.28)" },
  { id: 1, name: "Festival gold", tint: "rgba(245,179,1,0.22)" },
  { id: 2, name: "River dusk", tint: "rgba(18,63,92,0.32)" },
];

export function roomForChapter(level) {
  if (level <= 1) return "compound";
  if (level === 2) return "craft";
  if (level === 3) return "stream";
  if (level === 4) return "clinic";
  return "square";
}
