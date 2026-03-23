function safeDetails(details = {}) {
  const clone = { ...details };
  for (const key of Object.keys(clone)) {
    if (/key|token|secret|authorization/i.test(key)) {
      clone[key] = "[REDACTED]";
    }
  }
  return clone;
}

export function logEvent(level, event, details = {}) {
  const payload = {
    level,
    event,
    timestamp: new Date().toISOString(),
    ...safeDetails(details),
  };
  const line = JSON.stringify(payload);
  if (level === "error") {
    console.error(line);
    return;
  }
  console.log(line);
}
