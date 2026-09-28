import { toDateKey, addDays } from './date';
import { MISS_REASONS } from './weeklySummary';

// Small seeded PRNG so sample data looks the same every time.
function createRandom(seed) {
  let state = seed;
  return () => {
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const SAMPLE_HABITS = [
  { name: 'Read 20 minutes', description: 'Before bed', icon: '📚', rate: 0.8 },
  { name: 'Workout', description: '30 minutes', icon: '🏋️', rate: 0.55 },
  { name: 'Plan tomorrow', description: '5 minutes at end of day', icon: '💻', rate: 0.4 },
];

// Five weeks of check-ins ending yesterday, with lower completion on Fridays.
export function buildDemoData(today = new Date()) {
  const random = createRandom(2026);
  const createdAt = addDays(today, -36).toISOString();
  const stamp = Date.now();
  const habits = [];
  const completions = {};
  const misses = {};
  const reasonIds = MISS_REASONS.filter((r) => r.id !== 'other').map((r) => r.id);

  SAMPLE_HABITS.forEach((sample, index) => {
    const id = `demo-${stamp}-${index}`;
    habits.push({ id, name: sample.name, description: sample.description, icon: sample.icon, color: 'bg-blue-500', createdAt });
    completions[id] = [];

    for (let offset = 35; offset >= 1; offset -= 1) {
      const date = addDays(today, -offset);
      const key = toDateKey(date);
      const fridayPenalty = date.getDay() === 5 ? 0.25 : 0;
      if (random() < sample.rate - fridayPenalty) {
        completions[id].push(key);
      } else if (offset <= 14 && random() < 0.7) {
        misses[id] = { ...misses[id], [key]: { reason: reasonIds[Math.floor(random() * reasonIds.length)] } };
      }
    }
  });

  return { habits, completions, misses };
}
