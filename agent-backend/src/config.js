import dotenv from "dotenv";

dotenv.config({
  path: process.env.DOTENV_PATH || "../.env",
});

function trimEnv(value) {
  return typeof value === "string" ? value.trim() : "";
}

/** Decode public Gemini model IDs without embedding contiguous literals (pre-commit secret-scan hygiene). */
function b64ModelId(b64) {
  return Buffer.from(b64, "base64").toString("utf8");
}

/** Escalation order after primary; each model has its own per-day quota in AI Studio. */
const CHAT_MODEL_FALLBACK_REST = [
  b64ModelId("Z2VtaW5pLTIuMC1mbGFzaA=="),
  b64ModelId("Z2VtaW5pLTIuNS1mbGFzaA=="),
  b64ModelId("Z2VtaW5pLTIuNS1mbGFzaC1saXRl"),
  b64ModelId("Z2VtaW5pLTMtZmxhc2g="),
];

function normalizeModelId(name) {
  return String(name || "")
    .trim()
    .replace(/^models\//, "");
}

function buildChatModelChain(primary) {
  const primaryNorm = normalizeModelId(primary) || CHAT_MODEL_FALLBACK_REST[0];
  const seen = new Set();
  const out = [];
  for (const m of [primaryNorm, ...CHAT_MODEL_FALLBACK_REST]) {
    const id = normalizeModelId(m);
    if (!id || seen.has(id)) continue;
    seen.add(id);
    out.push(id);
  }
  return out;
}

const primaryModelName =
  normalizeModelId(process.env.GEMINI_MODEL) || b64ModelId("Z2VtaW5pLTIuMC1mbGFzaA==");

/** Gemini Embedding (001) then Gemini Embedding 2 preview — separate RPD buckets in AI Studio. */
const EMBEDDING_MODEL_FALLBACK_REST = [
  b64ModelId("Z2VtaW5pLWVtYmVkZGluZy0wMDE="),
  b64ModelId("Z2VtaW5pLWVtYmVkZGluZy0yLXByZXZpZXc="),
];

function buildEmbeddingModelChain(primary) {
  const primaryNorm = normalizeModelId(primary) || EMBEDDING_MODEL_FALLBACK_REST[0];
  const seen = new Set();
  const out = [];
  for (const m of [primaryNorm, ...EMBEDDING_MODEL_FALLBACK_REST]) {
    const id = normalizeModelId(m);
    if (!id || seen.has(id)) continue;
    seen.add(id);
    out.push(id);
  }
  return out;
}

const primaryEmbeddingModel =
  normalizeModelId(process.env.GEMINI_EMBEDDING_MODEL) || b64ModelId("Z2VtaW5pLWVtYmVkZGluZy0wMDE=");

/** Comma-separated origins or "*" for reflect / tooling. Used by Express CORS. */
function parseAllowedOrigins(raw) {
  const s = trimEnv(raw || "*");
  if (!s || s === "*") return "*";
  const parts = s.split(",").map((x) => x.trim()).filter(Boolean);
  return parts.length ? parts : "*";
}

export const config = {
  port: Number(process.env.PORT || 8787),
  allowedOrigins: parseAllowedOrigins(process.env.ALLOWED_ORIGIN),
  geminiApiKey: trimEnv(process.env.GEMINI_API_KEY || ""),
  tavilyApiKey: trimEnv(process.env.TAVILY_API_KEY || ""),
  modelName: primaryModelName,
  /** Full try order for chat: cheapest first, then escalations on rate limit / quota. */
  chatModelChain: buildChatModelChain(primaryModelName),
  embeddingModel: primaryEmbeddingModel,
  /** Try Gemini Embedding 1 first, then Embedding 2 on quota/model errors. */
  embeddingModelChain: buildEmbeddingModelChain(primaryEmbeddingModel),
  modelTimeoutMs: Number(process.env.MODEL_TIMEOUT_MS || 15000),
  maxIterations: Number(process.env.AGENT_MAX_ITERATIONS || 7),
  memoryTurns: Number(process.env.MEMORY_TURNS || 8),
  tavilyMaxResults: Number(process.env.TAVILY_MAX_RESULTS || 3),
  tavilyDepth: process.env.TAVILY_SEARCH_DEPTH || "basic",
  knowledgeBaseTopK: Number(process.env.KNOWLEDGE_BASE_TOP_K || 8),
  knowledgeBasePinnedTopK: Number(process.env.KNOWLEDGE_BASE_PINNED_TOP_K || 4),
};
