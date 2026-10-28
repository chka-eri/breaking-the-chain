# Breaking the Chain — Ịgbaji Agbụ

**An entry for the Imo State Youth Game Contest 2026** (v0.3.0)

A culturally-rooted story-and-run game set in Umuoma, an Igbo village on the edge of Owerri.
Drag the road, dodge the Chain, face five nights, and learn through play that recovery is
possible with early action, family, and community support.

Built with **React Native + Expo SDK 57** (runs on Android, iOS and web from one codebase).
Expo Go from the App Store / Play Store matches SDK 57 — that is the version this project uses.

---

## Quick Start (test on your phone in 2 minutes)

1. Install **Expo Go** on your phone (Play Store / App Store).
2. On this computer, open a terminal in this folder and run:

   ```
   npx expo start
   ```

3. A QR code appears. Scan it:
   - **Android:** open Expo Go, tap "Scan QR code".
   - **iPhone:** scan with the normal Camera app.
4. The game loads on your phone. Your phone and computer must be on the **same Wi-Fi**.

**If the QR connection fails** (some networks block it), run instead:

```
npx expo start --tunnel
```

**To test in a web browser** (fast for quick demos):

```
npm run web
```

> Fresh clone on a new machine? Run `npm install` once, then the commands above.

---

## How to Play

- **The road:** drag left and right. Each run lasts a minute and a half. It starts as a walk,
  then quickens, then becomes fastest. Dodge cups, bottles, mkpụrụ and the Chain. Catch herbs,
  yam, craft and prayers. A prayer lets the road breathe.
- **Five weeks** map to the five stages of drug dependency: experimentation, social use,
  regular use, harmful use, dependence and recovery.
- **Face the night:** one timed choice. Hesitate, and the crowd decides for you.
- **Your hands remember:** if a drug tags you, the next run is foggier and slower.
- **Choices shape five stats:** 🌟 Hope (Nchekwube), ❤️ Health (Ahụike), 🤝 Family (Ezinụlọ),
  💰 Money (Ego) — and ⛓️ **Agbụ, The Chain**.
- **Akpa Amamihe:** 7 Igbo proverbs. Two storylines (Helper / Struggler). Three grades:
  Dike ✊, Odogwu 🛡️, Ugo 🦅.

---

## Project Structure

```
App.js                     - root + screen router
src/theme.js               - colours, stat metadata
src/state/GameContext.js   - game engine, weeks, nights, autosave
src/data/weeks.js          - five weeks + night scenes (Helper / Struggler)
src/data/dreams.js         - player dreams (Heartland FC / music / FUTO)
src/data/proverbs.js       - the 7 collectible Igbo proverbs
src/data/facts.js          - real drug facts + NDLEA helpline (0800-1020-3040)
src/data/art.js            - scene, portrait and run art
src/components/            - HUD, craving battle, timer, shared UI
src/screens/               - Title, Setup, Hub, Run, Night, Journal, About, Ending
```

---

## Submission Checklist (jnaija.com — deadline 31 Aug 2026)

- [ ] Sign up at jnaija.com and create your profile
- [ ] Record a 2–3 minute gameplay video (screen-record your phone playing Week 1)
- [ ] Take 5–8 screenshots (Title, a timed night, the road run, a proverb card, Ending)
- [ ] Attach `GAME-DESIGN-DOCUMENT.md` (the full vision + roadmap)
- [ ] Zip this project folder (delete `node_modules` first — reviewers run `npm install`)
- [ ] Optional but powerful: publish a playable web build (`npx expo export --platform web`, host the `dist/` folder on any static host) and include the link

---

## The Message

Dependence is a treatable health condition, not a moral failure.
If this story touches something real in your life or a friend's:

**NDLEA 24/7 toll-free helpline: 0800-1020-3040** — free, confidential,
in English, Pidgin, Igbo, Hausa and Yoruba.

*Onye aghana nwanne ya — let no one leave their kin behind.*
