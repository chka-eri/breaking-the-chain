# BREAKING THE CHAIN — Ịgbaji Agbụ
## Game Design Document — Imo State Youth Game Contest 2026 (20% Alpha)

---

### 1. Executive Summary

**Breaking the Chain** is a narrative adventure game, rooted in Igbo culture and set in
Imo State, that teaches how drug use progresses from a single "harmless" cup at a festival
to full dependence — and proves through play that **recovery is real** when help comes early
and community stands together.

The player is a talented youth from Umuoma, a fictional village outside Owerri, six weeks
away from the audition of their life. Every choice — at the Iri Ji festival, at "Kai Base"
behind the timber market, at the family table — either feeds their dream or feeds **Agbụ,
the Chain**.

- **Genre:** narrative adventure / interactive drama with mini-games
- **Platform:** Android, iOS and web from one codebase (React Native + Expo)
- **Audience:** ages 13–35; designed for classroom and community use as well as personal play
- **Session length:** 25–40 minutes per full playthrough; built for replay (two storylines)
- **Language:** English + Nigerian Pidgin dialogue + Igbo phrases (with translations)

---

### 2. Contest Alignment

| Contest goal | How the game delivers |
|---|---|
| Divert youth attention from drug abuse | The entire game IS a drug-prevention journey: five levels map exactly to the five stages of dependency (experimental → social → regular → harmful → dependence) |
| Culturally-themed | Iri Ji New Yam Festival, Mmanwụ masquerades, Igba Nkwu wedding, kola nut rites, 7 collectible Igbo proverbs, Mbari art, ogene/ekwe music references — all playable story elements |
| Imo State identity | Real landmarks woven into gameplay: Otamiri river, Eke Ukwu market, Dan Anyiam Stadium & Heartland FC, FUTO, World Bank Layout, Owerri |
| Youth development & talent | The player's chosen dream (footballer / musician / engineer) is the emotional engine of the story — the thing the Chain tries to steal |
| Real-world impact | Real, verified help is built in: NDLEA 24/7 helpline (0800-1020-3040), stigma-reduction messaging, family-support guidance |

---

### 3. The Educational Core (the five levels)

| Chapter | Stage of dependency | Playable lesson |
|---|---|---|
| 1 — Mmetụ Mbụ (The First Taste) | Experimental use | Timed peer-pressure choice at a festival party; prepare your "no" before the moment |
| 2 — Egwu Fraịde (Friday Fever) | Occasional / social use | "Only Fridays" becomes a pattern; opportunity cost of every yes; first warning signs in a friend |
| 3 — Agbụ Na-esi Ike (The Grip) | Regular use | Using to feel "normal"; stolen money, broken trust, failing craft; asking for help is a map, not weakness |
| 4 — Mgbidi Na-ada (Falling Walls) | Harmful use / abuse | Debt, collapse at Eke Ukwu, NDLEA raid, family meeting; "Help me" as the strongest sentence |
| 5 — Ịgbaji Agbụ (Breaking the Chain) | Dependence & recovery | Rehab as treatment (not punishment), trigger mapping, craving battles, relapse as signal-not-sentence, reconciliation through kola, becoming a mentor |

**Victory ending:** one year later, back at Iri Ji, the player speaks at the village square
as a peer mentor beside the state youth office and NDLEA — dream back on track.
Ending grade (Dike ✊ / Odogwu 🛡️ / Ugo 🦅) reflects the health of Hope, Health, Family and
the weakness of the Chain.

---

### 4. Signature Systems

1. **The Chain meter (⛓️ Agbụ)** — dependence as a visible, growing antagonist stat.
2. **Timed pressure choices** — hesitate and "the crowd decides for you": mechanical proof
   that an unprepared moment is a decision in itself.
3. **Dual storyline** — resist early (low Chain after Chapter 2) and the game pivots: your
   cousin Nnamdi falls instead, and you play the **Helper's road** (spotting warning signs,
   crisis first-response, fighting stigma, supporting recovery). Two full perspectives on
   the same epidemic = built-in replay and a complete prevention curriculum.
4. **The Craving Battle** — a tap-defense minigame modelling urge-surfing: waves that scream
   and then PASS; coping tools (breathing, calling a friend, proverbs) weaken each wave.
   In the Helper's road the same game becomes a midnight phone call — you steady a friend.
5. **Akpa Amamihe (Bag of Wisdom)** — 7 authentic Igbo proverbs collected from elders,
   each unlocking at the story moment that proves it (e.g. *Ewu ojii ka a na-achọ n'ụtụtụ* —
   seek the black goat in the morning = early intervention).
6. **Living stats** — Hope, Health, Family, Money respond to every choice and feed the ending.

---

### 5. Cultural Showcase (not decoration — gameplay)

- **Iri Ji** opens and closes the story (full-circle structure)
- **Igba Nkwu** wine-carrying wedding as the stage for both family duty and final temptation
- **Kola nut rite** (*Onye wetara ọjị wetara ndụ*) as the reconciliation mechanic
- **Mmanwụ, ogene, ekwe, isiagu, umunna family council, Mbari house** as scene fabric
- **Language texture:** Igbo proverbs with translations, Pidgin peer dialogue, Igbo UI labels
- **Local drug reality:** the mkpụrụ mmiri (crystal meth) crisis of the South-East addressed
  directly and truthfully, with NDLEA's real helpline in-game

---

### 6. Content Safety Principles

- Drug use is never glamorized: every use scene costs something visible immediately
- No consumption is depicted attractively; slang is used for realism, effects for truth
- Dependence framed as treatable health condition; stigma explicitly challenged in-story
- Relapse handled per best practice: "a slip is a signal, not a sentence"
- Real helpline (NDLEA 0800-1020-3040, verified) present in-game, in the ending, and in Help

---

### 7. This Build = Keep Your Hands contest build (v0.3)

**Included and playable now:**
- Hub loop: five weeks, each mapping to a stage of dependence
- Timed Umuoma road run: drag to move, dodge drugs, catch herbs, prayers and gifts. It starts slow, then climbs to fastest
- Five night scenes with timed peer-pressure choices; hesitate and the crowd chooses for you
- Dual storyline (Helper / Struggler) after week 2, three ending grades (Dike / Odogwu / Ugo)
- Craving Battle after the hardest nights; impairment from last night fogs the next run
- Akpa Amamihe proverb journal, facts & NDLEA helpline, autosave/continue
- Illustrated scenes, portraits, run tokens and title art
- Full UI: title, setup, hub, run, night, journal, help/about, ending
- Runs on Android + iOS (Expo Go) and web

**Remaining 80% — roadmap:**

| Milestone | Adds | % |
|---|---|---|
| Beta 1 (Oct 2026) | Illustrated 2D scenes in Mbari-inspired art style; character portraits; animated transitions | 35% |
| Beta 2 (Dec 2026) | Original ogene/highlife adaptive soundtrack; Igbo voice acting; sound design; haptics | 55% |
| RC (Feb 2027) | Full Igbo language toggle; 3 more minigames (market economy of debt, community town-hall debate, festival rhythm game); expanded side stories (Ngozi, Baros' origin) | 80% |
| Launch (Apr 2027) | School Edition: teacher dashboard, printable discussion guides aligned with NDLEA/WADA school programs; community leaderboard; Play Store / App Store release | 100% |

---

### 8. Tech

- **React Native + Expo SDK 57** — one codebase, three platforms, instant testing via Expo Go
- **Zero-asset alpha strategy:** gradient + emoji scene system keeps the alpha lightweight
  (<1 MB of code) while the full art pipeline is produced
- Data-driven story format (JSON-like node graph) — writers can add content without touching code
- Autosave via AsyncStorage; no internet required after install (rural-friendly)

---

### 9. Impact Vision

A free, culturally-true prevention tool in every Imo school and phone: the five stages of
the chain, taught not as a lecture but as a life the player gets to rehearse — and rescue.

*Onye kwe, chi ya ekwe.*
