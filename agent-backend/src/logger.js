function safeDetails(details = {}) {
  const clone = { ...details };
  for (const key of Object.keys(clone)) {
    if (/key|token|secret|authorization/i.test(key)) {
      clone[key] = "[REDACTED]";
    }
  }
  return clone;
}

const DEFAULT_MAX = 240;

export function truncateForLog(value, max = DEFAULT_MAX) {
  if (value == null) return "";
  const str = typeof value === "string" ? value : JSON.stringify(value);
  if (str.length <= max) return str;
  return `${str.slice(0, max)}…`;
}

export function summarizeToolResult(result, max = DEFAULT_MAX) {
  const str = typeof result === "string" ? result : JSON.stringify(result);
  return { resultChars: str.length, resultPreview: truncateForLog(str, max) };
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

export function logToolInvoked(traceId, tool, argsSummary) {
  logEvent("info", "tool.invoked", {
    traceId,
    tool,
    argsSummary: truncateForLog(argsSummary, 320),
  });
}

export function logToolComplete(traceId, tool, argsSummary, result, ok, durationMs) {
  const { resultChars, resultPreview } = summarizeToolResult(result);
  logEvent(ok ? "info" : "warn", "tool.completed", {
    traceId,
    tool,
    argsSummary: truncateForLog(argsSummary, 320),
    ok,
    resultChars,
    resultPreview,
    durationMs,
  });
}

export function logToolFailure(traceId, tool, argsSummary, error, durationMs) {
  logEvent("error", "tool.failed", {
    traceId,
    tool,
    argsSummary: truncateForLog(argsSummary, 320),
    ok: false,
    errorMessage: error?.message,
    stack: error?.stack,
    durationMs,
  });
}
