const moves = ['rock', 'paper', 'scissors'];
const emoji = { rock: '🪨', paper: '📄', scissors: '✂️' };

export default function RpsRound({ result, onPlay, loading }) {
  return (
    <div className="card">
      <h2>Rock Paper Scissors</h2>
      <p>Win to choose who roasts first and topic control.</p>
      <div className="row">
        {moves.map((move) => (
          <button className="move-btn" key={move} onClick={() => onPlay(move)} disabled={loading}>
            <span>{emoji[move]}</span> {move}
          </button>
        ))}
      </div>
      {result && (
        <div className="result-box">
          <p>
            You: <strong>{emoji[result.playerMove]} {result.playerMove}</strong> vs AI: <strong>{emoji[result.aiMove]} {result.aiMove}</strong>
          </p>
          <p>
            Outcome:{' '}
            <strong>{result.outcome === 'player' ? 'You won 🎉' : result.outcome === 'ai' ? 'AI won 🤖' : 'Draw 🤝'}</strong>
          </p>
        </div>
      )}
    </div>
  );
}
