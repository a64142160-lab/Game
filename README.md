# Roast Rumble (Phase 1 Playable Build)

A full-stack starter for your roast battle game with:
- VS AI mode
- Age gate (13+)
- RPS mini-game
- Topic picker
- Chill/Savage modes
- Easy/Normal difficulty
- AI judging with score + savage reason + funniest line
- Basic W/L card result

> This implementation is a **working Phase 1 build** from your roadmap, structured so you can extend to multiplayer, coins, ads, and paid tiers in later phases.

---

## Tech Stack

- Frontend: React + Vite
- Backend: Node.js + Express
- AI: Groq API (optional), fallback local judge logic included

---

## Project Structure

```
Game/
  client/   # React frontend
  server/   # Express API backend
```

---

## First time? Get the code on your own device

If the project is only visible on GitHub and not on your laptop/PC yet, do this first:

```bash
git clone https://github.com/a64142160-lab/Game.git
cd Game
```

Alternative:
- GitHub repo page → **Code** → **Download ZIP**
- Extract ZIP and open that folder in your terminal/VS Code

If your branch already exists on GitHub (example from PR: `codex/build-roast-battle-game-prototype`):

```bash
git fetch origin
git checkout codex/build-roast-battle-game-prototype
```

---

## What is already built

### Implemented now
- ✅ Profile setup with DOB age gate
  - Under 13 blocked
  - 13+ allowed
- ✅ Language preference stored in profile (English/Hinglish field)
- ✅ Player stats in UI (W/L, battles, streak, coins)
- ✅ RPS endpoint + UI
- ✅ VS AI battle endpoint
- ✅ Content pre-filter (slur/threat/sexual blocking baseline)
- ✅ Difficulty: easy + normal
- ✅ Modes: chill + savage (unfiltered reserved for later paid 18+)
- ✅ AI judge output:
  - player1Score
  - player2Score
  - winner
  - savageReason
  - funniestLine
  - aiReply
- ✅ Fallback scoring if Groq key not configured

### Not yet (next phases)
- Real-time PvP / async PvP
- Firebase auth + persistent profile
- Coins economy backend persistence
- Voice input
- Paid subscription / Razorpay
- AdMob / ads
- React Native app package

---

## Local Setup (Step-by-step)

## 1) Prerequisites
- Node.js 18+
- npm 9+

Check:
```bash
node -v
npm -v
```

## 2) Install backend
```bash
cd server
npm install
cp .env.example .env
```

## 3) Fill backend API values (you do this)
Open `server/.env` and set:
```env
PORT=4000
GROQ_API_KEY=your_real_groq_key_here
GROQ_MODEL=llama-3.1-8b-instant
```

If you leave `GROQ_API_KEY` empty, app still runs with fallback offline-style judge logic.

## 4) Install frontend
```bash
cd ../client
npm install
cp .env.example .env
```

Verify `client/.env`:
```env
VITE_API_BASE_URL=http://localhost:4000
```

## 5) Run backend
In terminal 1:
```bash
cd server
npm run dev
```
You should see:
`Server running on http://localhost:4000`

## 6) Run frontend
In terminal 2:
```bash
cd client
npm run dev
```
Open the shown Vite URL (usually `http://localhost:5173`).

## 7) Quick test flow
1. Create profile (13+ DOB)
2. Play RPS
3. Pick topic + mode + difficulty
4. Enter roast text
5. Submit and view W/L card with scores

---

## API Endpoints

### `GET /api/health`
Health check.

### `GET /api/topics`
Returns topic list.

### `POST /api/rps`
Body:
```json
{ "playerMove": "rock" }
```

### `POST /api/battle/vs-ai`
Body:
```json
{
  "topic": "Fashion",
  "difficulty": "easy",
  "mode": "savage",
  "playerRoast": "Your fashion sense looks like your closet rage quit."
}
```

---

## Next recommended build order
1. Add Firebase Auth + Firestore profile persistence
2. Add multiplayer Socket.io room system
3. Add report system + moderation queue
4. Add coin transactions and daily limits
5. Add Razorpay + premium entitlements
6. Add React Native client

---

## Notes
- This code is intended as a scalable starter architecture, not final production moderation.
- Before launch, add robust safety policies, legal documents, parental compliance handling, and anti-abuse telemetry.

---

## Troubleshooting install issues

If `npm install` throws `403 Forbidden`:
- You may be behind a restricted network/proxy/firewall.
- Try another network (mobile hotspot), or configure corporate npm proxy.
- Run:

```bash
npm config get registry
```

Expected:

```bash
https://registry.npmjs.org/
```
