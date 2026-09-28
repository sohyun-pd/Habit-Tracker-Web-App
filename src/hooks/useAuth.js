import useLocalStorage from './useLocalStorage';

// Device-local accounts: profiles and sessions live in this browser only (no server, no passwords).
const LEGACY_KEYS = ['habits', 'completions'];

function useAuth() {
  const [users, setUsers] = useLocalStorage('users', []);
  const [sessionId, setSessionId] = useLocalStorage('session', null);

  const user = users.find((u) => u.id === sessionId) || null;

  // Returns an error message, or null on success.
  const signUp = ({ name, email, role = 'member' }) => {
    const normalizedEmail = email.trim().toLowerCase();
    if (users.some((u) => u.email.toLowerCase() === normalizedEmail)) {
      return 'An account with this email already exists on this device.';
    }

    const id = Date.now().toString(36);

    // The first account adopts any habits saved before accounts existed.
    if (users.length === 0 && role === 'member') {
      LEGACY_KEYS.forEach((key) => {
        const raw = window.localStorage.getItem(key);
        if (raw !== null) {
          window.localStorage.setItem(`${key}:${id}`, raw);
          window.localStorage.removeItem(key);
        }
      });
    }

    setUsers([...users, { id, name: name.trim(), email: email.trim(), role, createdAt: new Date().toISOString() }]);
    setSessionId(id);
    return null;
  };

  const signIn = (id) => setSessionId(id);
  const signOut = () => setSessionId(null);

  return { users, user, signUp, signIn, signOut };
}

export default useAuth;
