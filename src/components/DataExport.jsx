import { useState } from 'react';

function DataExport({ habits, completions, misses, consent, onConsentChange, onImport, onClear, onLoadSample }) {
  const [notice, setNotice] = useState('');

  const exportData = () => {
    const data = {
      habits,
      completions,
      misses,
      exportDate: new Date().toISOString(),
      version: "1.1"
    };

    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `habit-tracker-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setNotice('Backup downloaded.');
  };

  const importData = (event) => {
    const input = event.target;
    const file = input.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedData = JSON.parse(e.target.result);

        if (Array.isArray(importedData.habits) && importedData.completions && typeof importedData.completions === 'object') {
          onImport(importedData);
          setNotice(`Imported ${importedData.habits.length} habits from ${file.name}.`);
        } else {
          setNotice('Invalid file format. Please select a valid habit tracker backup file.');
        }
      } catch (error) {
        setNotice("Error reading file. Please make sure it's a valid JSON file.");
        console.error('Import error:', error);
      }
      input.value = '';
    };
    reader.readAsText(file);
  };

  const clearAllData = () => {
    if (window.confirm('Are you sure you want to clear all habit data? This action cannot be undone.')) {
      onClear();
      setNotice('All habit data cleared.');
    }
  };

  const loadSample = () => {
    if (window.confirm('Add 3 sample habits with 5 weeks of sample check-ins? Your existing habits are kept.')) {
      onLoadSample();
      setNotice('Sample data added. Open Weekly to see the summary.');
    }
  };

  const sharing = consent?.status === 'granted';

  return (
    <div className="space-y-6">
      {notice && (
        <p role="status" className="rounded-xl border border-ink bg-paper px-5 py-3 text-small">
          {notice}
        </p>
      )}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {/* Export Data */}
        <section className="card flex flex-col">
          <h2 className="mb-2 text-subheading">Export</h2>
          <p className="mb-6 flex-1 text-small text-ash">
            Download your habits and progress as a JSON file
          </p>
          <button onClick={exportData} className="btn btn-primary w-full">
            Export data
          </button>
        </section>

        {/* Import Data */}
        <section className="card flex flex-col">
          <h2 className="mb-2 text-subheading">Import</h2>
          <p className="mb-6 flex-1 text-small text-ash">
            Upload a previously exported backup file
          </p>
          <label className="btn btn-outline w-full has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-ink">
            Import data
            <input
              type="file"
              accept=".json"
              onChange={importData}
              className="sr-only"
            />
          </label>
        </section>

        {/* Clear Data */}
        <section className="card flex flex-col">
          <h2 className="mb-2 text-subheading">Clear</h2>
          <p className="mb-6 flex-1 text-small text-ash">
            Permanently delete all habits and progress
          </p>
          <button onClick={clearAllData} className="btn btn-outline w-full">
            Clear all data
          </button>
        </section>
      </div>

      <section className="card flex flex-wrap items-center justify-between gap-4">
        <div className="min-w-0 flex-1 basis-64">
          <h2 className="mb-1 text-subheading">Coach sharing</h2>
          <p className="text-small text-ash">
            {sharing
              ? 'On. Coaches can see your habits, check-ins, and missed-check-in reasons.'
              : 'Off. No coach can see your data.'}
          </p>
        </div>
        <button
          onClick={() => {
            onConsentChange(sharing ? 'declined' : 'granted');
            setNotice(sharing ? 'Coach sharing turned off.' : 'Coach sharing turned on.');
          }}
          className={`btn ${sharing ? 'btn-outline' : 'btn-primary'}`}
        >
          {sharing ? 'Turn off sharing' : 'Turn on sharing'}
        </button>
      </section>

      <section className="card flex flex-wrap items-center justify-between gap-4">
        <div className="min-w-0 flex-1 basis-64">
          <h2 className="mb-1 text-subheading">Sample data</h2>
          <p className="text-small text-ash">
            Add 5 weeks of sample check-ins to try the weekly summary and coach feedback.
          </p>
        </div>
        <button onClick={loadSample} className="btn btn-outline">Add sample data</button>
      </section>

      <div className="rounded-xl border border-hairline p-5">
        <h2 className="eyebrow mb-2">Notes</h2>
        <ul className="space-y-1 text-small text-ash">
          <li>• Export your data regularly to create backups</li>
          <li>• Imported data will merge with existing habits</li>
          <li>• Clear data action cannot be undone</li>
          <li>• All data is stored locally in your browser</li>
        </ul>
      </div>
    </div>
  );
}

export default DataExport;
