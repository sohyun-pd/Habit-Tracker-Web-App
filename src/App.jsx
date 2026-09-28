import { useState } from 'react';
import useAuth from './hooks/useAuth';
import useFeedback from './hooks/useFeedback';
import useLocalStorage from './hooks/useLocalStorage';
import AuthScreen from './components/AuthScreen';
import AppShell from './components/AppShell';
import ConsentScreen from './components/ConsentScreen';
import CoachApp from './components/CoachApp';
import AddHabitForm from './components/AddHabitForm';
import HabitList from './components/HabitList';
import MissedRecently from './components/MissedRecently';
import SafetyNotice from './components/SafetyNotice';
import TodaySummary from './components/TodaySummary';
import WeeklyPage from './components/WeeklyPage';
import CalendarView from './components/CalendarView';
import StatisticsDashboard from './components/StatisticsDashboard';
import DataExport from './components/DataExport';
import { toDateKey } from './utils/date';
import { buildDemoData } from './utils/demo';
import { getMissedItems } from './utils/missed';

function App() {
  const { users, user, signUp, signIn, signOut } = useAuth();

  if (!user) {
    return <AuthScreen users={users} onSignIn={signIn} onSignUp={signUp} />;
  }

  // Keyed by user so each account loads its own stored data.
  return user.role === 'coach'
    ? <CoachApp key={user.id} user={user} onSignOut={signOut} />
    : <Tracker key={user.id} user={user} onSignOut={signOut} />;
}

function Tracker({ user, onSignOut }) {
  const [habits, setHabits] = useLocalStorage(`habits:${user.id}`, []);
  const [completions, setCompletions] = useLocalStorage(`completions:${user.id}`, {});
  const [misses, setMisses] = useLocalStorage(`misses:${user.id}`, {});
  const [consent, setConsent] = useLocalStorage(`consent:${user.id}`, null);
  const [feedback, upsertFeedback] = useFeedback();
  const [activeTab, setActiveTab] = useState('habits');
  const [safetyVisible, setSafetyVisible] = useState(false);

  const today = toDateKey(new Date());

  const addHabit = (newHabit) => {
    const habit = {
      id: Date.now().toString(),
      ...newHabit,
      createdAt: new Date().toISOString(),
      color: getRandomColor(),
      icon: getRandomIcon(),
    };
    setHabits([...habits, habit]);
  };

  const editHabit = (id, updatedHabit) => {
    setHabits(habits.map(h => h.id === id ? { ...h, ...updatedHabit } : h));
  };

  const deleteHabit = (id) => {
    setHabits(habits.filter(h => h.id !== id));
    const newCompletions = { ...completions };
    delete newCompletions[id];
    setCompletions(newCompletions);
    const newMisses = { ...misses };
    delete newMisses[id];
    setMisses(newMisses);
  };

  const toggleComplete = (id) => {
    const habitCompletions = completions[id] || [];
    const isCompleted = habitCompletions.includes(today);
    if (isCompleted) {
      setCompletions({
        ...completions,
        [id]: habitCompletions.filter(date => date !== today),
      });
    } else {
      setCompletions({
        ...completions,
        [id]: [...habitCompletions, today],
      });
    }
  };

  const saveMiss = (habitId, dateKey, payload) => {
    setMisses({ ...misses, [habitId]: { ...(misses[habitId] || {}), [dateKey]: payload } });
    if (payload.flagged) setSafetyVisible(true);
  };

  // Merges an imported backup into the current data.
  const importData = (imported) => {
    const knownIds = new Set(habits.map(h => h.id));
    setHabits([...habits, ...imported.habits.filter(h => !knownIds.has(h.id))]);

    const merged = { ...completions };
    Object.entries(imported.completions).forEach(([id, dates]) => {
      merged[id] = [...new Set([...(merged[id] || []), ...dates])];
    });
    setCompletions(merged);

    if (imported.misses && typeof imported.misses === 'object') {
      const mergedMisses = { ...misses };
      Object.entries(imported.misses).forEach(([id, byDate]) => {
        mergedMisses[id] = { ...byDate, ...(mergedMisses[id] || {}) };
      });
      setMisses(mergedMisses);
    }
  };

  const clearAllData = () => {
    setHabits([]);
    setCompletions({});
    setMisses({});
  };

  const loadSampleData = () => {
    const sample = buildDemoData();
    setHabits([...habits, ...sample.habits]);
    setCompletions({ ...completions, ...sample.completions });
    setMisses({ ...misses, ...sample.misses });
  };

  const setSharing = (status) => setConsent({ status, at: new Date().toISOString() });

  const myFeedback = feedback.filter(f => f.userId === user.id);
  const unreadFeedback = myFeedback.filter(f => f.sentAt && !f.readAt).length;
  const markRead = (id) => upsertFeedback(id, { readAt: new Date().toISOString() });
  const rateFeedback = (id, rating) => upsertFeedback(id, { rating });
  const confirmPlan = (id) => upsertFeedback(id, { planConfirmedAt: new Date().toISOString() });

  const completedToday = habits.filter(habit => (completions[habit.id] || []).includes(today)).length;
  const nextHabit = habits.find(habit => !(completions[habit.id] || []).includes(today)) || null;
  const percentage = habits.length > 0 ? Math.round((completedToday / habits.length) * 100) : 0;
  const missedItems = getMissedItems(habits, completions, misses);

  const getMotivationalMessage = () => {
    if (percentage === 100 && habits.length > 0) return "Amazing! All habits completed today!";
    if (percentage >= 75) return "Great progress! Keep it up!";
    if (percentage >= 50) return "You're doing well! Stay consistent!";
    if (percentage >= 25) return "Good start! Every step counts!";
    return "Every journey begins with a single step!";
  };

  if (consent === null) {
    return <ConsentScreen user={user} onChoose={setSharing} />;
  }

  const tabs = [
    { id: 'habits', label: 'Today' },
    { id: 'weekly', label: 'Weekly', badge: unreadFeedback },
    { id: 'calendar', label: 'Calendar' },
    { id: 'statistics', label: 'Statistics' },
    { id: 'data', label: 'Data' },
  ];
  const pageTitle = tabs.find(tab => tab.id === activeTab).label;

  return (
    <AppShell
      tabs={tabs}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      user={user}
      onSignOut={onSignOut}
      status={{ label: 'Today', value: `${completedToday}/${habits.length}`, note: 'habits done' }}
      statusText={`${completedToday}/${habits.length} done today`}
      title={pageTitle}
    >
      {activeTab === 'habits' && (
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
          <div className="xl:col-start-1">
            <TodaySummary
              completed={completedToday}
              total={habits.length}
              nextHabit={nextHabit}
              onComplete={toggleComplete}
              message={getMotivationalMessage()}
            />
          </div>
          <div className="xl:col-start-2 xl:row-span-3 xl:row-start-1 xl:sticky xl:top-10 xl:self-start">
            <AddHabitForm onAddHabit={addHabit} />
          </div>
          {(safetyVisible || missedItems.length > 0) && (
            <div className="space-y-6 xl:col-start-1">
              {safetyVisible && <SafetyNotice onDismiss={() => setSafetyVisible(false)} />}
              {missedItems.length > 0 && <MissedRecently items={missedItems} onSave={saveMiss} />}
            </div>
          )}
          <div className="xl:col-start-1">
            <HabitList
              habits={habits}
              completions={completions}
              onToggleComplete={toggleComplete}
              onEditHabit={editHabit}
              onDeleteHabit={deleteHabit}
            />
          </div>
        </div>
      )}

      {activeTab === 'weekly' && (
        <WeeklyPage
          habits={habits}
          completions={completions}
          misses={misses}
          consent={consent}
          feedbackList={myFeedback}
          onRead={markRead}
          onRate={rateFeedback}
          onConfirmPlan={confirmPlan}
          onEnableSharing={() => setSharing('granted')}
          onAdjust={() => setActiveTab('habits')}
        />
      )}

      {activeTab === 'calendar' && (
        <CalendarView completions={completions} habits={habits} />
      )}

      {activeTab === 'statistics' && (
        <StatisticsDashboard habits={habits} completions={completions} />
      )}

      {activeTab === 'data' && (
        <DataExport
          habits={habits}
          completions={completions}
          misses={misses}
          consent={consent}
          onConsentChange={setSharing}
          onImport={importData}
          onClear={clearAllData}
          onLoadSample={loadSampleData}
        />
      )}
    </AppShell>
  );
}

function getRandomColor() {
  const colors = [
    'bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-pink-500',
    'bg-indigo-500', 'bg-red-500', 'bg-yellow-500', 'bg-teal-500'
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}

function getRandomIcon() {
  const icons = ['💧', '🏃', '📚', '🎵', '🍎', '🧘', '💻', '🎨', '🏋️', '🛏️'];
  return icons[Math.floor(Math.random() * icons.length)];
}

export default App;
