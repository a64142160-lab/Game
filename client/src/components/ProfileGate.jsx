import { useState } from 'react';

export default function ProfileGate({ onReady }) {
  const [form, setForm] = useState({
    username: '',
    dob: '',
    language: 'English'
  });
  const [error, setError] = useState('');

  function calculateAge(dob) {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age -= 1;
    }
    return age;
  }

  function submit(e) {
    e.preventDefault();
    setError('');

    if (!form.username.trim() || !form.dob) {
      setError('Please fill username and date of birth.');
      return;
    }

    const age = calculateAge(form.dob);
    if (Number.isNaN(age)) {
      setError('Please enter a valid date of birth.');
      return;
    }

    if (age < 13) {
      setError('Sorry, this app is only available for users 13 and above.');
      return;
    }

    const tier = 'Free';
    const modeAccess = age >= 18 ? ['chill', 'savage', 'unfiltered'] : ['chill', 'savage'];

    onReady({
      username: form.username.trim(),
      dob: form.dob,
      age,
      language: form.language,
      tier,
      modeAccess,
      stats: {
        wins: 0,
        losses: 0,
        battles: 0,
        streak: 0,
        coins: 10
      }
    });
  }

  return (
    <div className="card">
      <h1>Roast Rumble 🔥</h1>
      <p>Set up your profile to start battle mode.</p>
      <form className="form" onSubmit={submit}>
        <label>
          Username
          <input
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            placeholder="Enter your battle name"
          />
        </label>
        <label>
          Date of Birth
          <input
            type="date"
            value={form.dob}
            onChange={(e) => setForm({ ...form, dob: e.target.value })}
          />
        </label>
        <label>
          Language
          <select
            value={form.language}
            onChange={(e) => setForm({ ...form, language: e.target.value })}
          >
            <option>English</option>
            <option>Hinglish</option>
          </select>
        </label>
        {error && <p className="error">{error}</p>}
        <button type="submit">Enter Arena</button>
      </form>
    </div>
  );
}
