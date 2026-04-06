import { config } from '../config.js';

function buildSystemPrompt() {
  return [
    'You are a roast battle judge for Gen Z users.',
    'Return strict JSON only. No markdown.',
    'Evaluate by humor, creativity, relevance to topic, and punchline impact.',
    'Do not reward hate speech, threats, or sexual abuse.',
    'Output keys: player1Score, player2Score, winner, savageReason, funniestLine, aiReply.'
  ].join(' ');
}

function buildUserPrompt({ topic, difficulty, playerRoast }) {
  return `Topic: ${topic}\nDifficulty: ${difficulty}\nPlayer roast: ${playerRoast}\nGenerate an AI opponent roast and judge.`;
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function fallbackResult({ topic, difficulty, playerRoast }) {
  const aiReplyTemplates = [
    `Bro your ${topic} take has less energy than 1% battery mode.`,
    `I've seen loading screens with more personality than that ${topic} roast.`,
    `That ${topic} line was so old it came with a fax notification.`
  ];

  const aiReply = aiReplyTemplates[randomInt(0, aiReplyTemplates.length - 1)];
  const playerBase = Math.max(35, Math.min(92, 55 + Math.floor(playerRoast.length / 4)));
  const swing = difficulty === 'normal' ? randomInt(-15, 12) : randomInt(-8, 15);
  const player1Score = Math.max(0, Math.min(100, playerBase + swing));
  const player2Score = Math.max(0, Math.min(100, 100 - player1Score + randomInt(-8, 8)));

  const winner = player1Score >= player2Score ? 'player1' : 'player2';

  return {
    player1Score,
    player2Score,
    winner,
    savageReason:
      winner === 'player1'
        ? 'Player 1 stayed on-topic and landed cleaner punchlines.'
        : 'AI opponent had sharper timing and stronger closing hit.',
    funniestLine: winner === 'player1' ? playerRoast : aiReply,
    aiReply
  };
}

function extractJson(text) {
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) return null;

  try {
    return JSON.parse(match[0]);
  } catch {
    return null;
  }
}

export async function judgeVsAi({ topic, difficulty, playerRoast }) {
  if (!config.groqApiKey) {
    return fallbackResult({ topic, difficulty, playerRoast });
  }

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${config.groqApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: config.groqModel,
        temperature: 0.9,
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: buildSystemPrompt() },
          {
            role: 'user',
            content: buildUserPrompt({ topic, difficulty, playerRoast })
          }
        ]
      })
    });

    if (!response.ok) {
      return fallbackResult({ topic, difficulty, playerRoast });
    }

    const data = await response.json();
    const content = data?.choices?.[0]?.message?.content || '{}';
    const parsed = extractJson(content);
    if (!parsed) {
      return fallbackResult({ topic, difficulty, playerRoast });
    }

    return {
      player1Score: Number(parsed.player1Score) || 0,
      player2Score: Number(parsed.player2Score) || 0,
      winner: parsed.winner === 'player2' ? 'player2' : 'player1',
      savageReason: parsed.savageReason || 'Battle judged.',
      funniestLine: parsed.funniestLine || playerRoast,
      aiReply: parsed.aiReply || 'Nice try, but I roast better than your Wi-Fi speed test.'
    };
  } catch {
    return fallbackResult({ topic, difficulty, playerRoast });
  }
}
