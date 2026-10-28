// Scene banners: gradient + emoji tableau + label.
// Text-first alpha: full illustrations (Mbari-inspired 2D art) arrive in the beta.

export const SCENES = {
  morning: { colors: ["#3A2410", "#8A5A1E"], emojis: "🌅 🌴 🏠 🐓", label: "Umuoma Village • Ụtụtụ" },
  compound: { colors: ["#2D1E10", "#6B4423"], emojis: "🏠 🔥 🍲 🐐", label: "The Okafor Compound" },
  road: { colors: ["#22301C", "#4E6B35"], emojis: "🛤️ 🌴 🚲 ☀️", label: "The Village Road" },
  festival: { colors: ["#7A3803", "#C26F10"], emojis: "🍠 🥁 🎭 🌽", label: "Iri Ji — New Yam Festival" },
  party: { colors: ["#170F2E", "#3B2364"], emojis: "🌙 🔊 🥤 🎭", label: "Emeka's Compound • Night" },
  base: { colors: ["#1D1B16", "#3F3A2A"], emojis: "🪑 💨 📻 🌚", label: "Kai Base • Behind the Timber Market" },
  craft: { colors: ["#123A2A", "#1F6B4A"], emojis: "💪 🔥 🎯 ⭐", label: "Your Craft • Training" },
  market: { colors: ["#4A2C07", "#9C6A1D"], emojis: "🧺 🐟 🍅 🗣️", label: "Eke Ukwu Market, Owerri" },
  clinic: { colors: ["#12303B", "#20606F"], emojis: "🏥 💊 🩺 🕯️", label: "Nurse Amara's Clinic" },
  stream: { colors: ["#0C2233", "#123F5C"], emojis: "🌊 🌙 🌾 ✨", label: "Otamiri River • Night" },
  family: { colors: ["#2B1A12", "#5C3A24"], emojis: "🕯️ 🍲 👨‍👩‍👧 🥣", label: "The Family Circle" },
  rehab: { colors: ["#173A2E", "#2C6E57"], emojis: "🌿 🏥 🤝 ☀️", label: "Hope Recovery Centre • Owerri" },
  wedding: { colors: ["#3F1D33", "#8B2D6B"], emojis: "🍷 💃 🥁 🎊", label: "Igba Nkwu — Traditional Wedding" },
  square: { colors: ["#274012", "#557A1F"], emojis: "🎤 🥁 🦅 🌟", label: "The Village Square" },
  darknight: { colors: ["#0E0E14", "#232338"], emojis: "🌑 🦗 💭 ⛓️", label: "A Heavy Night" },
  mbari: { colors: ["#33230C", "#6E4A17"], emojis: "🗿 🎨 🌺 🌙", label: "The Old Mbari House" },
  ndlea: { colors: ["#1A2438", "#2C3F66"], emojis: "🚨 👮 📢 🌃", label: "NDLEA Operation" },
  school: { colors: ["#1C2B33", "#2F5364"], emojis: "📚 🏫 ✏️ 🌥️", label: "School" },
};

export function getScene(key) {
  return SCENES[key] || SCENES.morning;
}
