// Placeholder crisis-signal rules. The final list and response procedure must be
// agreed with the coach lead and legal (PRD Open Question 6) before real users.
const CRISIS_PATTERNS = [
  /suicid/i,
  /kill myself/i,
  /end my life/i,
  /want to die/i,
  /self[- ]?harm/i,
  /hurt myself/i,
  /자살/,
  /죽고\s*싶/,
  /자해/,
  /극단적\s*선택/,
];

export function hasCrisisSignal(text) {
  return CRISIS_PATTERNS.some((pattern) => pattern.test(text || ''));
}
