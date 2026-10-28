// Village chores (orders) + story sessions (Gossip Harbor "chore book").
// Completing orders earns coins. Spending coins plays the next story beat.

function o(id, from, text, need, reward, extra) {
  return { id, from, text, need, reward: { coins: 14, ike: 2, ...reward }, ...extra };
}

const CH1_ORDERS = [
  o("c1_mama", "Mama Ify", "Bia — kola for the morning visitors before they sit.", [{ chain: "kola", level: 1, qty: 1 }], { coins: 12, family: 1 }),
  o("c1_papa", "Papa", "Carry roasted yam to the men under the iroko.", [{ chain: "yam", level: 1, qty: 1 }], { coins: 12, hope: 1 }),
  o("c1_ngozi", "Ngozi", "Split kola with me. Six weeks is not a stroll.", [{ chain: "kola", level: 2, qty: 1 }], { coins: 18, hope: 2 }),
  o("c1_dee", "Dee Okonkwo", "Festival yam for the elders who will break kola at Iri Ji.", [{ chain: "yam", level: 2, qty: 1 }], { coins: 18, family: 2 }),
  o("c1_mama2", "Mama Ify", "Two fresh kola — one for the house, one for the road.", [{ chain: "kola", level: 1, qty: 2 }], { coins: 16, family: 1 }),
  o("c1_craft", "You", "Touch your craft once before the drums start.", [{ chain: "craft", level: 1, qty: 1 }], { coins: 14, hope: 2 }),
];

const CH2_ORDERS = [
  o("c2_mentor", "{mentor}", "Evening session. Bring a real piece of your craft.", [{ chain: "craft", level: 2, qty: 1 }], { coins: 20, hope: 3 }),
  o("c2_mama", "Mama Ify", "Help me close the stall — a basket of market things.", [{ chain: "market", level: 1, qty: 1 }], { coins: 16, family: 2, money: 2 }),
  o("c2_ngozi", "Ngozi", "Shop help, then books. Bring kola for the customers.", [{ chain: "kola", level: 2, qty: 1 }], { coins: 16, family: 1 }),
  o("c2_papa", "Papa", "Family rehearsal needs a festival yam on the table.", [{ chain: "yam", level: 2, qty: 1 }], { coins: 18, family: 3 }),
  o("c2_temp", "Nnamdi", "Base dey sweet tonight. Bring something from your craft... 'just Friday'.", [{ chain: "craft", level: 1, qty: 1 }], { coins: 24, chain: 6, hope: -2 }, { tag: "temptation" }),
  o("c2_market", "Mama Ify", "Eke Ukwu is calling. A proper stall crate.", [{ chain: "market", level: 2, qty: 1 }], { coins: 22, money: 3 }),
];

const CH3S_ORDERS = [
  o("c3s_mama", "Mama Ify", "The drawer is light. Bring an honest day's take — not stories.", [{ chain: "market", level: 2, qty: 1 }], { coins: 18, family: 2 }),
  o("c3s_mentor", "{mentor}", "Show me fire. A higher piece of your craft.", [{ chain: "craft", level: 3, qty: 1 }], { coins: 22, hope: 3 }),
  o("c3s_ngozi", "Ngozi", "Sit by the river. Bring cool water and a proverb in your pocket.", [{ chain: "kola", level: 3, qty: 1 }], { coins: 20, family: 2 }),
  o("c3s_dee", "Dee Okonkwo", "Uli chalk. Remember who you are while the chain talks.", [{ chain: "uli", level: 1, qty: 1 }], { coins: 16, hope: 2 }),
  o("c3s_temp", "Baros", "Credit is open. Bring market money and don't ask questions.", [{ chain: "market", level: 1, qty: 1 }], { coins: 26, chain: 8, family: -2 }, { tag: "temptation" }),
];

const CH3H_ORDERS = [
  o("c3h_ngozi", "Ngozi", "Help me watch Nnamdi. A visitor's kola — we go gently.", [{ chain: "kola", level: 3, qty: 1 }], { coins: 20, family: 3 }),
  o("c3h_mentor", "{mentor}", "Your example is a light. Keep the craft high.", [{ chain: "craft", level: 3, qty: 1 }], { coins: 22, hope: 3 }),
  o("c3h_dee", "Dee Okonkwo", "Paint a warning in uli before night finds him.", [{ chain: "uli", level: 2, qty: 1 }], { coins: 22, hope: 2 }),
  o("c3h_mama", "Mama Ify", "Food for Nnamdi's mother. She has not been eating.", [{ chain: "yam", level: 3, qty: 1 }], { coins: 20, family: 3 }),
];

const CH4S_ORDERS = [
  o("c4s_water", "Nurse Amara", "Drink. Slowly. Cool water first — then we talk.", [{ chain: "support", level: 1, qty: 1 }], { coins: 18, health: 3, chain: -2 }),
  o("c4s_breath", "You", "Name the shake. Meet it with a slow breath.", [{ chain: "support", level: 2, qty: 1 }], { coins: 20, hope: 2, chain: -2 }),
  o("c4s_papa", "Papa", "Bring kola to the family circle. Do not speak yet. Sit.", [{ chain: "kola", level: 4, qty: 1 }], { coins: 24, family: 4 }),
  o("c4s_dee", "Dee Okonkwo", "Lantern by the river. You will not be alone tonight.", [{ chain: "support", level: 3, qty: 1 }], { coins: 24, family: 3, hope: 2 }),
];

const CH4H_ORDERS = [
  o("c4h_aid", "Nurse Amara", "Keep the crowd off him. Water and a calm breath for the runner.", [{ chain: "support", level: 1, qty: 1 }], { coins: 20, hope: 3 }),
  o("c4h_family", "Papa Nnamdi", "Kola for a house that wants to beat a sickness. Bring dignity.", [{ chain: "kola", level: 4, qty: 1 }], { coins: 24, family: 3 }),
  o("c4h_square", "Dee Okonkwo", "The town hall needs a painted figure and a proverb.", [{ chain: "uli", level: 3, qty: 1 }], { coins: 22, hope: 3 }),
  o("c4h_call", "You", "Hold Nnamdi's hand to the gate. A friend's call in your pocket.", [{ chain: "support", level: 4, qty: 1 }], { coins: 26, family: 4 }),
];

const CH5S_ORDERS = [
  o("c5s_breath", "Counselor Zeribe", "The craving is a wave. Ride it with breath.", [{ chain: "support", level: 2, qty: 1 }], { coins: 20, chain: -3, hope: 2 }),
  o("c5s_call", "Ngozi", "Call her. Her voice is solid ground.", [{ chain: "support", level: 4, qty: 1 }], { coins: 24, family: 3, chain: -2 }),
  o("c5s_kola", "Papa", "He who brings kola brings life. Bring it home.", [{ chain: "kola", level: 5, qty: 1 }], { coins: 28, family: 5 }),
  o("c5s_craft", "{mentor}", "You are late by months. We train harder. Bring your craft.", [{ chain: "craft", level: 4, qty: 1 }], { coins: 26, hope: 4, health: 2 }),
  o("c5s_bless", "Dee Okonkwo", "The umunna's blessing — then the square can hear you.", [{ chain: "support", level: 5, qty: 1 }], { coins: 30, hope: 4, chain: -4 }),
];

const CH5H_ORDERS = [
  o("c5h_sat", "Nnamdi", "Saturday bus. Bring a friend's call and a proverb.", [{ chain: "support", level: 3, qty: 1 }], { coins: 22, family: 3 }),
  o("c5h_night", "Nnamdi", "The thing dey pull me. Talk to me. Biko.", [{ chain: "support", level: 4, qty: 1 }], { coins: 24, hope: 3, chain: -2 }),
  o("c5h_club", "You", "Paint the wall of Guardians of Life.", [{ chain: "uli", level: 4, qty: 1 }], { coins: 26, hope: 4 }),
  o("c5h_square", "Dee Okonkwo", "Two names on the Iri Ji stage. Bring the feast.", [{ chain: "yam", level: 5, qty: 1 }], { coins: 28, family: 4, hope: 3 }),
];

function s(id, start, pauseAfter, cost, title) {
  return { id, start, pauseAfter: pauseAfter || null, cost, title };
}

export const SESSIONS = {
  1: [
    s("c1s1", "l1_1", "l1_6", 18, "Morning in Umuoma"),
    s("c1s2", "l1_7", "l1_9", 22, "Iri Ji night"),
    s("c1s3", "continue", "l1_join", 20, "The road home"),
    s("c1s4", "l1_lesson", null, 16, "One Decision"),
  ],
  2: [
    s("c2s1", "l2_1", "l2_3", 20, "Friday evening"),
    s("c2s2", "continue", "l2_4", 22, "A text from Nnamdi"),
    s("c2s3", "continue", "l2_7", 22, "Oil on the finger"),
    s("c2s4", "l2_lesson", null, 18, "Once In A While"),
  ],
  3: [
    s("c3s1", "l3_gate", "l3_4", 22, "The grip"),
    s("c3s2", "continue", "l3_6", 22, "Who is driving"),
    s("c3s3", "continue", "l3_8", 24, "The river asks"),
    s("c3s4", "continue", "l3_10", 20, "Who are you becoming"),
    s("c3s5", "l3_lesson", null, 18, "The Driver's Seat"),
  ],
  "3h": [
    s("h3s1", "l3_gate", "h3_2", 22, "The signs"),
    s("h3s2", "continue", "h3_3", 22, "How you approach"),
    s("h3s3", "continue", "h3_6", 22, "Keep asking"),
    s("h3s4", "h3_lesson", null, 18, "Seeing the Signs"),
  ],
  4: [
    s("c4s1", "l4_gate", "l4_2", 24, "The arithmetic"),
    s("c4s2", "continue", "l4_6", 24, "Torchlight"),
    s("c4s3", "continue", "l4_9", 24, "Two words"),
    s("c4s4", "continue", null, 20, "What Abuse Costs"),
  ],
  "4h": [
    s("h4s1", "l4_gate", "h4_2", 24, "The wedding"),
    s("h4s2", "continue", "h4_4", 24, "Sickness, not shame"),
    s("h4s3", "continue", "h4_6", 22, "Nobody left behind"),
    s("h4s4", "h4_lesson", null, 18, "How Communities Save People"),
  ],
  5: [
    s("c5s1", "l5_gate", "l5_2", 22, "You are a person healing"),
    s("c5s2", "continue", "l5_4", 24, "The real examination"),
    s("c5s3", "continue", "l5_7", 22, "A hand held out"),
    s("c5s4", "continue", "l5_12", 24, "The final cup"),
    s("c5s5", "continue", null, 20, "Speak at Iri Ji"),
  ],
  "5h": [
    s("h5s1", "l5_gate", "h5_3", 22, "Every Saturday"),
    s("h5s2", "continue", "h5_4", 24, "Both hands"),
    s("h5s3", "continue", "h5_7", 22, "Guardians of Life"),
    s("h5s4", "continue", null, 18, "Two names on the stage"),
  ],
};

export function isHelper(flags) {
  return flags && flags.path === "helper";
}

export function getSessions(level, flags, stats) {
  if (level === 3) {
    if (flags && flags.path === "helper") return SESSIONS["3h"];
    if (flags && flags.path === "struggler") return SESSIONS[3];
    return stats && stats.chain < 20 ? SESSIONS["3h"] : SESSIONS[3];
  }
  if (level === 4) return isHelper(flags) ? SESSIONS["4h"] : SESSIONS[4];
  if (level === 5) return isHelper(flags) ? SESSIONS["5h"] : SESSIONS[5];
  return SESSIONS[level] || SESSIONS[1];
}

export function getOrderPool(level, flags) {
  if (level <= 1) return CH1_ORDERS;
  if (level === 2) return CH2_ORDERS;
  if (level === 3) return isHelper(flags) ? CH3H_ORDERS : CH3S_ORDERS;
  if (level === 4) return isHelper(flags) ? CH4H_ORDERS : CH4S_ORDERS;
  return isHelper(flags) ? CH5H_ORDERS : CH5S_ORDERS;
}

export function fillOrderText(order, player) {
  if (!order) return order;
  const mentor = player && player.dream === "musician"
    ? "Uncle Ikenna"
    : player && player.dream === "engineer"
      ? "Mrs. Adaora"
      : "Coach Emeka";
  const text = (order.text || "").split("{mentor}").join(mentor);
  const from = (order.from || "").split("{mentor}").join(mentor);
  return { ...order, text, from };
}
