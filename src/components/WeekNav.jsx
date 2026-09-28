import { addDays, formatWeekRange } from '../utils/date';

function WeekNav({ weekStart, bounds, onChange }) {
  const isCurrent = weekStart.getTime() === bounds.current.getTime();
  const atStart = weekStart <= bounds.earliest;

  return (
    <div className="mb-6 flex items-center justify-between gap-4">
      <div>
        <div className="text-heading-sm">{formatWeekRange(weekStart)}</div>
        <div className="text-note text-ash">{isCurrent ? 'This week so far' : 'Finished week'}</div>
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => onChange(addDays(weekStart, -7))}
          disabled={atStart}
          aria-label="Previous week"
          className="btn btn-outline btn-sm w-9 px-0 disabled:opacity-40"
        >
          ←
        </button>
        <button
          onClick={() => onChange(addDays(weekStart, 7))}
          disabled={isCurrent}
          aria-label="Next week"
          className="btn btn-outline btn-sm w-9 px-0 disabled:opacity-40"
        >
          →
        </button>
      </div>
    </div>
  );
}

export default WeekNav;
