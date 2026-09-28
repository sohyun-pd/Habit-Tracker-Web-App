import { useState } from 'react';

function AuthScreen({ users, onSignIn, onSignUp }) {
  const [mode, setMode] = useState(users.length > 0 ? 'signin' : 'signup');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('member');
  const [error, setError] = useState('');

  const handleSignUp = (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;
    const message = onSignUp({ name, email, role });
    if (message) setError(message);
  };

  const showSignUp = () => {
    setError('');
    setMode('signup');
  };

  const showSignIn = () => {
    setError('');
    setMode('signin');
  };

  return (
    <div className="flex min-h-screen items-start justify-center px-4 py-10 sm:items-center">
      <div className="w-full max-w-[420px]">
        <div className="mb-8 text-subheading">Habit Tracker</div>

        <div className="card">
          {mode === 'signin' ? (
            <>
              <h1 className="mb-1 text-heading">Sign in</h1>
              <p className="mb-6 text-small text-ash">Choose an account to continue.</p>

              <ul className="mb-4 space-y-2">
                {users.map((account) => (
                  <li key={account.id}>
                    <button
                      onClick={() => onSignIn(account.id)}
                      className="flex w-full items-center gap-3 rounded-xl border border-hairline p-3 text-left transition-colors duration-300 ease-out hover:border-ink"
                    >
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-ink text-paper" aria-hidden="true">
                        {account.name.charAt(0).toUpperCase()}
                      </span>
                      <span className="min-w-0">
                        <span className="block truncate">
                          {account.name}
                          {account.role === 'coach' && <span className="tag ml-2 align-middle">Coach</span>}
                        </span>
                        <span className="block truncate text-note text-ash">{account.email}</span>
                      </span>
                    </button>
                  </li>
                ))}
              </ul>

              <button onClick={showSignUp} className="btn btn-outline w-full">
                Create new account
              </button>
            </>
          ) : (
            <form onSubmit={handleSignUp}>
              <h1 className="mb-1 text-heading">Create account</h1>
              <p className="mb-6 text-small text-ash">Set up your profile to start tracking habits.</p>

              <fieldset className="mb-4">
                <legend className="label">I am a</legend>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'member', label: 'Member' },
                    { id: 'coach', label: 'Coach' },
                  ].map((option) => (
                    <button
                      key={option.id}
                      type="button"
                      aria-pressed={role === option.id}
                      onClick={() => setRole(option.id)}
                      className={`btn btn-sm ${role === option.id ? 'btn-primary' : 'btn-outline'}`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </fieldset>
              <div className="mb-4">
                <label className="label" htmlFor="auth-name">Name</label>
                <input
                  id="auth-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="field"
                  autoComplete="name"
                  required
                />
              </div>
              <div className="mb-6">
                <label className="label" htmlFor="auth-email">Email</label>
                <input
                  id="auth-email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError('');
                  }}
                  className="field"
                  autoComplete="email"
                  required
                />
                {error && (
                  <p role="alert" className="mt-2 text-note text-ink">{error}</p>
                )}
              </div>

              <button type="submit" className="btn btn-primary w-full">Create account</button>
              {users.length > 0 && (
                <button type="button" onClick={showSignIn} className="btn btn-ghost mt-2 w-full">
                  Back to sign in
                </button>
              )}
            </form>
          )}
        </div>

        <p className="mt-4 text-note text-ash">
          Accounts and habit data are stored on this device only.
        </p>
      </div>
    </div>
  );
}

export default AuthScreen;
