import { Sidebar, TabBar, TopBar } from './Navigation';

function AppShell({ tabs, activeTab, onTabChange, user, onSignOut, status, statusText, title, children }) {
  const dateLabel = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="min-h-screen">
      <Sidebar
        tabs={tabs}
        activeTab={activeTab}
        onChange={onTabChange}
        user={user}
        onSignOut={onSignOut}
        status={status}
      />
      <TopBar user={user} onSignOut={onSignOut} statusText={statusText} />

      <div className="lg:pl-64">
        <div className="mx-auto w-full max-w-[1100px] px-4 pt-6 pb-28 sm:px-6 lg:px-10 lg:py-10">
          <header className="mb-6 lg:mb-8">
            <p className="eyebrow">{dateLabel}</p>
            <h1 className="mt-1 text-heading-lg lg:text-[48px] lg:leading-none">{title}</h1>
          </header>
          <main>{children}</main>
        </div>
      </div>

      <TabBar tabs={tabs} activeTab={activeTab} onChange={onTabChange} />
    </div>
  );
}

export default AppShell;
