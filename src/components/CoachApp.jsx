import { useEffect, useState } from 'react';
import useFeedback, { feedbackId } from '../hooks/useFeedback';
import { readJson, readUserData } from '../utils/storage';
import { toDateKey } from '../utils/date';
import {
  computeWeek,
  draftFeedback,
  formatDuration,
  getWeekBounds,
  median,
  previousWeek,
  rateDelta,
  trendWeeks,
} from '../utils/weeklySummary';
import AppShell from './AppShell';
import { Avatar } from './Navigation';
import SafetyNotice from './SafetyNotice';
import WeekNav from './WeekNav';
import WeeklySummary from './WeeklySummary';

const TARGET_HANDLING_MS = 5 * 60 * 1000;

const STATUS_LABELS = {
  waiting: 'Waiting',
  draft: 'Draft',
  sent: 'Sent',
  nodata: 'No data yet',
};

const formatDateTime = (iso) =>
  new Date(iso).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });

// Members who agreed to share, with their latest reviewable week and feedback status.
function loadClients(feedback, today) {
  return readJson('users', [])
    .filter((account) => account.role !== 'coach')
    .map((account) => ({ user: account, ...readUserData(account.id) }))
    .filter((client) => client.consent?.status === 'granted')
    .map((client) => {
      const data = { habits: client.habits, completions: client.completions, misses: client.misses };
      const bounds = getWeekBounds(data, today);
      const summary = computeWeek(data, bounds.initial, today);
      const record = feedback.find((f) => f.id === feedbackId(client.user.id, toDateKey(bounds.initial)));
      let status = 'waiting';
      if (summary.rate === null) status = 'nodata';
      else if (record?.sentAt) status = 'sent';
      else if (record) status = 'draft';
      return { ...client, data, bounds, summary, status };
    });
}

const PRIORITY = { waiting: 0, draft: 1, sent: 2, nodata: 3 };

function FeedbackComposer({ client, coach, summary, prev, weekKey, existing, upsertFeedback }) {
  const id = feedbackId(client.user.id, weekKey);
  const defaults = {
    userId: client.user.id,
    clientName: client.user.name,
    coachId: coach.id,
    coachName: coach.name,
    weekStart: weekKey,
    sentAt: null,
    readAt: null,
    rating: null,
    planConfirmedAt: null,
  };
  const [text, setText] = useState(
    existing?.text || draftFeedback({ name: client.user.name, summary, prev })
  );

  // Opening a client starts the handling-time clock (until the feedback is sent).
  useEffect(() => {
    if (!existing?.sentAt) {
      upsertFeedback(id, { status: 'draft', openedAt: new Date().toISOString() }, defaults);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (existing?.sentAt) {
    return (
      <section className="card">
        <h2 className="mb-3 text-subheading">Feedback sent</h2>
        <p className="whitespace-pre-wrap break-words">{existing.text}</p>
        <p className="mt-4 text-note text-ash">
          Sent {formatDateTime(existing.sentAt)} ·{' '}
          {existing.readAt ? `Read ${formatDateTime(existing.readAt)}` : 'Not read yet'} ·{' '}
          {existing.rating ? `Helpful ${existing.rating}/5` : 'Not rated'} ·{' '}
          {existing.planConfirmedAt ? 'Plan confirmed' : 'Plan not confirmed'}
        </p>
      </section>
    );
  }

  const send = () => {
    upsertFeedback(id, {
      text: text.trim(),
      status: 'sent',
      sentAt: new Date().toISOString(),
      coachId: coach.id,
      coachName: coach.name,
    }, defaults);
  };

  return (
    <section className="card">
      <h2 className="mb-1 text-subheading">Feedback</h2>
      <p className="mb-4 text-small text-ash">
        Draft generated from the numbers above. Edit it before sending.
      </p>
      <label className="sr-only" htmlFor="feedback-text">Feedback message</label>
      <textarea
        id="feedback-text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={9}
        className="field h-auto w-full resize-y py-3"
      />
      <div className="mt-4 flex flex-wrap gap-2">
        <button onClick={send} disabled={!text.trim()} className="btn btn-primary disabled:opacity-40">
          Send feedback
        </button>
        <button
          onClick={() => setText(draftFeedback({ name: client.user.name, summary, prev }))}
          className="btn btn-outline"
        >
          Regenerate draft
        </button>
      </div>
      <p className="mt-4 text-note text-ash">
        Reminder: coaching is not medical or mental-health counseling.
      </p>
    </section>
  );
}

function ClientDetail({ client, coach, feedback, upsertFeedback, onBack }) {
  const [weekStart, setWeekStart] = useState(client.bounds.initial);
  const today = new Date();
  const summary = computeWeek(client.data, weekStart, today);
  const prev = previousWeek(client.data, summary, today);
  const trend = trendWeeks(client.data, weekStart, 4, today);
  const weekKey = toDateKey(weekStart);
  const existing = feedback.find((f) => f.id === feedbackId(client.user.id, weekKey));

  return (
    <div>
      <button onClick={onBack} className="btn btn-ghost btn-sm mb-4 -ml-3">
        ← Clients
      </button>
      <WeekNav weekStart={weekStart} bounds={client.bounds} onChange={setWeekStart} />

      <div className="space-y-6">
        {summary.flagged && <SafetyNotice variant="coach" />}
        <WeeklySummary summary={summary} prev={prev} trend={trend} />
        {summary.rate !== null && (
          <FeedbackComposer
            key={`${client.user.id}:${weekKey}`}
            client={client}
            coach={coach}
            summary={summary}
            prev={prev}
            weekKey={weekKey}
            existing={existing}
            upsertFeedback={upsertFeedback}
          />
        )}
      </div>
    </div>
  );
}

function ClientList({ clients, onSelect }) {
  if (clients.length === 0) {
    return (
      <div className="card">
        <p className="text-ash">
          No members are sharing data on this device yet. Members can turn on coach sharing when they sign up,
          or later in Data.
        </p>
      </div>
    );
  }

  return (
    <ul className="space-y-3">
      {clients.map((client) => {
        const prev = previousWeek(client.data, client.summary, new Date());
        const delta = rateDelta(client.summary, prev);
        return (
          <li key={client.user.id}>
            <button
              onClick={() => onSelect(client.user.id)}
              className="card flex w-full flex-wrap items-center gap-4 text-left transition-colors duration-300 ease-out hover:border-ink"
            >
              <Avatar name={client.user.name} />
              <div className="min-w-0 flex-1 basis-40">
                <div className="truncate">{client.user.name}</div>
                <div className="truncate text-note text-ash">{client.user.email}</div>
              </div>
              <div className="text-right">
                <div className="text-heading-sm tabular-nums">
                  {client.summary.rate === null ? '–' : `${Math.round(client.summary.rate * 100)}%`}
                </div>
                <div className="text-note tabular-nums text-ash">
                  {delta === null ? 'completion' : `${delta > 0 ? '+' : ''}${delta} pts`}
                </div>
              </div>
              <div className="flex items-center gap-2">
                {client.summary.flagged && <span className="tag border-ink bg-ink text-paper">Needs attention</span>}
                <span
                  className={`tag ${client.status === 'waiting' ? 'border-ink bg-highlighter-yellow' : ''}`}
                >
                  {STATUS_LABELS[client.status]}
                </span>
              </div>
            </button>
          </li>
        );
      })}
    </ul>
  );
}

function csvCell(value) {
  return `"${String(value ?? '').replace(/"/g, '""')}"`;
}

function Timings({ coach, clientsCount, awaiting, feedback }) {
  const sent = feedback.filter((f) => f.coachId === coach.id && f.sentAt);
  const rows = sent
    .filter((f) => f.openedAt)
    .map((f) => ({ ...f, handlingMs: new Date(f.sentAt) - new Date(f.openedAt) }))
    .sort((a, b) => new Date(b.sentAt) - new Date(a.sentAt));
  const medianMs = median(rows.map((r) => r.handlingMs));

  const exportCsv = () => {
    const header = ['client', 'week_start', 'opened_at', 'sent_at', 'handling_seconds', 'rating'];
    const lines = rows.map((r) =>
      [r.clientName, r.weekStart, r.openedAt, r.sentAt, Math.round(r.handlingMs / 1000), r.rating ?? '']
        .map(csvCell)
        .join(',')
    );
    const blob = new Blob([[header.join(','), ...lines].join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `coach-timings-${toDateKey(new Date())}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const metrics = [
    { label: 'Clients sharing', value: clientsCount },
    { label: 'Awaiting feedback', value: awaiting },
    { label: 'Feedback sent', value: sent.length },
    { label: 'Median handling time', value: medianMs === null ? '–' : formatDuration(medianMs) },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {metrics.map((metric) => (
          <div key={metric.label} className="card">
            <div className="text-heading-lg tabular-nums">{metric.value}</div>
            <div className="eyebrow mt-1">{metric.label}</div>
          </div>
        ))}
      </div>

      <section className="card">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-subheading">Handling time</h2>
            <p className="text-note text-ash">
              Target: {formatDuration(TARGET_HANDLING_MS)} or less per client per week.
            </p>
          </div>
          <button onClick={exportCsv} disabled={rows.length === 0} className="btn btn-outline btn-sm disabled:opacity-40">
            Export CSV
          </button>
        </div>

        {rows.length === 0 ? (
          <p className="text-ash">No feedback sent yet.</p>
        ) : (
          <div className="divide-y divide-hairline border-y border-hairline">
            {rows.map((row) => (
              <div key={row.id} className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 py-3">
                <div className="min-w-0">
                  <div className="truncate">{row.clientName}</div>
                  <div className="text-note text-ash">Week of {row.weekStart}</div>
                </div>
                <div className="flex items-center gap-4 text-small tabular-nums">
                  <span className={row.handlingMs > TARGET_HANDLING_MS ? 'text-ash' : ''}>
                    {formatDuration(row.handlingMs)}
                  </span>
                  <span className="text-ash">{row.rating ? `${row.rating}/5` : 'Not rated'}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function CoachApp({ user, onSignOut }) {
  const [activeTab, setActiveTab] = useState('clients');
  const [selectedId, setSelectedId] = useState(null);
  const [feedback, upsertFeedback] = useFeedback();

  const clients = loadClients(feedback, new Date()).sort(
    (a, b) =>
      Number(b.summary.flagged) - Number(a.summary.flagged) || PRIORITY[a.status] - PRIORITY[b.status]
  );
  const awaiting = clients.filter((c) => c.status === 'waiting' || c.status === 'draft').length;
  const selected = clients.find((c) => c.user.id === selectedId) || null;

  const tabs = [
    { id: 'clients', label: 'Clients', badge: awaiting },
    { id: 'timings', label: 'Timings' },
  ];

  const changeTab = (id) => {
    setActiveTab(id);
    setSelectedId(null);
  };

  const title = activeTab === 'clients' ? (selected ? selected.user.name : 'Clients') : 'Timings';

  return (
    <AppShell
      tabs={tabs}
      activeTab={activeTab}
      onTabChange={changeTab}
      user={user}
      onSignOut={onSignOut}
      status={{ label: 'Clients', value: awaiting, note: 'awaiting feedback' }}
      statusText={`${awaiting} awaiting feedback`}
      title={title}
    >
      {activeTab === 'clients' &&
        (selected ? (
          <ClientDetail
            key={selected.user.id}
            client={selected}
            coach={user}
            feedback={feedback}
            upsertFeedback={upsertFeedback}
            onBack={() => setSelectedId(null)}
          />
        ) : (
          <ClientList clients={clients} onSelect={setSelectedId} />
        ))}

      {activeTab === 'timings' && (
        <Timings coach={user} clientsCount={clients.length} awaiting={awaiting} feedback={feedback} />
      )}
    </AppShell>
  );
}

export default CoachApp;
