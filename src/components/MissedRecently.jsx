import { useState } from 'react';
import { MISS_REASONS } from '../utils/weeklySummary';
import { hasCrisisSignal } from '../utils/safety';

function dayLabel(item) {
  return item.offset === 1
    ? 'Yesterday'
    : item.date.toLocaleDateString('en-US', { weekday: 'long' });
}

function MissedRecently({ items, onSave }) {
  const [otherFor, setOtherFor] = useState(null);
  const [note, setNote] = useState('');

  const rowKey = (item) => `${item.habit.id}:${item.key}`;

  const saveOther = (item) => {
    const trimmed = note.trim();
    onSave(item.habit.id, item.key, { reason: 'other', note: trimmed, flagged: hasCrisisSignal(trimmed) });
    setOtherFor(null);
    setNote('');
  };

  return (
    <section className="card">
      <h2 className="eyebrow">Missed recently</h2>
      <p className="mt-1 text-small text-ash">Optional. A quick reason helps your weekly summary.</p>

      <ul className="mt-4 divide-y divide-hairline border-y border-hairline">
        {items.map((item) => {
          const key = rowKey(item);
          return (
            <li key={key} className="py-4">
              <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
                <span className="break-words">{item.habit.name}</span>
                <span className="text-note text-ash">{dayLabel(item)}</span>
              </div>

              {otherFor === key ? (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    saveOther(item);
                  }}
                  className="flex flex-wrap gap-2"
                >
                  <label className="sr-only" htmlFor={`note-${key}`}>Reason</label>
                  <input
                    id={`note-${key}`}
                    type="text"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    className="field h-9 min-w-0 flex-1 basis-40"
                    placeholder="What got in the way?"
                    autoFocus
                  />
                  <button type="submit" className="btn btn-primary btn-sm">Save</button>
                  <button type="button" onClick={() => setOtherFor(null)} className="btn btn-outline btn-sm">
                    Cancel
                  </button>
                </form>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {MISS_REASONS.map((reason) => (
                    <button
                      key={reason.id}
                      onClick={() =>
                        reason.id === 'other'
                          ? (setOtherFor(key), setNote(''))
                          : onSave(item.habit.id, item.key, { reason: reason.id })
                      }
                      className="btn btn-outline btn-sm"
                    >
                      {reason.label}
                    </button>
                  ))}
                  <button
                    onClick={() => onSave(item.habit.id, item.key, { dismissed: true })}
                    className="btn btn-ghost btn-sm text-ash"
                  >
                    Skip
                  </button>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}

export default MissedRecently;
