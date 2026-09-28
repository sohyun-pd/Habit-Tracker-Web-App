// Shown when a check-in note matches a crisis signal (rules live in utils/safety.js).
function SafetyNotice({ variant = 'member', onDismiss }) {
  return (
    <section role="alert" className="rounded-2xl border border-ink bg-paper p-5 sm:p-6">
      {variant === 'coach' ? (
        <>
          <h2 className="mb-2 text-subheading">Needs attention</h2>
          <p className="text-small text-ash">
            This client added a note that may indicate a crisis. Coaching is not medical or mental-health
            counseling. Encourage them to contact a professional or a crisis line, and follow your escalation
            procedure before sending routine feedback.
          </p>
        </>
      ) : (
        <>
          <h2 className="mb-2 text-subheading">If you're struggling</h2>
          <p className="text-small text-ash">
            If you're thinking about harming yourself, please contact local emergency services or a crisis line
            right away. In Korea, the suicide prevention hotline is 109 (24 hours). This app is not medical or
            mental-health counseling.
          </p>
          {onDismiss && (
            <button onClick={onDismiss} className="btn btn-outline btn-sm mt-4">
              Dismiss
            </button>
          )}
        </>
      )}
    </section>
  );
}

export default SafetyNotice;
