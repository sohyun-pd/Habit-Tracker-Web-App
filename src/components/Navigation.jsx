const ICON_PATHS = {
  habits: (
    <>
      <rect x="4" y="4" width="16" height="16" rx="3" />
      <path d="M8.5 12.5l2.5 2.5 4.5-5" />
    </>
  ),
  calendar: (
    <>
      <rect x="4" y="5" width="16" height="15" rx="2" />
      <path d="M4 10h16M9 3v4M15 3v4" />
    </>
  ),
  weekly: (
    <>
      <rect x="5" y="3" width="14" height="18" rx="2" />
      <path d="M9 8h6M9 12h6M9 16h3" />
    </>
  ),
  clients: (
    <>
      <circle cx="9" cy="8" r="3" />
      <path d="M3.5 20c0-3 2.5-5 5.5-5s5.5 2 5.5 5M16 5.5a3 3 0 010 5.5M17.5 15c2 .5 3.5 2.3 3.5 5" />
    </>
  ),
  timings: (
    <>
      <circle cx="12" cy="12" r="8" />
      <path d="M12 8v4l3 2" />
    </>
  ),
  statistics: <path d="M5 20V11M12 20V5M19 20v-7" />,
  data: (
    <>
      <ellipse cx="12" cy="6" rx="7" ry="3" />
      <path d="M5 6v12c0 1.7 3.1 3 7 3s7-1.3 7-3V6M5 12c0 1.7 3.1 3 7 3s7-1.3 7-3" />
    </>
  ),
};

function Icon({ name }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="20"
      height="20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {ICON_PATHS[name]}
    </svg>
  );
}

export function Avatar({ name }) {
  return (
    <span
      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-ink text-small text-paper"
      aria-hidden="true"
    >
      {name.charAt(0).toUpperCase()}
    </span>
  );
}

function Badge({ count, className = '' }) {
  if (!count) return null;
  return (
    <span
      className={`flex h-5 min-w-5 items-center justify-center rounded-md bg-ink px-1 text-caption leading-none text-paper ${className}`}
      aria-label={`${count} new`}
    >
      {count}
    </span>
  );
}

export function Sidebar({ tabs, activeTab, onChange, user, onSignOut, status }) {
  return (
    <aside className="fixed inset-y-0 left-0 z-20 hidden w-64 flex-col border-r border-hairline bg-paper p-4 lg:flex">
      <div className="px-3 py-2 text-subheading">Habit Tracker</div>

      <nav aria-label="Main" className="mt-6 flex flex-col gap-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            aria-current={activeTab === tab.id ? 'page' : undefined}
            className={`btn w-full justify-start gap-3 ${
              activeTab === tab.id ? 'btn-primary' : 'btn-ghost'
            }`}
          >
            <Icon name={tab.id} />
            {tab.label}
            <Badge count={tab.badge} className="ml-auto" />
          </button>
        ))}
      </nav>

      <div className="mt-auto space-y-3">
        <div className="wash p-4">
          <div className="eyebrow">{status.label}</div>
          <div className="mt-1 text-heading-sm tabular-nums">{status.value}</div>
          <div className="text-note text-ash">{status.note}</div>
        </div>

        <div className="flex items-center gap-3 px-1">
          <Avatar name={user.name} />
          <div className="min-w-0">
            <div className="truncate text-small">{user.name}</div>
            <div className="truncate text-note text-ash">{user.email}</div>
          </div>
        </div>
        <button onClick={onSignOut} className="btn btn-outline btn-sm w-full">
          Sign out
        </button>
      </div>
    </aside>
  );
}

export function TopBar({ user, onSignOut, statusText }) {
  return (
    <header className="sticky top-0 z-20 flex h-14 items-center justify-between gap-3 border-b border-hairline bg-paper/90 px-4 shadow-subtle backdrop-blur-[12px] sm:px-6 lg:hidden">
      <div className="flex items-center gap-3">
        <Avatar name={user.name} />
        <div className="min-w-0">
          <div className="truncate text-small">{user.name}</div>
          <div className="text-note tabular-nums text-ash">{statusText}</div>
        </div>
      </div>
      <button onClick={onSignOut} className="btn btn-outline btn-sm">
        Sign out
      </button>
    </header>
  );
}

export function TabBar({ tabs, activeTab, onChange }) {
  return (
    <nav
      aria-label="Main"
      style={{ gridTemplateColumns: `repeat(${tabs.length}, minmax(0, 1fr))` }}
      className="fixed inset-x-0 bottom-0 z-20 grid border-t border-hairline bg-paper/90 pb-[env(safe-area-inset-bottom)] shadow-subtle backdrop-blur-[12px] lg:hidden"
    >
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          aria-current={activeTab === tab.id ? 'page' : undefined}
          className="flex flex-col items-center gap-1 py-2"
        >
          <span
            className={`relative flex h-8 w-14 items-center justify-center rounded-md transition-colors duration-300 ease-out ${
              activeTab === tab.id ? 'bg-highlighter-yellow' : ''
            }`}
          >
            <Icon name={tab.id} />
            <Badge count={tab.badge} className="absolute -top-1 right-1" />
          </span>
          <span className="text-caption uppercase leading-none">{tab.label}</span>
        </button>
      ))}
    </nav>
  );
}
