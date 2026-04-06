import { useEffect, useState } from 'react';
import ProfileGate from './components/ProfileGate.jsx';
import RpsRound from './components/RpsRound.jsx';
import BattleArena from './components/BattleArena.jsx';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';

export default function App() {
  const [profile, setProfile] = useState(null);
  const [topics, setTopics] = useState([]);
  const [rpsResult, setRpsResult] = useState(null);
  const [loadingRps, setLoadingRps] = useState(false);
  const [loadingBattle, setLoadingBattle] = useState(false);
  const [battleResult, setBattleResult] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!profile) return;

    fetch(`${API_BASE}/api/topics`)
      .then((res) => res.json())
      .then((data) => setTopics(data.topics || []))
      .catch(() => setError('Cannot reach API. Check backend server is running.'));
  }, [profile]);

  async function playRps(playerMove) {
    setLoadingRps(true);
    setError('');
    try {
      const res = await fetch(`${API_BASE}/api/rps`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ playerMove })
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'RPS failed.');
      } else {
        setRpsResult(data);
      }
    } catch {
      setError('RPS request failed.');
    } finally {
      setLoadingRps(false);
    }
  }

  async function submitBattle(payload) {
    setLoadingBattle(true);
    setError('');
    try {
      const res = await fetch(`${API_BASE}/api/battle/vs-ai`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Battle failed.');
        return false;
      }

      setBattleResult(data);
      setProfile((prev) => {
        const won = data.winner === 'player1';
        return {
          ...prev,
          stats: {
            ...prev.stats,
            wins: prev.stats.wins + (won ? 1 : 0),
            losses: prev.stats.losses + (won ? 0 : 1),
            battles: prev.stats.battles + 1,
            streak: won ? prev.stats.streak + 1 : 0
          }
        };
      });
      return true;
    } catch {
      setError('Battle request failed.');
      return false;
    } finally {
      setLoadingBattle(false);
    }
  }

  if (!profile) {
    return (
      <main className="container">
        <ProfileGate onReady={setProfile} />
      </main>
    );
  }

  return (
    <main className="container">
      <header className="hero">
        <div>
          <p className="kicker">GEN Z ROAST ARENA</p>
          <h1>Roast Rumble ⚡</h1>
          <p className="subtitle">Battle AI, flex your punchlines, stack W cards.</p>
        </div>
        <div className="hero-pill">VS AI LIVE</div>
      </header>

      <div className="card profile-card">
        <h2>Player Profile</h2>
        <div className="chips">
          <span className="chip">{profile.username}</span>
          <span className="chip">Age {profile.age}</span>
          <span className="chip">{profile.language}</span>
          <span className="chip">{profile.tier}</span>
        </div>
        <div className="stat-grid">
          <div className="stat-tile">
            <p>Wins</p>
            <strong>{profile.stats.wins}</strong>
          </div>
          <div className="stat-tile">
            <p>Losses</p>
            <strong>{profile.stats.losses}</strong>
          </div>
          <div className="stat-tile">
            <p>Battles</p>
            <strong>{profile.stats.battles}</strong>
          </div>
          <div className="stat-tile">
            <p>Streak</p>
            <strong>{profile.stats.streak}</strong>
          </div>
          <div className="stat-tile">
            <p>Coins</p>
            <strong>{profile.stats.coins}</strong>
          </div>
        </div>
      </div>

      <RpsRound result={rpsResult} onPlay={playRps} loading={loadingRps} />

      {topics.length > 0 && (
        <BattleArena
          topics={topics}
          accessModes={profile.modeAccess}
          onSubmit={submitBattle}
          loading={loadingBattle}
          battleResult={battleResult}
        />
      )}

      {error && <p className="error global-error">{error}</p>}
    </main>
  );
}
