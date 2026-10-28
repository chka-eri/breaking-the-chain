// ============================================================
// BREAKING THE CHAIN — Ịgbaji Agbụ
// Full narrative data: 5 chapters, two storylines (Struggler / Helper),
// set in Umuoma, a fictional village on the edge of Owerri, Imo State.
//
// Node types:
//  line      -> scene + speaker + text + next
//  choice    -> prompt + options[] (optional: timed seconds, pressured default)
//  branch    -> cases[{if(state), next}] + defaultNext (resolved silently)
//  minigame  -> game: "craving" | "triggers" + config + next
//  lesson    -> end-of-chapter lesson card (completeLevel)
//  ending    -> hands over to the Ending screen
// ============================================================

export const LEVELS = [
  { n: 1, title: "The First Taste", igbo: "Mmetụ Mbụ", emoji: "🎭", start: "l1_1", blurb: "Iri Ji night. One cup. One choice." },
  { n: 2, title: "Friday Fever", igbo: "Egwu Fraịde", emoji: "🎶", start: "l2_1", blurb: "'Once in a while' begins to repeat itself." },
  { n: 3, title: "The Grip Tightens", igbo: "Agbụ Na-esi Ike", emoji: "⛓️", start: "l3_gate", blurb: "A habit quietly takes the driver's seat." },
  { n: 4, title: "Falling Walls", igbo: "Mgbidi Na-ada", emoji: "🌩️", start: "l4_gate", blurb: "Health, money, trust — everything cracks." },
  { n: 5, title: "Breaking the Chain", igbo: "Ịgbaji Agbụ", emoji: "🕊️", start: "l5_gate", blurb: "The fight back. The road home." },
];

const N = {};

// ============================================================
// CHAPTER 1 — MMETỤ MBỤ (The First Taste)
// ============================================================

N.l1_1 = {
  type: "line", scene: "morning", speaker: "Narrator",
  text: "Umuoma, a village on the red-earth edge of Owerri. Cocks crow over Mama Ify's kiosk, and morning smoke rises like a prayer. You are {name} — nineteen, quick-footed, stubborn with hope. In six weeks: {goal}. Everybody in Umuoma knows your name is going somewhere.",
  next: "l1_2",
};
N.l1_2 = {
  type: "line", scene: "compound", speaker: "Mama Ify",
  text: "{name}! Bia, take this bread to your father before you disappear again. Chineke gave me a child with two right feet and no ears. *she laughs and squeezes your shoulder* Eat something o! Dreams no dey run on empty belle.",
  next: "l1_3",
};
N.l1_3 = {
  type: "line", scene: "compound", speaker: "Papa",
  collect: "prv_stand",
  text: "Nwa m, listen. Ihe kwụrụ, ihe akwụdebe ya — wherever something stands, something else stands beside it. Your talent has stood up. Now discipline must stand beside it. Whatever stands beside your talent... that one will decide your road.",
  next: "l1_4",
};
N.l1_4 = {
  type: "line", scene: "road", speaker: "Ngozi",
  text: "*Ngozi falls into step beside you, school bag swinging* Six weeks to {goal} and you're strolling like a chief on Sunday! I've already told everybody in my mother's shop that I know you personally. Don't embarrass me o, {name}. *she grins* I'm serious. I believe it before you do.",
  next: "l1_5",
};
N.l1_5 = {
  type: "line", scene: "road", speaker: "Nnamdi",
  text: "*Your cousin Nnamdi rolls up on a borrowed okada, all teeth and swagger* Nedu baby! Tonight na tonight! After the masquerades finish for Iri Ji, boys dey gather for Emeka's compound. Correct music, correct vibes. You MUST show. No carry that your serious face come o!",
  next: "l1_6",
};
N.l1_6 = {
  type: "choice", scene: "road", speaker: "Ngozi",
  text: "*Ngozi watches Nnamdi ride off, her smile fading* That Emeka compound crowd... I've heard things, {name}. What will you do tonight?",
  options: [
    { text: "\"I'll go — but only for the music and the yam.\"", sub: "Curiosity is welcome. Caution comes too.", setFlags: { openDoor: true }, next: "l1_7" },
    { text: "\"Festival yes. Emeka's compound... we'll see.\"", sub: "Keep your own counsel.", effects: { hope: 3 }, next: "l1_7" },
  ],
};
N.l1_7 = {
  type: "line", scene: "festival", speaker: "Narrator",
  text: "Iri Ji — the New Yam Festival — swallows Umuoma whole. Ogene and ekwe ring across the square, elders in isiagu break kola under the iroko tree, and the Mmanwụ masquerades spin dust into gold. New yam roasts on every fire. By nightfall, the current of friends pulls you — as currents do — toward the thumping speakers of Emeka's compound.",
  next: "l1_8",
};
N.l1_8 = {
  type: "line", scene: "party", speaker: "Nnamdi",
  text: "*The compound is packed. Phone torches, laughter, a speaker taller than the fence. Nnamdi presses a plastic cup into the circle — a soft drink mixed with something from a brown bottle. 'Confirm,' the boys call it* Nedu! You don land! Small sip make the night sweet. Na juice with small... vitamins. *the circle laughs* Everybody don taste am. You wan fall our hand?",
  next: "l1_9",
};
N.l1_9 = {
  type: "choice", scene: "party", speaker: "You",
  timed: 9,
  text: "The cup floats toward you. The circle chants your name — 'Nedu! Nedu! Nedu!' — and every eye is a small hot torch. Your heart is a drum. Quick — what do you do?",
  options: [
    { text: "Collect the cup. One sip. Just to belong.", sub: "The chant wins.", pressured: true, effects: { chain: 15, health: -4 }, setFlags: { tried1: true }, next: "l1_bad1" },
    { text: "\"Guy, abeg — I get training before cock crow.\"", sub: "You packed your craft.", needKit: "craft", effects: { hope: 5 }, next: "l1_good1" },
    { text: "\"Mba.\" Firm. Friendly. Final.", sub: "You packed a ready no.", needKit: "no", effects: { hope: 6 }, next: "l1_good1" },
    { text: "Take the cup... hold it... don't drink.", sub: "You packed breath.", needKit: "breath", effects: { chain: 6 }, setFlags: { held: true }, next: "l1_hold1" },
    { text: "Slip out and find Ngozi.", sub: "You packed her name.", needKit: "ngozi", effects: { family: 4 }, next: "l1_slip" },
  ],
};
N.l1_bad1 = {
  type: "line", scene: "party", speaker: "Narrator",
  text: "Sweet, then bitter, then warm. The circle roars approval — and twenty minutes later the compound tilts sideways. Laughter arrives from far away, like sound through water. You hold a wall that keeps moving. Somewhere, Nnamdi is saying 'small thing, small thing'... but your legs have stopped listening.",
  next: "l1_bad2",
};
N.l1_bad2 = {
  type: "line", scene: "darknight", speaker: "Dee Okonkwo",
  collect: "prv_goat",
  text: "*You surface on a bench outside. Dee Okonkwo — your grand-uncle, palm-wine tapper, keeper of stories — presses cold water into your hands* Drink. Slowly. *he studies you a long moment* Nwa m, hear me. Ewu ojii ka a na-achọ n'ụtụtụ — the black goat is sought in the morning, before night falls. Whatever begins tonight... finish it in its morning. Night comes faster than young people think.",
  next: "l1_bad3",
};
N.l1_bad3 = {
  type: "line", scene: "morning", speaker: "Narrator",
  effects: { hope: -8, family: -4 },
  text: "Morning arrives like a debt collector: skull pounding, mouth full of sand. You miss the early session with {mentor} — the first you have EVER missed. Mama says nothing as she sets your food down. Her silence has weight. Her eyes have questions.",
  next: "l1_join",
};
N.l1_good1 = {
  type: "line", scene: "party", speaker: "Nnamdi",
  text: "*Nnamdi holds your stare a heartbeat too long, then laughs it away* See this one! Fear fear! *the circle chuckles and moves on... but across the fire, a quiet boy named Chidi nods at you once, like a handshake. Some respect is loud. The best kind is quiet.*",
  next: "l1_good2",
};
N.l1_hold1 = {
  type: "line", scene: "party", speaker: "Narrator",
  text: "You hold the cup and let the party flow around it. When heads turn to the dance circle, you tip it quietly into the sand. Smooth... almost. Nnamdi's eyes catch the last of it. 'Next time,' he grins, 'you no go waste am.' You held the line tonight — but you also learned something uncomfortable: holding the cup at all is standing on the line itself.",
  next: "l1_good2",
};
N.l1_slip = {
  type: "line", scene: "festival", speaker: "Ngozi",
  text: "*You find her by the fireside near the square, roasting yam on a stick* You escaped! *she shifts to make room* Sit. The masquerades are better company than that compound anyway. *the fire pops; the ogene still rings somewhere* You know what I like about you, {name}? When the crowd pulls, you still choose your own direction.",
  next: "l1_good2",
};
N.l1_good2 = {
  type: "line", scene: "festival", speaker: "Dee Okonkwo",
  collect: "prv_goat",
  text: "*At the fireside, Dee Okonkwo lowers himself onto a stool with a tapper's groan* You did well tonight, nwa m. But I am watching your cousin, and I will tell you what the old people say: Ewu ojii ka a na-achọ n'ụtụtụ — search for the black goat in the morning, before night falls. What is starting in Nnamdi... its morning is now. Do not look away from him.",
  next: "l1_join",
};
N.l1_join = {
  type: "line", scene: "road", speaker: "Narrator",
  text: "You walk home under a moon as round as a festival drum. Umuoma sleeps sweetly — but tonight the village learned to whisper a new word, and its name is 'confirm'. Six weeks to {goal}. The road ahead has begun to fork.",
  next: "l1_lesson",
};
N.l1_lesson = {
  type: "lesson", completeLevel: 1,
  lesson: {
    title: "One Decision",
    igbo: "Ihe Mmụta — Chapter One",
    body: "Nobody plans to become dependent. It begins as a cup at a party, passed with laughter, wrapped in belonging. Experimentation is the doorway — and peer pressure is the hand on your back.",
    bullets: [
      "Prepare your 'no' BEFORE the party — a ready answer beats a hot moment.",
      "Real friends survive your refusal. Pressure that punishes 'no' is not friendship.",
      "One early decision can shape an entire future.",
    ],
    proverb: "prv_goat",
  },
};

// ============================================================
// CHAPTER 2 — EGWU FRAỊDE (Friday Fever)
// ============================================================

N.l2_1 = {
  type: "line", scene: "base", speaker: "Narrator",
  text: "Three Fridays pass. Behind the timber market, a shack of benches and blue tarpaulin has earned a name: Kai Base. Phone speakers, cheap cards, smoke that smells like burnt promises. Boys drift there the way water finds a hole. 'Just Fridays,' everyone says. Fridays have a way of multiplying.",
  next: "l2_2",
};
N.l2_2 = {
  type: "line", scene: "road", speaker: "Ngozi",
  text: "*She catches you after school, voice low* Have you looked at Nnamdi lately? Properly looked? His eyes are always red. He borrowed five hundred naira from me and 'forgot'. He quit the choir — NNAMDI, who sang solos! *she hugs her books tighter* Something is eating my friend, {name}, and it started at that Base.",
  next: "l2_3",
};
N.l2_3 = {
  type: "choice", scene: "morning", speaker: "You",
  text: "Friday evening lands heavy after a long week. Your body is tired, your mind is loud. The boys are already heading to Base. How do you spend tonight?",
  options: [
    { text: "Follow the boys to Base — just to belong.", sub: "You won't touch anything. Probably.", pressured: true, effects: { chain: 8, money: -3 }, setFlags: { base1: true }, next: "l2_base" },
    { text: "Extra evening session with {mentor}.", sub: "You packed your craft.", needKit: "craft", effects: { hope: 8 }, next: "l2_work" },
    { text: "Help Mama close the shop, then early sleep.", sub: "You packed home.", needKit: "mama", effects: { family: 6, money: 4 }, next: "l2_home" },
    { text: "Walk with Nnamdi — but not into Base.", sub: "You packed a watchful eye.", needKit: "watch", effects: { family: 4, hope: 2 }, next: "l2_home" },
  ],
};
N.l2_base = {
  type: "line", scene: "base", speaker: "Narrator",
  text: "Base at night: bottle caps in the sand, a card game nobody finishes, highlife remixes rattling a dying speaker. Baros holds court in the corner — older, gold-toothed, generous in the way traps are generous. First taste is always free at Base. It is the second one that begins collecting.",
  next: "l2_base2",
};
N.l2_base2 = {
  type: "choice", scene: "base", speaker: "Nnamdi",
  timed: 8,
  text: "*A thin wrap glows its way around the circle, hand to hand, coming closer* Nedu, this one na correct loud. One drag, wahala go rest. *the wrap arrives at your fingers* Quick — the circle is watching.",
  options: [
    { text: "Drag am. Small one.", sub: "The circle nods approval.", pressured: true, effects: { chain: 12, health: -4 }, setFlags: { tried2: true }, next: "l2_after" },
    { text: "Pass it on. Stay for the music only.", sub: "In the room, not in the habit.", effects: { chain: 2 }, next: "l2_after" },
    { text: "Stand up. \"I dey go house.\" And GO.", sub: "Feet are also a decision.", effects: { hope: 4 }, next: "l2_after" },
  ],
};
N.l2_work = {
  type: "line", scene: "craft", speaker: "Narrator",
  text: "{mentor} works you until the stars come out — drills, corrections, small brutal repetitions that add up to skill. 'THIS,' {mentor} says, tapping your chest, 'this engine? Protect it. I have watched many engines in this town go quiet.' Walking home, your legs ache beautifully. Your phone buzzes: Nnamdi. 'Base dey sweet tonight. You dey miss.'",
  next: "l2_after",
};
N.l2_home = {
  type: "line", scene: "compound", speaker: "Narrator",
  text: "You count change, stack tins, and listen to Mama's shop gossip until the kerosene lamp gets sleepy. Papa nods at you over his newspaper — a whole conversation in one nod. Past midnight, voices stagger along the fence. Through the window you see Nnamdi weaving home, laughing at nothing. His eyes catch yours for one strange second. You barely know them.",
  next: "l2_after",
};
N.l2_after = {
  type: "line", scene: "compound", speaker: "Narrator",
  text: "Sunday morning. Your cousin Uju's Igba Nkwu — her traditional wedding — is two weeks away, and the family is gathering to rehearse: wine-carrying, dance steps, who kneels where. In Igboland, family is not attended. Family is performed. Then your phone lights up: Nnamdi.",
  next: "l2_4",
};
N.l2_4 = {
  type: "choice", scene: "compound", speaker: "Nnamdi",
  text: "'Nedu!! Forget that rehearsal jare — na women matter. Baros dey bring CORRECT package today. Sunday special. All the boys go dey. You dey come abi you no dey come?'",
  options: [
    { text: "Skip rehearsal. Go to Base.", sub: "Family will manage without you... right?", effects: { chain: 10, family: -8 }, setFlags: { skipped: true }, next: "l2_5a" },
    { text: "Go to the rehearsal. Family first.", sub: "Show up where your name lives.", effects: { family: 8, hope: 3 }, next: "l2_5b" },
  ],
};
N.l2_5a = {
  type: "line", scene: "base", speaker: "Narrator",
  text: "Base on a Sunday feels different — quieter, hungrier. You watch Nnamdi pull Baros aside and beg, actually BEG, for a package 'on credit'. Baros smiles like a ledger. 'For you? Anything.' Somewhere across the village, your family is dancing wine-carrying steps without you. A small cold voice asks: which of these two circles is yours?",
  next: "l2_6",
};
N.l2_5b = {
  type: "line", scene: "wedding", speaker: "Narrator",
  text: "The compound overflows: aunties arguing sweetly about jollof, uncles 'testing' the palm wine for quality control, Uju glowing like new bronze. You carry the practice wine cup across the circle and the whole family cheers your footwork. One face is missing. 'Where is Nnamdi?' his mother keeps asking, holding her smile up like a heavy tray. Nobody has an answer.",
  next: "l2_6",
};
N.l2_6 = {
  type: "line", scene: "market", speaker: "Narrator",
  text: "Market day at Eke Ukwu. Between the fish crates and tomato pyramids, the whisper travels faster than price: a boy from Amaeke was found at the motor park, raving, fighting shadows, skin and bone. The market women lower their voices to say the name of the thing: mkpụrụ mmiri. Crystal. The seed of water. 'It has entered our side,' they say, and the tomatoes suddenly look like a funeral.",
  next: "l2_7",
};
N.l2_7 = {
  type: "line", scene: "compound", speaker: "Dee Okonkwo",
  collect: "prv_oil",
  text: "*Evening. Dee Okonkwo splits kola by the fire and hands you a piece* You have heard what is moving in the market. So hear this also: Otu mkpịsị aka rụta mmanụ, o zuo ọha ọnụ — when one finger touches oil, it stains all the others. No one 'manages' these things alone, nwa m. One finger becomes a hand. A hand becomes a family. Guard the finger.",
  next: "l2_lesson",
};
N.l2_lesson = {
  type: "lesson", completeLevel: 2,
  lesson: {
    title: "Once In A While",
    igbo: "Ihe Mmụta — Chapter Two",
    body: "'Only on Fridays' is how a visitor becomes a tenant. Social use builds a rhythm, and rhythm builds a road. Meanwhile the cost is quietly billed to everything you love: your craft, your money, your seat at the family circle.",
    bullets: [
      "Watch the calendar: when 'sometimes' gets a fixed day, it is becoming a habit.",
      "Every yes to the Base is a silent no to something — count what you are trading.",
      "Warning signs in a friend (red eyes, borrowing, quitting passions) are a call to act early.",
    ],
    proverb: "prv_oil",
  },
};

// ============================================================
// GATE — the road forks silently based on your first two chapters
// ============================================================

N.l3_gate = {
  type: "branch",
  cases: [{ if: (s) => s.stats.chain >= 20, next: "l3_1" }],
  defaultNext: "h3_1",
};

// ============================================================
// CHAPTER 3A — AGBỤ NA-ESI IKE (The Grip Tightens) — Struggler path
// ============================================================

N.l3_1 = {
  type: "line", scene: "craft", speaker: "Narrator",
  setFlags: { path: "struggler" },
  effects: { hope: -10 },
  text: "The big day came. {goal} — the date you circled in red. You arrived late, eyes gritty, hands not quite yours, heart beating in the wrong rhythm. You performed like a photocopy of yourself. The examiners of life do not reschedule. On the bus home you stared at your hands and thought: next year. There is always next year. That sentence tasted like the cup at Emeka's compound.",
  next: "l3_2",
};
N.l3_2 = {
  type: "line", scene: "darknight", speaker: "Narrator",
  effects: { chain: 8 },
  text: "Somewhere in the weeks that follow, the order of things quietly reverses. Before, you used on the way to living. Now you use in order to live: a sip to face the field, a drag to face people, something small to face sleep itself. Nobody announced it. The chain does not announce. It tightens.",
  next: "l3_3",
};
N.l3_3 = {
  type: "line", scene: "compound", speaker: "Mama Ify",
  text: "*Mama stands very still behind the shop counter, the drawer open* {name}. Two thousand naira was in this drawer when I went to greet Mama Nkechi. *her voice is quiet, which is worse than shouting* I am asking you once, as your mother. Where is it?",
  next: "l3_4",
};
N.l3_4 = {
  type: "choice", scene: "compound", speaker: "You",
  text: "Her eyes hold yours. The truth is: it went to Base. What do you say?",
  options: [
    { text: "\"Mama, I no touch am. Maybe customer...\"", sub: "Lie to the woman who made you.", effects: { family: -10, chain: 4 }, setFlags: { lied: true }, next: "l3_5" },
    { text: "\"I borrowed it... for training things. Sorry.\"", sub: "Half-truth. Half-shame.", effects: { family: -5 }, next: "l3_5" },
    { text: "Tell the whole truth. All of it.", sub: "Let the wound breathe air.", effects: { family: 6, hope: 2 }, setFlags: { confessed: true }, next: "l3_5" },
  ],
};
N.l3_5 = {
  type: "line", scene: "craft", speaker: "Narrator",
  text: "*{mentor} pulls you aside after a session you barely survived* 'I have trained a hundred young people. I know the difference between tired and LOST. Your body is here, {name}. Your fire is not. I am not asking what you're doing — I am telling you I have seen where it ends.' The silence after is a mirror.",
  next: "l3_6",
};
N.l3_6 = {
  type: "choice", scene: "craft", speaker: "You",
  text: "{mentor} waits. This person believed in you before you did. What do you give back?",
  options: [
    { text: "\"Give me two weeks. I go show you fire.\" — and MEAN it.", sub: "A promise with teeth.", effects: { hope: 6 }, setFlags: { promised: true }, next: "l3_7" },
    { text: "Nod, promise... then skip the next session for Base.", sub: "The chain votes for you.", effects: { chain: 10, hope: -6 }, next: "l3_7" },
    { text: "\"You no understand ANYTHING about my life!\"", sub: "Burn the bridge that carried you.", effects: { hope: -8, family: -4 }, next: "l3_7" },
  ],
};
N.l3_7 = {
  type: "line", scene: "stream", speaker: "Ngozi",
  collect: "prv_ask",
  text: "*She finds you at the Otamiri bank, where the two of you used to race paper boats* I'm not here to preach, {name}. I'm here because... it's you. *the river slides past, patient* My grandmother says: Onye ajụjụ anaghị efu ụzọ — the one who asks questions never loses the way. Asking for help is not weakness. It's a map. *she turns to face you fully* So I'm asking. What is happening to you?",
  next: "l3_8",
};
N.l3_8 = {
  type: "choice", scene: "stream", speaker: "You",
  text: "The river waits. Ngozi waits. The truth sits in your chest like a stone with edges.",
  options: [
    { text: "Open the door. Tell her everything.", sub: "The stone leaves your chest.", effects: { chain: -6, family: 8, hope: 4 }, setFlags: { opened: true }, next: "l3_9" },
    { text: "\"Leave me alone, Ngozi. Face your books.\"", sub: "Push away the hand on the rope.", effects: { family: -10 }, setFlags: { pushedNgozi: true }, next: "l3_9" },
  ],
};
N.l3_9 = {
  type: "line", scene: "base", speaker: "Narrator",
  effects: { chain: 6, health: -4 },
  text: "At Base, a new guest is passed around: tramadol — 'for energy', they say, 'for confidence'. The nights begin to blur into each other like wet ink. Nnamdi no longer goes home between Fridays; Base has become his address. One evening you catch your reflection in a dead phone screen and, for a half-second, you genuinely do not recognize the face.",
  next: "l3_10",
};
N.l3_10 = {
  type: "line", scene: "darknight", speaker: "Narrator",
  text: "Deep in the night, the oldest voice in you — call it chi, call it conscience — asks its quiet question, the one it will keep asking: 'Nwa m... who are you becoming?' You lie still and listen to your own heartbeat, and for the first time in months, you are afraid of the answer.",
  next: "l3_lesson",
};
N.l3_lesson = {
  type: "lesson", completeLevel: 3,
  lesson: {
    title: "The Driver's Seat",
    igbo: "Ihe Mmụta — Chapter Three",
    body: "Regular use reverses the order of a life: first you used on the way to living, now you use in order to live. Performance falls, money leaks, trust cracks — and the habit begins making your decisions for you.",
    bullets: [
      "When you need a substance to feel 'normal', dependence has already begun.",
      "Secrets and stolen money are the habit protecting itself — not you.",
      "The people confronting you are not enemies. They are the rope. Hold the rope.",
    ],
    proverb: "prv_ask",
  },
};

// ============================================================
// CHAPTER 3B — IHE NGOSI (The Signs) — Helper path
// ============================================================

N.h3_1 = {
  type: "line", scene: "craft", speaker: "Narrator",
  setFlags: { path: "helper" },
  effects: { hope: 6 },
  text: "Your discipline holds — and it pays. {mentor} starts using your name as an example. {goal} goes... well. Not perfectly, but well enough that the road ahead has lights on it. Yet one shadow keeps crossing your joy: Nnamdi. Your cousin is disappearing in plain sight, one Friday at a time.",
  next: "h3_2",
};
N.h3_2 = {
  type: "minigame", game: "triggers", next: "h3_3",
  config: {
    mode: "signs",
    title: "Spot the Warning Signs",
    prompt: "Think about Nnamdi these past weeks. Which of these are true warning signs of a growing drug problem? Select all that apply.",
    items: [
      { text: "Eyes always red; sleeps at odd hours", correct: true },
      { text: "Borrowing money and 'forgetting' to repay", correct: true },
      { text: "Quit the choir he once loved", correct: true },
      { text: "New circle of friends — all from Base", correct: true },
      { text: "Mood swings: laughing, then flaring in anger", correct: true },
      { text: "Secretive about where he spends evenings", correct: true },
      { text: "He enjoys football on Saturdays", correct: false },
      { text: "He eats roasted yam with palm oil", correct: false },
    ],
    reveal: "Red eyes, money leaks, abandoned passions, a new closed circle, mood swings, secrecy — any TWO of these together deserve attention. Nnamdi is showing nearly all of them. The black goat must be sought in the morning.",
  },
};
N.h3_3 = {
  type: "choice", scene: "road", speaker: "You",
  text: "You decide to act — but HOW you approach a struggling person can open the door or weld it shut. Nnamdi is at the village square, alone for once.",
  options: [
    { text: "Confront him publicly: \"You dey craze? You wan die?\"", sub: "Loud concern. Public shame.", effects: { family: -4 }, setFlags: { harsh: true }, next: "h3_4a" },
    { text: "Sit with him alone: \"Nna, I dey your side. Talk to me.\"", sub: "Private. Patient. No judgment.", effects: { family: 6, hope: 3 }, setFlags: { gentle: true }, next: "h3_4b" },
    { text: "Go straight to his father and report everything.", sub: "Skip him. Alert the elders.", next: "h3_4c" },
  ],
};
N.h3_4a = {
  type: "line", scene: "square", speaker: "Nnamdi",
  text: "*His face slams shut like a gate* You too?! You wan preach for me for public?! *he backs away, laughing a laugh with no floor in it* Face your {goal}, superstar. I dey ALRIGHT. *he walks off toward the timber market... toward Base. You learn a hard lesson: shame does not open doors. It locks them from inside.*",
  next: "h3_5",
};
N.h3_4b = {
  type: "line", scene: "square", speaker: "Nnamdi",
  text: "*He starts with jokes. You wait. The jokes run out* ...E start like play, Nedu. Like PLAY. Now if I no take am, my body dey vex me. My chest. My head. *his hands tremble slightly* I no fit tell my papa. He go kill me before the thing kill me. *he looks at you, and for one second he is eight years old again* You think say person fit... comot from this thing?",
  next: "h3_5",
};
N.h3_4c = {
  type: "line", scene: "compound", speaker: "Narrator",
  text: "His father's compound erupts. Shouting, a raised hand, threats of deliverance by force. Nnamdi climbs the fence and vanishes for three days. When he returns, he speaks to no one — least of all you. The elders NEEDED to know... but you learn the sequence matters: reach the person first, then bring the family in WITH care, or the fire scatters instead of warming.",
  next: "h3_5",
};
N.h3_5 = {
  type: "line", scene: "compound", speaker: "Dee Okonkwo",
  collect: "prv_ask",
  text: "*Dee Okonkwo listens to everything, nodding slowly over his snuff* You are learning, nwa m. Onye ajụjụ anaghị efu ụzọ — one who asks questions never loses the way. So keep asking: ask him, ask the health people at Owerri, ask me. Shame keeps sickness hidden. Questions bring it into the light where it can be treated. And nwa m... guard your own cup at those gatherings. The helper who falls helps no one.",
  next: "h3_6",
};
N.h3_6 = {
  type: "line", scene: "craft", speaker: "Narrator",
  text: "You keep training — {mentor} insists your own flame stays first. But now your evenings hold a second project: learning everything about the thing eating your cousin. What it is. Where help lives. Who to call. You are becoming something Umuoma needs badly and names rarely: a young person who SEES.",
  next: "h3_lesson",
};
N.h3_lesson = {
  type: "lesson", completeLevel: 3,
  lesson: {
    title: "Seeing the Signs",
    igbo: "Ihe Mmụta — Chapter Three",
    body: "Most people in trouble are begging for help in every language except words. Learn to read the signs early — and learn that HOW you approach matters as much as THAT you approach.",
    bullets: [
      "Two or more warning signs together = time to act, gently and early.",
      "Private care opens doors. Public shame welds them shut.",
      "Involve elders and professionals WITH the person, not against them.",
    ],
    proverb: "prv_ask",
  },
};

// ============================================================
// GATE 4
// ============================================================

N.l4_gate = {
  type: "branch",
  cases: [{ if: (s) => s.flags.path === "helper", next: "h4_1" }],
  defaultNext: "l4_1",
};

// ============================================================
// CHAPTER 4A — MGBIDI NA-ADA (Falling Walls) — Struggler path
// ============================================================

N.l4_1 = {
  type: "line", scene: "darknight", speaker: "Narrator",
  effects: { money: -15, family: -8 },
  text: "The arithmetic of the chain: you owe Baros fifteen thousand naira. Your phone is 'lost' — sold at the second-hand stall behind Eke Ukwu. At dinner, Papa no longer asks how training went. He simply looks at his food. His silence is the loudest sound in the compound. In Igboland they say a father's silence can bend a roof.",
  next: "l4_2",
};
N.l4_2 = {
  type: "choice", scene: "base", speaker: "Baros",
  timed: 8,
  text: "*Baros drapes an arm around your shoulder, friendly as a snare* Nedu, Nedu. You dey owe, but I like you, so — free taste. *he opens his palm: small crystals, cloudy as a dead eye. Mkpụrụ mmiri* This one? You go forget EVERYTHING wey dey pain you. Even your own name.",
  options: [
    { text: "Take it. Forget everything.", sub: "The bottom has a basement.", pressured: true, effects: { chain: 18, health: -10 }, setFlags: { meth: true }, next: "l4_3" },
    { text: "\"NO.\" — Whatever is in you says it loudly.", sub: "Even a drowning person can refuse an anchor.", effects: { chain: 2 }, next: "l4_3" },
  ],
};
N.l4_3 = {
  type: "line", scene: "market", speaker: "Narrator",
  effects: { health: -8 },
  text: "Market day, Eke Ukwu. Heat, noise, the smell of dry fish — then the ground tilts like a canoe and the tomato pyramid rushes up to meet you. You wake on the floor of a chemist's shop with strangers fanning you, and hear a market woman say, without cruelty, the sentence you cannot unhear: 'Is that not Mama Ify's child? Chai. That woman's child, finishing like this.'",
  next: "l4_4",
};
N.l4_4 = {
  type: "line", scene: "clinic", speaker: "Nurse Amara",
  text: "*Nurse Amara checks your pulse a third time, then sits directly in front of you* Listen to me, because I will say it once and with love. Your body is nineteen doing the paperwork of fifty. Syrup burns the liver. Tramadol bullies the brain. And that crystal moving around town? It does not rent people. It BUYS them. *she holds your gaze* You are still here. That means it is not too late. It is almost too late. Those are different things.",
  next: "l4_5",
};
N.l4_5 = {
  type: "line", scene: "ndlea", speaker: "Narrator",
  text: "Nights later, Base detonates into torchlight and sirens — NDLEA. Boys scatter through the timber sheds like startled fish. You run on instinct, lungs tearing, and behind you hear Nnamdi's voice go up and then get cut short. The night splits into two kinds of people: those who ran, and those who got caught. You are not yet sure which kind was luckier.",
  next: "l4_6",
};
N.l4_6 = {
  type: "choice", scene: "ndlea", speaker: "You",
  text: "Torchlight sweeps the alleys. Your legs have carried you to the edge of the old Mbari house — the sacred clay figures watching from the dark. Decide. NOW.",
  options: [
    { text: "Hide inside the Mbari house until dawn.", sub: "Safe... under the painted eyes of the ancestors.", effects: { hope: -4 }, setFlags: { hidMbari: true }, next: "l4_7" },
    { text: "Stop running. Walk toward the officers.", sub: "Whatever comes... let it come.", effects: { hope: 4 }, setFlags: { facedNdlea: true }, next: "l4_7" },
  ],
};
N.l4_7 = {
  type: "line", scene: "family", speaker: "Papa",
  collect: "prv_fall",
  text: "*The family meeting. Kola sits untouched. Aunties, uncles, Dee Okonkwo — and Papa, who has not spoken to you in weeks, now stands* Everyone here knows why we have gathered. So I will say only this. *his voice is gravel and grief* Ọdịda abụghị njedebe ụzọ. A fall is not the end of the road. *he looks at you for the first time in a long time* I did not raise a finished person. I raised a person who can STAND UP.",
  next: "l4_8",
};
N.l4_8 = {
  type: "line", scene: "stream", speaker: "Dee Okonkwo",
  collect: "prv_kin",
  text: "*Midnight, Otamiri bank. You came to be alone with the black water and the too-many thoughts. A lantern approaches: Dee Okonkwo, who somehow always knows* I am not here to talk, nwa m. I am here so you are not alone. *he sets the lantern down; the river breathes* Onye aghana nwanne ya. Let no one leave their kin behind. You have never once been alone in this. You only believed you were.",
  next: "l4_9",
};
N.l4_9 = {
  type: "choice", scene: "stream", speaker: "You",
  text: "The lantern hisses softly. The river moves like something patient. Two words sit in your mouth, the heaviest and lightest words in any language.",
  options: [
    { text: "Say them: \"Help me.\"", sub: "You packed the two words.", needKit: "help", effects: { hope: 8, family: 8, chain: -5 }, setFlags: { accepted: true }, next: "l4_10" },
    { text: "\"I fit handle am myself.\"", sub: "The oldest lie in the world.", effects: { chain: 8 }, next: "l4_10b" },
  ],
};
N.l4_10 = {
  type: "line", scene: "morning", speaker: "Narrator",
  text: "Morning. A small bag, packed by Mama with the tenderness of someone wrapping a wound. The state program Nurse Amara registered you with has a bed: Hope Recovery Centre, Owerri. As the bus pulls out, Umuoma slides past the window — the square, the iroko, the timber market — and you press your palm flat against the glass like a promise.",
  next: "l4_lesson",
};
N.l4_10b = {
  type: "line", scene: "darknight", speaker: "Narrator",
  effects: { family: 4, health: -5 },
  text: "Two more weeks prove you wrong in the oldest way. They find you asleep at the motor park, thinner, greyer, gone quieter than you have ever been. Nobody shouts. Mama simply takes your hand as if you were five again, and the family walks you — together, one body — to the bus for Owerri. Love, it turns out, did not wait for you to deserve it.",
  next: "l4_lesson",
};
N.l4_lesson = {
  type: "lesson", completeLevel: 4,
  lesson: {
    title: "What Abuse Costs",
    igbo: "Ihe Mmụta — Chapter Four",
    body: "Harmful use sends its bills everywhere at once: the body (collapse, organ damage), the pocket (debt, theft), the family name, and finally the law. But even at the bottom, the door marked HELP is never locked from the outside.",
    bullets: [
      "Debt to a dealer is a leash — generosity from a Baros is never generosity.",
      "Mkpụrụ mmiri does not rent people. It buys them. Refuse at ANY depth.",
      "'Help me' — two words — is the strongest sentence a person can say.",
    ],
    proverb: "prv_kin",
  },
};

// ============================================================
// CHAPTER 4B — Helper path
// ============================================================

N.h4_1 = {
  type: "line", scene: "wedding", speaker: "Narrator",
  text: "Uju's Igba Nkwu arrives in full colour — george wrappers, coral beads, a canopy of drums. Uju carries the wine cup through the circle to find her husband, and the village ROARS. Then, at the edge of the canopy: commotion. A body moving wrongly against the music. Nnamdi — eyes wide as lanterns, shouting at people who are not there. Someone screams. Someone else shouts the cruel word: 'Onye ara! Madman!'",
  next: "h4_2",
};
N.h4_2 = {
  type: "choice", scene: "wedding", speaker: "You",
  timed: 8,
  text: "Nnamdi crashes into the drinks table and goes down, shaking. The crowd surges — some to gawk, some to flee, one uncle raising a stick 'to hold him'. Three heartbeats to decide.",
  options: [
    { text: "Take charge: crowd BACK, turn him on his side, send a fast runner for Nurse Amara.", sub: "Airway. Safety. Help. In that order.", effects: { hope: 6, family: 4 }, setFlags: { firstAid: true }, next: "h4_3" },
    { text: "Freeze. It is too much, too fast.", sub: "The crowd decides instead.", pressured: true, effects: { hope: -3 }, next: "h4_3" },
    { text: "Splash water on him and slap him 'awake'.", sub: "Folk first-aid. Feels right. Isn't.", effects: { hope: -2 }, next: "h4_3" },
  ],
};
N.h4_3 = {
  type: "line", scene: "clinic", speaker: "Nurse Amara",
  text: "*Later, at the clinic, Nnamdi stabilized behind her* Whoever kept that crowd off him tonight — that is the only reason we are not planning a burial. *she addresses the gathered relatives, voice like a firm hand* Hear me, all of you: this is SICKNESS, not spiritual attack alone, and NOT a character verdict. Shame will kill this boy faster than the chemical. If we hide him, we lose him. If we help him, we keep him.",
  next: "h4_4",
};
N.h4_4 = {
  type: "choice", scene: "family", speaker: "You",
  text: "Nnamdi's father paces the compound like a wounded lion. 'I will BEAT it out of him!' he thunders. 'Or we lock him in the village until it leaves him!' The family looks at you — the one who was there, the one who has been learning. Speak.",
  options: [
    { text: "\"Papa Nnamdi — treatment AND prayers. Rehab in Owerri, family beside him. Both hands.\"", sub: "Science and faith, together.", effects: { family: 6, hope: 4 }, setFlags: { advocated: true }, next: "h4_5" },
    { text: "Say nothing. It is not your household.", sub: "Respectful... and absent.", effects: { hope: -3 }, next: "h4_5" },
    { text: "\"Beating him is IGNORANT!\" — shout it.", sub: "Right message. Broken delivery.", effects: { family: -4 }, next: "h4_5" },
  ],
};
N.h4_5 = {
  type: "line", scene: "square", speaker: "Narrator",
  collect: "prv_fall",
  text: "That month, the state moves: a town hall at the square — NDLEA officers, a counselor from Owerri, the Governor's youth office. Dee Okonkwo rises, splits kola, and says to the whole village what he once said to one boy: 'Ọdịda abụghị njedebe ụzọ — a fall is not the end of the road. Our children who fell are still OUR children.' You watch mothers in the crowd start to breathe again. Base feels smaller that night. Baros' bench, emptier.",
  next: "h4_6",
};
N.h4_6 = {
  type: "line", scene: "rehab", speaker: "Nnamdi",
  collect: "prv_kin",
  text: "*Admission day, Hope Recovery Centre, Owerri. Nnamdi in clean clothes, scared as a first day of school, grips your hand at the gate* Nedu. *his voice cracks* No forget me for here o. *You grip back, hard* Onye aghana nwanne ya — nobody leaves their kin behind. I go dey come every Saturday. Every single Saturday, Nnamdi. *And you will keep that promise.*",
  next: "h4_lesson",
};
N.h4_lesson = {
  type: "lesson", completeLevel: 4,
  lesson: {
    title: "How Communities Save People",
    igbo: "Ihe Mmụta — Chapter Four",
    body: "A crisis is where stigma and love fight in the open. Crowds shame, sticks 'discipline', fear hides — but knowledge acts: protect the person, call health workers, then organize family and community around treatment.",
    bullets: [
      "In a collapse: clear the crowd, lay them on their side, send for medical help. No slaps, no water, no sticks.",
      "Say it everywhere: dependence is sickness, not spiritual verdict — treatment works.",
      "Fight stigma out loud. Stigma is the dealer's best friend.",
    ],
    proverb: "prv_kin",
  },
};

// ============================================================
// GATE 5
// ============================================================

N.l5_gate = {
  type: "branch",
  cases: [{ if: (s) => s.flags.path === "helper", next: "h5_1" }],
  defaultNext: "l5_1",
};

// ============================================================
// CHAPTER 5A — ỊGBAJI AGBỤ (Breaking the Chain) — Struggler path
// ============================================================

N.l5_1 = {
  type: "line", scene: "rehab", speaker: "Counselor Zeribe",
  text: "*Hope Recovery Centre. Mango trees, swept sand, a circle of plastic chairs. Counselor Zeribe has a handshake like a promise* Welcome, {name}. Let us set one thing straight before anything else: dependence is a sickness of body and spirit — and BOTH can be treated. You are not a criminal here. You are not a disgrace here. You are a person, healing. The work is real. So is the way out.",
  next: "l5_2",
};
N.l5_2 = {
  type: "minigame", game: "triggers", next: "l5_3",
  config: {
    mode: "personal",
    title: "Know Your Triggers",
    prompt: "Counselor Zeribe slides a paper across: 'The chain pulls hardest at specific moments. Name yours, {name}. Naming them takes half their power.' Select the moments that pull at YOU.",
    items: [
      { text: "Friday evenings, when the boys gather" },
      { text: "After failure or bad news" },
      { text: "Certain friends... certain benches" },
      { text: "Boredom — long empty evenings" },
      { text: "Stress before big moments" },
      { text: "Loneliness, late at night" },
    ],
    reveal: "Good. These are YOUR red-flag moments. The plan: see them coming, and meet each one with a counter-move — training, people who feed you, a call, a walk, a task. A named trigger is a disarmed trap.",
  },
};
N.l5_3 = {
  type: "line", scene: "rehab", speaker: "Narrator",
  text: "Day nine. The craving arrives like harmattan fire through dry grass — sudden, total, roaring in the blood. Your hands shake. Your skin itches from inside. Every clever voice in your head becomes a lawyer for the chain: 'Just once. To survive today. Who will know?' This is the real examination. Everything else was registration.",
  next: "l5_4",
};
N.l5_4 = {
  type: "minigame", game: "craving", next: "l5_5",
  config: { framing: "self", rounds: 3 },
};
N.l5_5 = {
  type: "choice", scene: "rehab", speaker: "Counselor Zeribe",
  text: "'Assignment,' Zeribe says, handing you paper and a pen that has seen many storms. 'Write to your mother. Not to impress. To be TRUE.' The page waits, white as morning.",
  options: [
    { text: "\"Mama... I have shamed you. I am sorry.\"", sub: "Shame speaks first.", effects: { family: 4 }, next: "l5_6" },
    { text: "\"Mama, I am sick, and I am FIGHTING to be well. Thank you for not letting go of me.\"", sub: "Truth, standing upright.", effects: { family: 8, hope: 4 }, next: "l5_6" },
    { text: "Not yet. Fold the paper. Some words need more days.", sub: "Honesty about not being ready is also honesty.", effects: { hope: 1 }, next: "l5_6" },
  ],
};
N.l5_6 = {
  type: "line", scene: "rehab", speaker: "Nnamdi",
  text: "*Visiting day. Nnamdi appears under the mango tree — thinner, jumpier, eyes doing arithmetic* Nedu! See you, looking fresh! *the old grin flickers* Abeg... you go fit find me small change? For transport. *his eyes slide away from yours, and you both hear the truth underneath: it is not for transport.*",
  next: "l5_7",
};
N.l5_7 = {
  type: "choice", scene: "rehab", speaker: "You",
  text: "Your cousin. Your childhood. Your first pusher — and the first person you ever saw fall. What do you do with the hand he is holding out?",
  options: [
    { text: "Give him the money. He is family.", sub: "Love... aimed at the wrong target.", effects: { chain: 4, family: -2 }, next: "l5_8" },
    { text: "\"No money, Nna. But walk with me — Counselor Zeribe dey here. TODAY fit be your morning.\"", sub: "Refuse the leash. Offer the rope.", effects: { hope: 6, family: 4 }, setFlags: { helpedNnamdi: true }, next: "l5_8" },
    { text: "\"Nnamdi... I can't be near this yet. I'm sorry.\"", sub: "A boundary is also medicine.", effects: { hope: 3 }, setFlags: { boundary: true }, next: "l5_8" },
  ],
};
N.l5_8 = {
  type: "line", scene: "rehab", speaker: "Counselor Zeribe",
  collect: "prv_chi",
  text: "*Evening circle. Zeribe asks who will share. Your hand rises before your fear can vote. You tell it — the cup, the Fridays, the drawer, the market floor, the river. Nobody flinches. When you finish, Zeribe nods slowly* In Igbo we say: Onye kwe, chi ya ekwe. When a person says YES, their chi says yes WITH them. Tonight, {name}, heaven heard you agree with your own healing.",
  next: "l5_9",
};
N.l5_9 = {
  type: "line", scene: "compound", speaker: "Papa",
  effects: { family: 8 },
  text: "*First home visit. The compound smells of egusi and rain. On the table: kola nut, alligator pepper, a bottle of palm wine from Dee Okonkwo's best tree. Papa lifts the kola* Onye wetara ọjị wetara ndụ — he who brings kola brings life. *he breaks it, hands you the first lobe, and his voice finally cracks open* Welcome home, nwa m. Welcome HOME.",
  next: "l5_10",
};
N.l5_10 = {
  type: "line", scene: "craft", speaker: "Narrator",
  effects: { hope: 6, health: 5 },
  text: "Recovery is unglamorous and holy: dawn runs while the village sleeps, water instead of 'confirm', Saturdays with the counselor, slow honest work with {mentor} — who simply says 'you're late by three months, so we train four times harder' and hides a smile. Ngozi walks the Otamiri path with you on Sundays. Week by week, your body remembers whose it is.",
  next: "l5_11",
};
N.l5_11 = {
  type: "line", scene: "wedding", speaker: "Narrator",
  text: "December. The village swells with returnees — Umuoma's famous December Rush. A cousin's engagement party fills a compound with drums and jollof smoke, and there, by the fence, the old circle: familiar laughter, familiar smoke... and Baros, gold tooth flashing, already pouring a cup as he sees you. 'NEDU! The prodigal! Come — old times.' The cup crosses the crowd toward you. The night holds its breath.",
  next: "l5_12",
};
N.l5_12 = {
  type: "choice", scene: "wedding", speaker: "You",
  timed: 10,
  text: "The final examination. The cup, the smile, the pull of every Friday you ever surrendered. But this time you come armed — with tools, with people, with proverbs that live in your chest. Choose.",
  options: [
    { text: "\"I no dey again, Baros.\" — turn, walk to the dance circle, and DANCE.", sub: "Joy is the loudest refusal.", effects: { chain: -10, hope: 8 }, setFlags: { finalWin: true }, next: "l5_13" },
    { text: "Hold the cup... for old times' sake...", sub: "The chain only ever needs one link.", pressured: true, effects: { chain: 15 }, setFlags: { slipped: true }, next: "l5_relapse" },
    { text: "Laugh: \"Ewu ojii, Baros — na morning we dey find am!\" — and go find Ngozi.", sub: "Answer a trap with a proverb.", effects: { chain: -10, family: 6 }, setFlags: { finalWin: true }, next: "l5_13" },
  ],
};
N.l5_relapse = {
  type: "line", scene: "darknight", speaker: "Narrator",
  effects: { chain: -5, hope: 4 },
  text: "One sip — and the shame arrives before the taste even fades, cold and total. You put the cup down and walk into the dark. But here is what recovery has changed in you: at sunrise you are outside the counselor's office, saying the sentence that saves lives: 'I slipped. Help me adjust the plan.' Zeribe nods, unsurprised, unangry: 'A slip is a SIGNAL, not a sentence. Ọdịda abụghị njedebe ụzọ. We continue.' And you do.",
  next: "l5_13",
};
N.l5_13 = {
  type: "line", scene: "square", speaker: "Narrator",
  text: "Iri Ji returns — one full year since the cup at Emeka's compound. The square glitters with masquerades and new yam smoke, and this year there is a small stage: the state youth office, an NDLEA banner, and a microphone that somehow has YOUR name on it. You look at the crowd — the market women, the boys from Base, Mama holding Papa's arm, Ngozi front and center — and you begin: 'My name is {name}. One year ago, at this festival, somebody handed me a cup...'",
  next: "l5_end",
};
N.l5_end = { type: "ending" };

// ============================================================
// CHAPTER 5B — Helper path
// ============================================================

N.h5_1 = {
  type: "line", scene: "rehab", speaker: "Narrator",
  text: "You keep the promise: every Saturday, the bus to Owerri, the mango tree, the plastic chairs. Some visits Nnamdi is bright as before; some visits he is a closed shutter. The counselors teach you the family sessions: how recovery climbs and dips, how to listen without fixing, how love and firmness ride the same bicycle. The Governor's youth office runs peer-supporter workshops on Saturdays — you enroll without telling anyone.",
  next: "h5_2",
};
N.h5_2 = {
  type: "line", scene: "darknight", speaker: "Nnamdi",
  text: "*Your phone rings past midnight. Nnamdi's voice, stretched thin as wire* Nedu. E dey pull me. *breathing, ragged* The thing dey PULL me. Day pass wey I no think about am — today e come back with soldiers. I never comot the gate... but my leg dey find road. *a shaky pause* Talk to me, Nna. Biko. Just... talk to me.",
  next: "h5_3",
};
N.h5_3 = {
  type: "minigame", game: "craving", next: "h5_4",
  config: { framing: "friend", rounds: 3 },
};
N.h5_4 = {
  type: "choice", scene: "family", speaker: "Narrator",
  text: "Week ten. Nnamdi's father, tired of fees and whispers, wants to pull him out early — 'We will finish it with deliverance alone. The church is cheaper than Owerri.' The family looks to you, the one who has sat in the sessions. Your word carries weight now. Use it.",
  options: [
    { text: "\"Papa Nnamdi — let the treatment FINISH. And let the church pray beside it. Both hands carry this load.\"", sub: "Respect + evidence.", effects: { family: 6, hope: 4 }, next: "h5_5" },
    { text: "Stay silent. Elders have decided.", sub: "Deference... at Nnamdi's expense.", effects: { hope: -3 }, next: "h5_5" },
    { text: "\"With respect — pulling him now is how we bury him later.\"", sub: "Blunt truth, sharpened.", effects: { family: 2 }, next: "h5_5" },
  ],
};
N.h5_5 = {
  type: "line", scene: "rehab", speaker: "Nnamdi",
  collect: "prv_chi",
  text: "*Ninety days. A small ceremony under the mango tree: each finisher speaks one sentence. Nnamdi stands, steadier than you have seen him since childhood, and finds your face in the crowd* Onye kwe, chi ya ekwe. *his voice holds* I don kwe. My chi don kwe. *and the circle answers like a village: ISEE! — so be it. You clap until your palms burn.*",
  next: "h5_6",
};
N.h5_6 = {
  type: "line", scene: "square", speaker: "Narrator",
  effects: { hope: 8, family: 6 },
  text: "Home again, the two of you build the thing Umuoma never had: 'Ndị Nchekwa Ndụ' — Guardians of Life. Saturday football at the school field, open talks under the iroko, a wall of proverbs painted by the art students, a quiet WhatsApp line any young person can message. The state youth office sends materials; Nurse Amara teaches first response; Dee Okonkwo supplies proverbs and supervision-by-eyebrow. Week by week, Baros' bench grows emptier.",
  next: "h5_7",
};
N.h5_7 = {
  type: "line", scene: "square", speaker: "Narrator",
  text: "Iri Ji returns — one full year. On the festival stage, beside the NDLEA banner and the commissioner's delegation, two names are called together: yours and Nnamdi's. His father — the man who once raised a stick — now raises kola: 'Onye wetara ọjị wetara ndụ. These children brought our children LIFE.' Nnamdi grips the mic, grins at you, and opens with the line the whole village now knows: 'My people... e start like play, like play...'",
  next: "h5_end",
};
N.h5_end = { type: "ending" };

// ============================================================

export function getNode(id) {
  return N[id] || null;
}

export const NODES = N;
