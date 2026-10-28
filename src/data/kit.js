// What you pack BEFORE the night. The educational core:
// a prepared "no" beats a hot moment.

export const TOOLS = {
  no: {
    id: "no",
    name: "A ready Mba",
    igbo: "Mba — No",
    icon: "✋",
    hint: "Say it in your mouth before anyone hands you a cup.",
  },
  ngozi: {
    id: "ngozi",
    name: "Ngozi's name",
    igbo: "Aha Ngozi",
    icon: "💙",
    hint: "A friend who will walk you out of the circle.",
  },
  craft: {
    id: "craft",
    name: "Your craft",
    igbo: "Ọrụ gị",
    icon: "⭐",
    hint: "Tomorrow's training is a reason that survives tonight.",
  },
  mama: {
    id: "mama",
    name: "Home before dark",
    igbo: "Ụlọ",
    icon: "🏠",
    hint: "Mama's lamp is also a decision.",
  },
  breath: {
    id: "breath",
    name: "Slow breath",
    igbo: "Iku ume",
    icon: "🫁",
    hint: "The craving is a wave. Ride it. Do not obey it.",
  },
  elder: {
    id: "elder",
    name: "Dee's proverb",
    igbo: "Ilu Dee",
    icon: "📜",
    hint: "Words packed from the elders weigh more than the crowd.",
  },
  help: {
    id: "help",
    name: "Help me",
    igbo: "Nyere m aka",
    icon: "🤝",
    hint: "Two words. The chain hates them.",
  },
  watch: {
    id: "watch",
    name: "Watch Nnamdi",
    igbo: "Nchekwa",
    icon: "👁️",
    hint: "The black goat is sought in the morning — look at your cousin now.",
  },
};

export const TOOL_ORDER = ["no", "ngozi", "craft", "mama", "breath", "elder", "help", "watch"];

export function toolsForNight(level, proverbs) {
  const base = ["no", "ngozi", "craft", "mama", "breath"];
  if (level >= 2) base.push("watch");
  if (level >= 3 || (proverbs && proverbs.length)) base.push("elder");
  if (level >= 4) base.push("help");
  return [...new Set(base)];
}

export const KIT_SIZE = 3;
