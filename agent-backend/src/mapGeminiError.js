/**
 * Maps upstream Gemini / @langchain/google-genai errors to stable codes and safe messages.
 * Never forwards raw provider bodies to clients in production.
 */

const DEBUG_ERRORS =
  process.env.AGENT_DEBUG_ERRORS === "1" || process.env.NODE_ENV === "development";

export function mapGeminiError(err) {
  const msg = String(err?.message || err || "");

  if (/429|Too Many Requests|quota exceeded|rate limit/i.test(msg)) {
    return {
      httpStatus: 429,
      code: "GEMINI_RATE_LIMIT",
      userMessage:
        "The AI service is rate-limited or out of quota right now. Wait a bit and try again, or check billing and rate limits in Google AI Studio.",
      detail: DEBUG_ERRORS ? truncate(msg, 800) : undefined,
    };
  }

  if (/404|not found for API version|is not supported for generateContent|models\//i.test(msg)) {
    return {
      httpStatus: 502,
      code: "GEMINI_MODEL_NOT_FOUND",
      userMessage:
        "The configured Gemini model name is not available for this API. Set GEMINI_MODEL to a supported model (see ai.google.dev models docs) and restart the backend.",
      detail: DEBUG_ERRORS ? truncate(msg, 800) : undefined,
    };
  }

  if (/401|403|API key|invalid.*key|permission denied/i.test(msg)) {
    return {
      httpStatus: 503,
      code: "GEMINI_AUTH",
      userMessage:
        "Gemini rejected the API key or permissions. Verify GEMINI_API_KEY in .env matches the Google Cloud / AI Studio project you expect.",
      detail: DEBUG_ERRORS ? truncate(msg, 800) : undefined,
    };
  }

  if (/timed out|timeout|ETIMEDOUT|ECONNRESET|fetch failed/i.test(msg)) {
    return {
      httpStatus: 504,
      code: "GEMINI_TIMEOUT",
      userMessage:
        "The AI service took too long to respond. Try again with a shorter message or check your network.",
      detail: DEBUG_ERRORS ? truncate(msg, 800) : undefined,
    };
  }

  return {
    httpStatus: 500,
    code: "AGENT_FAILED",
    userMessage: "Something went wrong while generating a response. Please try again.",
    detail: DEBUG_ERRORS ? truncate(msg, 800) : undefined,
  };
}

function truncate(s, max) {
  if (s.length <= max) return s;
  return `${s.slice(0, max)}…`;
}
