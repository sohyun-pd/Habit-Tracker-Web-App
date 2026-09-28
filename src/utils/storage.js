export function readJson(key, fallback) {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (error) {
    console.error(`Error reading localStorage key "${key}":`, error);
    return fallback;
  }
}

// Coaches read member data straight from storage (same-device demo, no backend yet).
export function readUserData(userId) {
  return {
    habits: readJson(`habits:${userId}`, []),
    completions: readJson(`completions:${userId}`, {}),
    misses: readJson(`misses:${userId}`, {}),
    consent: readJson(`consent:${userId}`, null),
  };
}
