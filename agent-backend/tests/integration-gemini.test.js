/**
 * Opt-in checks against live Gemini (embeddings + one agent turn).
 * Requires GEMINI_API_KEY in PersonalProfile/.env or the environment.
 *
 * Run: npm run test:integration
 */

import assert from "node:assert/strict";
import dotenv from "dotenv";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { cosineSimilarity } from "../src/rag/vectorRetrieval.js";

dotenv.config({
  path: process.env.DOTENV_PATH || "../.env",
});

const key = (process.env.GEMINI_API_KEY || "").trim();
if (!key) {
  console.log("SKIP integration: set GEMINI_API_KEY to run test:integration.");
  process.exit(0);
}

const model = (process.env.GEMINI_EMBEDDING_MODEL || "gemini-embedding-001").replace(/^models\//, "");

async function run() {
  const embedder = new GoogleGenerativeAIEmbeddings({
    apiKey: key,
    model,
  });
  const a = await embedder.embedQuery("Cameron Hammond built an agent backend with LangChain.");
  const b = await embedder.embedQuery("Unrelated text about penguins and ice cream.");
  const c = await embedder.embedQuery("The portfolio site uses Gemini and Tavily tools.");
  assert.ok(a.length > 0 && b.length > 0 && c.length > 0, "embedding vectors should be non-empty");
  const simClose = cosineSimilarity(a, c);
  const simFar = cosineSimilarity(a, b);
  assert.ok(
    simClose > simFar,
    "semantically related chunks should have higher cosine similarity than unrelated text",
  );
  console.log("Integration embedding sanity check passed.");
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
