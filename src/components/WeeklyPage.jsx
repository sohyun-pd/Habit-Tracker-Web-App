import { useEffect, useState } from 'react';
import { toDateKey } from '../utils/date';
import { computeWeek, getWeekBounds, previousWeek, trendWeeks } from '../utils/weeklySummary';
import WeekNav from './WeekNav';
import WeeklySummary from './WeeklySummary';

const formatSent = (iso) =>
  new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

function WeeklyPage({
  habits,
  completions,
  misses,
  consent,
  feedbackList,
  onRead,
  onRate,
  onConfirmPlan,
  onEnableSharing,
  onAdjust,
}) {
  const data = { habits, completions, misses };
  const today = new Date();
  const bounds = getWeekBounds(data, today);
  const [weekStart, setWeekStart] = useState(bounds.initial);

  const summary = computeWeek(data, weekStart, today);
  const prev = previousWeek(data, summary, today);
  const trend = trendWeeks(data, weekStart, 4, today);

  const weekKey = toDateKey(weekStart);
  const feedback = feedbackList.find((f) => f.weekStart === weekKey && f.sentAt);

  useEffect(() => {
    if (feedback && !feedback.readAt) onRead(feedback.id);
  }, [feedback, onRead]);

  return (
    <div>
      <WeekNav weekStart={weekStart} bounds={bounds} onChange={setWeekStart} />

      <div className="space-y-6">
        <WeeklySummary summary={summary} prev={prev} trend={trend} />

        <section className="card">
          <h2 className="mb-3 text-subheading">Coach feedback</h2>

          {feedback ? (
            <>
              <p className="whitespace-pre-wrap break-words">{feedback.text}</p>
              <p className="mt-3 text-note text-ash">
                {feedback.coachName} · {formatSent(feedback.sentAt)}
              </p>

              <div className="mt-6">
                <div className="eyebrow mb-2">Was this helpful?</div>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <button
                      key={value}
                      onClick={() => onRate(feedback.id, value)}
                      aria-pressed={feedback.rating === value}
                      aria-label={`${value} out of 5`}
                      className={`btn btn-sm w-9 px-0 ${feedback.rating === value ? 'btn-primary' : 'btn-outline'}`}
                    >
                      {value}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-6 border-t border-hairline pt-6">
                <div className="eyebrow">Next week's plan</div>
                <p className="mt-1 text-small text-ash">
                  Adjust your habits if needed, then confirm the plan.
                </p>
                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <button onClick={onAdjust} className="btn btn-outline">Adjust habits</button>
                  {feedback.planConfirmedAt ? (
                    <span className="tag border-ink bg-highlighter-yellow">
                      Plan confirmed {formatSent(feedback.planConfirmedAt)}
                    </span>
                  ) : (
                    <button onClick={() => onConfirmPlan(feedback.id)} className="btn btn-primary">
                      Confirm plan
                    </button>
                  )}
                </div>
              </div>
            </>
          ) : consent?.status !== 'granted' ? (
            <>
              <p className="text-ash">Coach sharing is off, so no coach can see your check-ins.</p>
              <button onClick={onEnableSharing} className="btn btn-primary mt-4">
                Turn on coach sharing
              </button>
            </>
          ) : (
            <p className="text-ash">Your coach hasn't sent feedback for this week yet.</p>
          )}

          <p className="mt-6 text-note text-ash">
            Coaching is not medical or mental-health counseling.
          </p>
        </section>
      </div>
    </div>
  );
}

export default WeeklyPage;
