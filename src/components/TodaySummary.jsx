const RING_SIZE = 144;
const RING_STROKE = 12;
const RADIUS = (RING_SIZE - RING_STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

function TodaySummary({ completed, total, nextHabit, onComplete, message }) {
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
  const allDone = total > 0 && completed === total;

  return (
    <section
      aria-label="Today's progress"
      className="flex flex-col items-center gap-8 rounded-2xl bg-paper p-6 text-ink sm:p-8"
    >
      <div
        className="relative shrink-0"
        style={{ width: RING_SIZE, height: RING_SIZE }}
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={percentage}
        aria-label="Today's progress"
      >
        <svg width={RING_SIZE} height={RING_SIZE} viewBox={`0 0 ${RING_SIZE} ${RING_SIZE}`} aria-hidden="true">
          <circle
            cx={RING_SIZE / 2}
            cy={RING_SIZE / 2}
            r={RADIUS}
            fill="none"
            strokeWidth={RING_STROKE}
            className="stroke-hairline"
          />
          {percentage > 0 && (
            <circle
              cx={RING_SIZE / 2}
              cy={RING_SIZE / 2}
              r={RADIUS}
              fill="none"
              strokeWidth={RING_STROKE}
              strokeLinecap="round"
              strokeDasharray={CIRCUMFERENCE}
              strokeDashoffset={CIRCUMFERENCE * (1 - percentage / 100)}
              transform={`rotate(-90 ${RING_SIZE / 2} ${RING_SIZE / 2})`}
              className="stroke-highlighter-yellow transition-[stroke-dashoffset] duration-[400ms] ease-out"
            />
          )}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-heading-lg tabular-nums">{percentage}%</span>
          <span className="text-caption uppercase">done</span>
        </div>
      </div>

      <div className="min-w-0 self-stretch">
        <div className="eyebrow text-ink">Next up</div>

        {total === 0 && (
          <p className="mt-1 text-heading-sm">No habits yet</p>
        )}
        {nextHabit && (
          <div className="mt-1 flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
            <div className="min-w-0">
              <p className="text-heading-sm break-words">{nextHabit.name}</p>
              {nextHabit.description && (
                <p className="mt-1 text-small break-words">{nextHabit.description}</p>
              )}
            </div>
            <button
              onClick={() => onComplete(nextHabit.id)}
              className="btn btn-ghost"
            >
              Mark complete
            </button>
          </div>
        )}
        {allDone && (
          <p className="mt-1 text-heading-sm">All habits completed today</p>
        )}

        <p className="mt-4 text-small">
          <span className="tabular-nums">{completed}</span> of{' '}
          <span className="tabular-nums">{total}</span> habits completed · {message}
        </p>
      </div>
    </section>
  );
}

export default TodaySummary;
