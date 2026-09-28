import { useState } from 'react';

function AddHabitForm({ onAddHabit }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) {
      onAddHabit({ name: name.trim(), description: description.trim() });
      setName('');
      setDescription('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card">
      <h2 className="mb-4 text-subheading">New habit</h2>
      <div className="mb-4">
        <label className="label" htmlFor="name">
          Habit Name
        </label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="field"
          placeholder="e.g., Drink water, Exercise, Read books"
          required
        />
      </div>
      <div className="mb-6">
        <label className="label" htmlFor="description">
          Description (optional)
        </label>
        <input
          type="text"
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="field"
          placeholder="e.g., 8 glasses a day, 30 minutes daily"
        />
      </div>
      <button type="submit" className="btn btn-primary w-full">
        Add habit
      </button>
    </form>
  );
}

export default AddHabitForm;
