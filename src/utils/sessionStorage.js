const SESSION_KEY = 'voiceup_sessions';

export function saveSession(sessionData) {
  const sessions = getSessions();
  sessions.push({ ...sessionData, timestamp: Date.now() });
  localStorage.setItem(SESSION_KEY, JSON.stringify(sessions));
}

export function getSessions() {
  const data = localStorage.getItem(SESSION_KEY);
  return data ? JSON.parse(data) : [];
}

export function getLastNSessions(n = 5) {
  const sessions = getSessions();
  return sessions.slice(-n);
}

export function getStreak() {
  const sessions = getSessions();
  if (sessions.length === 0) return 0;
  // Simple streak logic: check if there's a session today, then count consecutive days backwards
  return sessions.length; // Placeholder for more complex date-based streak logic
}
