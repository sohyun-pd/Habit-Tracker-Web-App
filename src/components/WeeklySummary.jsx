import { describeWeek, rateDelta } from '../utils/weeklySummary';

const percent = (rate) => `${Math.round(rate * 100)}%`;

function WeeklySummary({ summary, prev, trend }) {
  const delta = rateDelta(summary, prev);
  const lines = describeWeek(summary, prev);

  return (
    <div className="space-y-6">
      <section className="card">
        <div className="eyebrow">Completion</div>
        <div className="mt-1 flex flex-wrap items-baseline gap-x-4">
          <span className="text-heading-lg tabular-nums">
            {summary.rate === null ? '–' : percent(summary.rate)}
          </span>
          {delta !== null && (
            <span className="text-small tabular-nums text-ash">
              {delta > 0 ? '+' : ''}{delta} pts vs previous week
            </span>
          )}
        </div>
        <ul className="mt-4 space-y-1 text-small text-ash">
          {lines.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
        <p className="mt-4 text-note text-ash">Calculated from check-ins.</p>
      </section>

      {summary.rate !== null && (
        <>
          <div className="grid gap-6 lg:grid-cols-2">
            <section className="card flex flex-col">
              <h2 className="mb-4 text-subheading">By day</h2>
              <div className="flex min-h-32 flex-1 items-end gap-2">
                {summary.days.map((day) => (
                  <div key={day.key} className="flex h-full flex-1 flex-col items-center justify-end">
                    <div className="flex w-full flex-1 items-end">
                      <div
                        className={`w-full rounded-md border transition-[height] duration-[400ms] ease-out ${
                          day.rate === 1
                            ? 'border-ink bg-highlighter-yellow'
                            : day.rate === null
                              ? 'border-hairline bg-transparent'
                              : 'border-transparent bg-smoke'
                        }`}
                        style={{ height: day.rate === null ? '4px' : `${Math.max(day.rate * 100, 5)}%` }}
                        title={day.rate === null ? 'Not counted' : `${percent(day.rate)} (${day.done}/${day.eligible})`}
                      />
                    </div>
                    <div className="eyebrow mt-1">
                      {day.date.toLocaleDateString('en-US', { weekday: 'short' })}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="card">
              <h2 className="mb-3 text-subheading">Missed check-ins</h2>
              {summary.reasons.length === 0 ? (
                <p className="text-ash">No missed check-ins this week.</p>
              ) : (
                <ul className="divide-y divide-hairline border-y border-hairline">
                  {summary.reasons.map((reason) => (
                    <li key={reason.id} className="flex items-center justify-between gap-4 py-3">
                      <span>{reason.label}</span>
                      <span className="tabular-nums text-ash">{reason.count}</span>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </div>

          <section className="card">
            <h2 className="mb-4 text-subheading">Last 4 weeks</h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {trend.map((week, index) => (
                <div
                  key={week.weekStart.getTime()}
                  className={`wash border ${index === trend.length - 1 ? 'border-ink' : 'border-transparent'}`}
                >
                  <div className="text-heading-sm tabular-nums">{week.rate === null ? '–' : percent(week.rate)}</div>
                  <div className="eyebrow mt-1">
                    {week.weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  );
}

export default WeeklySummary;
