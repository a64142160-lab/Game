const blockedPatterns = [
  /\b(?:kill|murder|bomb|suicide|rape)\b/i,
  /\b(?:nazi|terrorist)\b/i,
  /\b(?:slut|whore|bitch|fag|retard)\b/i
];

const sexualPatterns = [/\b(?:nude|sex|porn|naked)\b/i];

export function validateRoastText(text, mode = 'savage') {
  const normalized = String(text || '').trim();

  if (!normalized) {
    return {
      allowed: false,
      reason: 'Roast cannot be empty.'
    };
  }

  if (normalized.length < 4) {
    return {
      allowed: false,
      reason: 'Roast is too short. Write at least 4 characters.'
    };
  }

  if (mode === 'chill') {
    const harshWords = /\b(?:idiot|stupid|dumb|loser)\b/i;
    if (harshWords.test(normalized)) {
      return {
        allowed: false,
        reason: 'Chill mode allows only light banter. Tone it down a bit.'
      };
    }
  }

  if (blockedPatterns.some((p) => p.test(normalized)) || sexualPatterns.some((p) => p.test(normalized))) {
    return {
      allowed: false,
      reason: 'This roast is blocked for safety policy (slur/threat/sexual content).'
    };
  }

  return {
    allowed: true,
    reason: 'Allowed'
  };
}
