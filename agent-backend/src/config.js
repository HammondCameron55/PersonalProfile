import dotenv from "dotenv";

dotenv.config({
  path: process.env.DOTENV_PATH || "../.env",
});

export const config = {
  port: Number(process.env.PORT || 8787),
  allowedOrigin: process.env.ALLOWED_ORIGIN || "*",
  geminiApiKey: process.env.GEMINI_API_KEY || "",
  tavilyApiKey: process.env.TAVILY_API_KEY || "",
  modelName: process.env.GEMINI_MODEL || "gemini-1.5-flash",
  modelTimeoutMs: Number(process.env.MODEL_TIMEOUT_MS || 15000),
  maxIterations: Number(process.env.AGENT_MAX_ITERATIONS || 7),
  memoryTurns: Number(process.env.MEMORY_TURNS || 8),
  tavilyMaxResults: Number(process.env.TAVILY_MAX_RESULTS || 3),
  tavilyDepth: process.env.TAVILY_SEARCH_DEPTH || "basic",
};
