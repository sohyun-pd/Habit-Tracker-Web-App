import HabitItem from './HabitItem';
import { toDateKey } from '../utils/date';

function HabitList({ habits, completions, onToggleComplete, onEditHabit, onDeleteHabit }) {
  const today = toDateKey(new Date());

  const getStreak = (habitId) => {
    const habitCompletions = completions[habitId] || [];
    if (!habitCompletions.includes(today)) return 0;

    let streak = 0;
    let date = new Date();
    while (habitCompletions.includes(toDateKey(date))) {
      streak++;
      date.setDate(date.getDate() - 1);
    }
    return streak;
  };

  const totalStreaks = habits.reduce((sum, habit) => sum + getStreak(habit.id), 0);
  const longestStreak = habits.length > 0 ? Math.max(...habits.map(habit => getStreak(habit.id))) : 0;

  return (
    <section>
      <div className="mb-3 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
        <h2 className="eyebrow">Habits · {habits.length}</h2>
        {habits.length > 0 && (
          <p className="text-note text-ash">
            Total streaks <span className="tabular-nums text-ink">{totalStreaks}</span>
            {' · '}Longest <span className="tabular-nums text-ink">{longestStreak}</span> days
          </p>
        )}
      </div>

      {habits.length === 0 ? (
        <div className="card">
          <p className="text-ash">Add your first habit to get started.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {habits.map((habit) => (
            <HabitItem
              key={habit.id}
              habit={habit}
              isCompletedToday={(completions[habit.id] || []).includes(today)}
              streak={getStreak(habit.id)}
              onToggleComplete={onToggleComplete}
              onEdit={onEditHabit}
              onDelete={onDeleteHabit}
            />
          ))}
        </div>
      )}
    </section>
  );
}

export default HabitList;
