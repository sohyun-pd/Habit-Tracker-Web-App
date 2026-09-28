import useLocalStorage from './useLocalStorage';
import { readJson } from '../utils/storage';

// Feedback records are shared between members and coaches on this device.
// Each id is deterministic (`fb:<userId>:<weekStart>`), so upserts are safe to repeat.
export function feedbackId(userId, weekKey) {
  return `fb:${userId}:${weekKey}`;
}

function useFeedback() {
  const [feedback, setFeedback] = useLocalStorage('feedback', []);

  // Reads the latest stored list first so writes from another account never get overwritten.
  const upsertFeedback = (id, patch, defaults = {}) => {
    const list = readJson('feedback', []);
    const exists = list.some((f) => f.id === id);
    setFeedback(
      exists
        ? list.map((f) => (f.id === id ? { ...f, ...patch } : f))
        : [...list, { ...defaults, ...patch, id }]
    );
  };

  return [feedback, upsertFeedback];
}

export default useFeedback;
