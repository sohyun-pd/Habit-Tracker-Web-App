import { useState } from 'react';

function HabitItem({ habit, isCompletedToday, streak, onToggleComplete, onEdit, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(habit.name);
  const [editDescription, setEditDescription] = useState(habit.description);

  const handleEditSubmit = (e) => {
    e.preventDefault();
    onEdit(habit.id, { name: editName.trim(), description: editDescription.trim() });
    setIsEditing(false);
  };

  const handleEditCancel = () => {
    setEditName(habit.name);
    setEditDescription(habit.description);
    setIsEditing(false);
  };

  return (
    <div className={`card transition-colors duration-300 ${isCompletedToday ? 'border-ink' : ''}`}>
      {isEditing ? (
        <form onSubmit={handleEditSubmit}>
          <label className="label" htmlFor={`edit-name-${habit.id}`}>Habit Name</label>
          <input
            id={`edit-name-${habit.id}`}
            type="text"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            className="field mb-4"
            required
          />
          <label className="label" htmlFor={`edit-description-${habit.id}`}>Description</label>
          <input
            id={`edit-description-${habit.id}`}
            type="text"
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
            className="field mb-4"
            placeholder="Description"
          />
          <div className="flex gap-2">
            <button type="submit" className="btn btn-primary btn-sm">
              Save
            </button>
            <button type="button" onClick={handleEditCancel} className="btn btn-outline btn-sm">
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <div className="flex flex-wrap items-start gap-4">
          <button
            onClick={() => onToggleComplete(habit.id)}
            aria-pressed={isCompletedToday}
            aria-label={`${isCompletedToday ? 'Mark incomplete' : 'Mark complete'}: ${habit.name}`}
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-md border text-xl transition-colors duration-300 ${
              isCompletedToday
                ? 'border-ink bg-highlighter-yellow text-ink'
                : 'border-hairline bg-bone hover:border-ink'
            }`}
          >
            {isCompletedToday ? (
              '✓'
            ) : (
              <span className="grayscale" aria-hidden="true">{habit.icon || '○'}</span>
            )}
          </button>

          <div className="min-w-0 flex-1 basis-40">
            <h3 className={`text-subheading break-words ${isCompletedToday ? 'text-ash line-through' : ''}`}>
              {habit.name}
            </h3>
            {habit.description && (
              <p className="mt-1 text-small break-words text-ash">
                {habit.description}
              </p>
            )}
            <div className="mt-3 flex flex-wrap items-center gap-2 text-note text-ash">
              <span>{streak} day streak</span>
              {streak >= 7 && <span className="tag bg-bone text-ink">7+ days</span>}
              {streak >= 30 && <span className="tag border-obsidian bg-obsidian text-paper">30+ days</span>}
            </div>
          </div>

          <div className="flex gap-2">
            <button onClick={() => setIsEditing(true)} className="btn btn-outline btn-sm">
              Edit
            </button>
            <button onClick={() => onDelete(habit.id)} className="btn btn-outline btn-sm">
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default HabitItem;
