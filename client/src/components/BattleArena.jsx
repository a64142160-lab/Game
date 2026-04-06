import { useMemo, useState } from 'react';

const modeLabel = {
  chill: 'Chill',
  savage: 'Savage',
  unfiltered: 'Unfiltered'
};

export default function BattleArena({ topics, accessModes, onSubmit, loading, battleResult }) {
  const [topic, setTopic] = useState(topics[0] || 'Fashion');
  const [difficulty, setDifficulty] = useState('easy');
  const [mode, setMode] = useState(accessModes.includes('savage') ? 'savage' : 'chill');
  const [roast, setRoast] = useState('');
  const [error, setError] = useState('');

  const availableModes = useMemo(() => accessModes.filter((m) => m !== 'unfiltered'), [accessModes]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (!roast.trim()) {
      setError('Write a roast first.');
      return;
    }

    const ok = await onSubmit({ topic, difficulty, mode, playerRoast: roast.trim() });
    if (ok) {
      setRoast('');
    }
  }

  return (
    <div className="card">
      <h2>VS AI Battle</h2>
      <p className="muted">Tip: keep it funny + topic-based for higher score.</p>
      <form className="form" onSubmit={handleSubmit}>
        <label>
          Topic
          <select value={topic} onChange={(e) => setTopic(e.target.value)}>
            {topics.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </label>

        <label>
          Difficulty
          <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
            <option value="easy">Easy</option>
            <option value="normal">Normal</option>
          </select>
        </label>

        <label>
          Content Mode
          <select value={mode} onChange={(e) => setMode(e.target.value)}>
            {availableModes.map((m) => (
              <option key={m} value={m}>
                {modeLabel[m]}
              </option>
            ))}
          </select>
        </label>

        <label>
          Your Roast
          <textarea
            rows={4}
            value={roast}
            onChange={(e) => setRoast(e.target.value)}
            placeholder="Drop your best roast..."
          />
        </label>

        {error && <p className="error">{error}</p>}
        <button disabled={loading} type="submit">
          {loading ? 'Judging...' : 'Submit Roast'}
        </button>
      </form>

      {battleResult && (
        <div className={`result-box ${battleResult.winner === 'player1' ? 'winner' : 'loser'}`}>
          <h3>{battleResult.winner === 'player1' ? 'W Card 🏆' : 'L Card 💀'}</h3>
          <p>
            You: <strong>{battleResult.player1Score}</strong> | AI: <strong>{battleResult.player2Score}</strong>
          </p>
          <p>
            <strong>AI Reply:</strong> {battleResult.aiReply}
          </p>
          <p>
            <strong>Savage Reason:</strong> {battleResult.savageReason}
          </p>
          <p>
            <strong>Funniest Line:</strong> {battleResult.funniestLine}
          </p>
        </div>
      )}
    </div>
  );
}
