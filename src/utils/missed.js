import { toDateKey, addDays } from './date';

const MAX_ITEMS = 4;
const LOOKBACK_DAYS = 3;

// Habits that were missed in the last few finished days and have no reason recorded yet.
export function getMissedItems(habits, completions, misses, today = new Date()) {
  const items = [];
  for (let offset = 1; offset <= LOOKBACK_DAYS; offset += 1) {
    const date = addDays(today, -offset);
    const key = toDateKey(date);
    habits.forEach((habit) => {
      if (toDateKey(new Date(habit.createdAt)) > key) return;
      if ((completions[habit.id] || []).includes(key)) return;
      if (misses[habit.id]?.[key]) return;
      items.push({ habit, key, date, offset });
    });
  }
  return items.slice(0, MAX_ITEMS);
}
