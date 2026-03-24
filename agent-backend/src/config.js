import dotenv from "dotenv";

dotenv.config({
  path: process.env.DOTENV_PATH || "../.env",
});

function trimEnv(value) {
  return typeof value === "string" ? value.trim() : "";
}

export const config = {
  port: Number(process.env.PORT || 8787),
  allowedOrigin: process.env.ALLOWED_ORIGIN || "*",
  geminiApiKey: trimEnv(process.env.GEMINI_API_KEY || ""),
  tavilyApiKey: trimEnv(process.env.TAVILY_API_KEY || ""),
  modelName: process.env.GEMINI_MODEL || "gemini-2.5-flash-lite",
  embeddingModel: (process.env.GEMINI_EMBEDDING_MODEL || "gemini-embedding-001").replace(/^models\//, ""),
  modelTimeoutMs: Number(process.env.MODEL_TIMEOUT_MS || 15000),
  maxIterations: Number(process.env.AGENT_MAX_ITERATIONS || 7),
  memoryTurns: Number(process.env.MEMORY_TURNS || 8),
  tavilyMaxResults: Number(process.env.TAVILY_MAX_RESULTS || 3),
  tavilyDepth: process.env.TAVILY_SEARCH_DEPTH || "basic",
  knowledgeBaseTopK: Number(process.env.KNOWLEDGE_BASE_TOP_K || 8),
  knowledgeBasePinnedTopK: Number(process.env.KNOWLEDGE_BASE_PINNED_TOP_K || 4),
};
