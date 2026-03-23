const sessions = new Map();

export function getSessionHistory(sessionId) {
  return sessions.get(sessionId) ?? [];
}

export function appendToSession(sessionId, userMessage, assistantMessage, maxTurns = 8) {
  const history = sessions.get(sessionId) ?? [];
  const updated = [
    ...history,
    { role: "user", content: userMessage },
    { role: "assistant", content: assistantMessage },
  ];
  const maxMessages = maxTurns * 2;
  sessions.set(sessionId, updated.slice(-maxMessages));
}

export function clearMemory() {
  sessions.clear();
}
