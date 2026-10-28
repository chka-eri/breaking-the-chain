// The player's chosen dream. Each dream grounds the story in a real Imo State landmark.

export const DREAMS = {
  footballer: {
    key: "footballer",
    label: "Footballer",
    emoji: "⚽",
    desc: "Chase the Heartland FC youth trials at Dan Anyiam Stadium, Owerri.",
    goal: "the Heartland FC youth trials",
    mentor: "Coach Emeka",
    venue: "Dan Anyiam Stadium",
    win: "You sign your first youth contract with Heartland FC — and Dan Anyiam Stadium roars your name.",
  },
  musician: {
    key: "musician",
    label: "Musician",
    emoji: "🎧",
    desc: "Record your first EP and headline the Owerri Young Stars Showcase.",
    goal: "the Owerri Young Stars Showcase",
    mentor: "Uncle Ikenna the producer",
    venue: "the studio in World Bank Layout",
    win: "Your first EP, 'IJE', plays on Owerri radio — and the crowd sings your own hook back to you.",
  },
  engineer: {
    key: "engineer",
    label: "Engineer",
    emoji: "🛠️",
    desc: "Win the FUTO scholarship and build things that outlive you.",
    goal: "the FUTO scholarship examination",
    mentor: "Mrs. Adaora",
    venue: "FUTO campus",
    win: "The FUTO admission letter — full scholarship — hangs framed above Mama's shop counter.",
  },
};

export const DREAM_ORDER = ["footballer", "musician", "engineer"];

// Replaces {name}, {goal}, {mentor}, {venue} in story text.
export function fill(text, player) {
  if (!text) return text;
  const dream = DREAMS[player.dream] || DREAMS.footballer;
  return text
    .split("{name}").join(player.name)
    .split("{goal}").join(dream.goal)
    .split("{mentor}").join(dream.mentor)
    .split("{venue}").join(dream.venue);
}
