/**
 * Maps upstream Gemini / @langchain/google-genai errors to stable codes and safe messages.
 * Never forwards raw provider bodies to clients in production.
 */

const DEBUG_ERRORS =
  process.env.AGENT_DEBUG_ERRORS === "1" || process.env.NODE_ENV === "development";

/** True when retrying the same request on another chat model may help (shared quota/rate errors). */
export function isGeminiRateLimitOrQuotaError(err) {
  if (err == null) return false;
  const status = err.status ?? err.response?.status ?? err.lc_kwargs?.status;
  if (status === 429) return true;
  const msg = String(err.message || err || "");
  if (
    /429|Too Many Requests|quota exceeded|rate limit|RESOURCE_EXHAUSTED|exceeded your current quota|Quota exceeded/i.test(
      msg,
    )
  ) {
    return true;
  }
  const cause = err.cause;
  if (cause && cause !== err) return isGeminiRateLimitOrQuotaError(cause);
  return false;
}

/**
 * When Embedding 1 is exhausted or unavailable, trying Embedding 2 may succeed (separate quota / model).
 * Do not use for auth errors (same key would fail on both).
 */
export function isGeminiEmbeddingFallbackError(err) {
  if (err == null) return false;
  const msg = String(err.message || err || "");
  if (/401|403|API key|invalid.*key|permission denied/i.test(msg)) return false;
  if (isGeminiRateLimitOrQuotaError(err)) return true;
  if (
    /404|not found for API version|is not supported for.*embed|embedContent|generateContent|models\//i.test(
      msg,
    )
  ) {
    return true;
  }
  const cause = err.cause;
  if (cause && cause !== err) return isGeminiEmbeddingFallbackError(cause);
  return false;
}

export function mapGeminiError(err) {
  const msg = String(err?.message || err || "");

  if (isGeminiRateLimitOrQuotaError(err)) {
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
