import express from 'express';
import cors from 'cors';
import { config } from './config.js';
import { validateRoastText } from './services/contentFilter.js';
import { judgeVsAi } from './services/judgeService.js';

const app = express();

app.use(cors());
app.use(express.json());

const TOPICS = ['Fashion', 'Music taste', 'Gaming skills', 'Study / Work life', 'Food choices'];

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, message: 'Roast Battle API running' });
});

app.get('/api/topics', (_req, res) => {
  res.json({ topics: TOPICS });
});

app.post('/api/rps', (req, res) => {
  const { playerMove } = req.body;
  const options = ['rock', 'paper', 'scissors'];

  if (!options.includes(playerMove)) {
    return res.status(400).json({ error: 'Invalid RPS move.' });
  }

  const aiMove = options[Math.floor(Math.random() * options.length)];
  let outcome = 'draw';

  if (playerMove !== aiMove) {
    const wins =
      (playerMove === 'rock' && aiMove === 'scissors') ||
      (playerMove === 'paper' && aiMove === 'rock') ||
      (playerMove === 'scissors' && aiMove === 'paper');
    outcome = wins ? 'player' : 'ai';
  }

  return res.json({ playerMove, aiMove, outcome });
});

app.post('/api/battle/vs-ai', async (req, res) => {
  const { topic, difficulty, mode, playerRoast } = req.body;

  if (!topic || !difficulty || !mode || !playerRoast) {
    return res.status(400).json({ error: 'Missing required fields.' });
  }

  if (!TOPICS.includes(topic)) {
    return res.status(400).json({ error: 'Unsupported topic.' });
  }

  if (!['easy', 'normal'].includes(difficulty)) {
    return res.status(400).json({ error: 'Difficulty not available in Phase 1.' });
  }

  if (!['chill', 'savage'].includes(mode)) {
    return res.status(400).json({ error: 'Mode not available in Phase 1.' });
  }

  const filter = validateRoastText(playerRoast, mode);
  if (!filter.allowed) {
    return res.status(422).json({ error: filter.reason });
  }

  const result = await judgeVsAi({ topic, difficulty, playerRoast });
  return res.json(result);
});

app.listen(config.port, () => {
  console.log(`Server running on http://localhost:${config.port}`);
});
