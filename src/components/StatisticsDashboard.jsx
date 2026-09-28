import { toDateKey } from '../utils/date';

function StatisticsDashboard({ habits, completions }) {
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();

  // Calculate statistics
  const totalHabits = habits.length;
  const activeHabits = habits.filter(habit => {
    const habitCompletions = completions[habit.id] || [];
    return habitCompletions.length > 0;
  }).length;

  // Current streaks
  const currentStreaks = habits.map(habit => {
    const habitCompletions = completions[habit.id] || [];
    if (!habitCompletions.includes(toDateKey(today))) return 0;

    let streak = 0;
    let date = new Date(today);
    while (habitCompletions.includes(toDateKey(date))) {
      streak++;
      date.setDate(date.getDate() - 1);
    }
    return streak;
  });

  const longestCurrentStreak = Math.max(...currentStreaks, 0);
  const totalCurrentStreaks = currentStreaks.reduce((sum, streak) => sum + streak, 0);

  // Monthly completion rate
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const monthlyCompletions = [];

  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(currentYear, currentMonth, day);
    const dateStr = toDateKey(date);
    const completed = habits.filter(habit =>
      (completions[habit.id] || []).includes(dateStr)
    ).length;
    monthlyCompletions.push(completed);
  }

  const avgMonthlyCompletion = monthlyCompletions.reduce((sum, comp) => sum + comp, 0) / daysInMonth;
  const monthlyCompletionRate = totalHabits > 0 ? Math.round((avgMonthlyCompletion / totalHabits) * 100) : 0;

  // Best performing habits
  const habitStats = habits.map(habit => {
    const habitCompletions = completions[habit.id] || [];
    const completionRate = habitCompletions.length > 0 ?
      Math.round((habitCompletions.length / Math.max(1, (new Date() - new Date(habit.createdAt)) / (1000 * 60 * 60 * 24))) * 100) : 0;

    return {
      ...habit,
      completionCount: habitCompletions.length,
      completionRate
    };
  }).sort((a, b) => b.completionRate - a.completionRate);

  const topHabits = habitStats.slice(0, 3);

  const metrics = [
    { label: 'Total Habits', value: totalHabits },
    { label: 'Active Habits', value: activeHabits },
    { label: 'Longest Streak', value: longestCurrentStreak },
    { label: 'Monthly Avg', value: `${monthlyCompletionRate}%` },
  ];

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {metrics.map((metric) => (
          <div key={metric.label} className="card">
            <div className="text-heading-lg tabular-nums">{metric.value}</div>
            <div className="eyebrow mt-1">{metric.label}</div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Top Performing Habits */}
        <section className="card">
          <h2 className="mb-3 text-subheading">Top habits</h2>
          {topHabits.length === 0 ? (
            <p className="text-ash">No habits to rank yet.</p>
          ) : (
            <div className="divide-y divide-hairline border-y border-hairline">
              {topHabits.map((habit) => (
                <div key={habit.id} className="flex items-center justify-between gap-4 py-4">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="text-lg grayscale" aria-hidden="true">{habit.icon || '🎯'}</div>
                    <div className="min-w-0">
                      <div className="break-words">{habit.name}</div>
                      <div className="text-note text-ash">{habit.completionCount} completions</div>
                    </div>
                  </div>
                  <div className="shrink-0 text-right">
                    <div className="text-heading-sm tabular-nums">{habit.completionRate}%</div>
                    <div className="eyebrow">completion rate</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Monthly Progress Chart */}
        <section className="card">
          <h2 className="mb-3 text-subheading">Last 14 days</h2>
          <div className="flex h-36 items-end gap-1">
            {monthlyCompletions.slice(-14).map((completed, index) => {
              const height = totalHabits > 0 ? (completed / totalHabits) * 100 : 0;
              const isToday = index === monthlyCompletions.slice(-14).length - 1;

              return (
                <div key={index} className="flex h-full flex-1 flex-col items-center justify-end">
                  <div className="flex w-full flex-1 items-end">
                    <div
                      className={`w-full rounded-md border transition-[height] duration-[400ms] ease-out ${
                        isToday ? 'border-ink bg-highlighter-yellow' : 'border-transparent bg-smoke'
                      }`}
                      style={{ height: `${Math.max(height, 5)}%` }}
                    />
                  </div>
                  <div className={`mt-1 text-note tabular-nums ${isToday ? 'text-ink' : 'text-ash'}`}>
                    {new Date(currentYear, currentMonth, index + (daysInMonth - 13)).getDate()}
                  </div>
                </div>
              );
            })}
          </div>
          <p className="mt-3 text-note text-ash">
            {monthlyCompletionRate}% average completion rate this month
          </p>
        </section>
      </div>
    </div>
  );
}

export default StatisticsDashboard;