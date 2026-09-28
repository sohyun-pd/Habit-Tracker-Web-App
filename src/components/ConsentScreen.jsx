function ConsentScreen({ user, onChoose }) {
  return (
    <div className="flex min-h-screen items-start justify-center px-4 py-10 sm:items-center">
      <div className="w-full max-w-[480px]">
        <div className="mb-8 text-subheading">Habit Tracker</div>

        <div className="card">
          <h1 className="mb-1 text-heading">Share with a coach?</h1>
          <p className="mb-6 text-small text-ash">
            Hi {user.name.split(' ')[0]}. A coach can review your weekly summary and send feedback. You decide
            what happens with your data.
          </p>

          <div className="mb-6">
            <div className="eyebrow mb-2">What a coach can see</div>
            <ul className="space-y-1 text-small text-ash">
              <li>• Your habit names and descriptions</li>
              <li>• Your check-in history</li>
              <li>• Reasons you add for missed check-ins</li>
            </ul>
          </div>

          <p className="mb-6 text-small text-ash">
            Nothing is shared until you agree. You can turn sharing off at any time in Data, and coaches stop
            seeing your data immediately.
          </p>

          <div className="flex flex-col gap-2 sm:flex-row">
            <button onClick={() => onChoose('granted')} className="btn btn-primary flex-1">
              Share with coach
            </button>
            <button onClick={() => onChoose('declined')} className="btn btn-outline flex-1">
              Not now
            </button>
          </div>
        </div>

        <p className="mt-4 text-note text-ash">
          Coaching is not medical or mental-health counseling. In this version, coaches sign in on this
          same device.
        </p>
      </div>
    </div>
  );
}

export default ConsentScreen;
