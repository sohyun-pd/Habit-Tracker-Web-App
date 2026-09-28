import { useState } from 'react';
import { toDateKey } from '../utils/date';

function CalendarView({ completions, habits }) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }

    return days;
  };

  const getCompletionStatus = (date) => {
    if (!date) return null;

    const dateStr = toDateKey(date);
    const totalHabits = habits.length;
    const completedHabits = habits.filter(habit =>
      (completions[habit.id] || []).includes(dateStr)
    ).length;

    if (completedHabits === 0) return 'none';
    if (completedHabits === totalHabits) return 'full';
    return 'partial';
  };

  const navigateMonth = (direction) => {
    setCurrentDate(prevDate => {
      const newDate = new Date(prevDate);
      newDate.setMonth(newDate.getMonth() + direction);
      return newDate;
    });
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const days = getDaysInMonth(currentDate);
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const statusStyles = {
    full: 'bg-highlighter-yellow',
    partial: 'bg-smoke',
    none: '',
  };
  const statusLabels = {
    full: 'All habits completed',
    partial: 'Some habits completed',
    none: 'No habits completed',
  };

  return (
    <div className="card">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-heading-sm">
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h2>
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigateMonth(-1)}
            aria-label="Previous month"
            className="btn btn-outline btn-sm w-9 px-0"
          >
            ←
          </button>
          <button onClick={goToToday} className="btn btn-primary btn-sm">
            Today
          </button>
          <button
            onClick={() => navigateMonth(1)}
            aria-label="Next month"
            className="btn btn-outline btn-sm w-9 px-0"
          >
            →
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="mb-6 grid grid-cols-7 gap-1">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="eyebrow py-1">
            {day}
          </div>
        ))}

        {days.map((date, index) => {
          const status = getCompletionStatus(date);
          const isToday = date && date.toDateString() === new Date().toDateString();

          return (
            <div
              key={index}
              title={date ? statusLabels[status] : undefined}
              className={`aspect-square rounded-md border p-1.5 text-note lg:aspect-auto lg:h-20 lg:p-2 lg:text-small tabular-nums transition-colors duration-300 ${
                date ? statusStyles[status] : ''
              } ${isToday ? 'border-ink' : 'border-transparent'}`}
            >
              {date && date.getDate()}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-note text-ash">
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 rounded-md bg-highlighter-yellow"></div>
          <span>All habits completed</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 rounded-md bg-smoke"></div>
          <span>Some habits completed</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 rounded-md border border-hairline"></div>
          <span>No habits completed</span>
        </div>
      </div>
    </div>
  );
}

export default CalendarView;