import fs from "node:fs/promises";
import path from "node:path";
import { tool } from "langchain";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { z } from "zod";
import { config } from "../config.js";
import { chunkText, topKByEmbedding } from "../rag/vectorRetrieval.js";
import { logToolFailure, logToolComplete, logToolInvoked } from "../logger.js";

const schema = z.object({
  query: z.string().min(2),
});

const DOCUMENTS_DIR = "../CamDigitalProfile/assets/documents";

const STATIC_SOURCE_FILES = [
  "../CamDigitalProfile/AI_Projects/aiDocs/custom-agent-creation-prd.md",
  "../CamDigitalProfile/AI_Projects/docs/AGENT-PROJECT-RUBRIC.md",
  "../CamDigitalProfile/AI_Projects/aiDocs/context.md",
];

/** Indexed `source` paths always considered for retrieval (merged ahead of global top-k). */
const PINNED_HIGH_VALUE_SOURCES = new Set([
  "CamDigitalProfile/assets/documents/Website_Architecture_and_Runtime.md",
]);

function chunkDedupeKey(row) {
  return `${row.source}::${row.text.slice(0, 240)}`;
}

/**
 * Ranks pinned sources on the query, then fills with global top-k, deduping by chunk identity.
 */
export function mergePinnedAndGlobalHits(queryVec, entries, globalK, pinnedK, pinnedSources) {
  const wrapped = entries.map((row) => ({ embedding: row.embedding, payload: row }));
  const pinnedWrapped = entries
    .filter((row) => pinnedSources.has(row.source))
    .map((row) => ({ embedding: row.embedding, payload: row }));

  const pinnedHits =
    pinnedWrapped.length > 0
      ? topKByEmbedding(queryVec, pinnedWrapped, Math.min(pinnedK, pinnedWrapped.length))
      : [];

  const globalHits = topKByEmbedding(queryVec, wrapped, globalK);

  const seen = new Set();
  const merged = [];

  for (const h of pinnedHits) {
    const p = h.entry.payload;
    const key = chunkDedupeKey(p);
    if (!seen.has(key)) {
      seen.add(key);
      merged.push(h);
    }
  }
  for (const h of globalHits) {
    const p = h.entry.payload;
    const key = chunkDedupeKey(p);
    if (!seen.has(key)) {
      seen.add(key);
      merged.push(h);
    }
  }

  return merged;
}

async function loadCorpus() {
  const documentsDirAbsolute = path.resolve(process.cwd(), DOCUMENTS_DIR);
  const documentEntries = await fs.readdir(documentsDirAbsolute, { withFileTypes: true });
  const transcriptAndResumeFiles = documentEntries
    .filter((entry) => entry.isFile())
    .map((entry) => entry.name)
    .filter((fileName) => fileName.endsWith(".md") || fileName.endsWith(".txt"))
    .map((fileName) => `${DOCUMENTS_DIR}/${fileName}`);

  const sourceFiles = [...transcriptAndResumeFiles, ...STATIC_SOURCE_FILES];
  const docs = await Promise.all(
    sourceFiles.map(async (relativePath) => {
      const absolutePath = path.resolve(process.cwd(), relativePath);
      const content = await fs.readFile(absolutePath, "utf8");
      return { source: relativePath.replace(/^\.\.\//, ""), content };
    }),
  );
  return docs;
}

/** @type {Promise<{ entries: { embedding: number[]; text: string; source: string }[] } | null> | null} */
let indexPromise = null;

async function buildVectorIndex() {
  if (!config.geminiApiKey) {
    return null;
  }

  const embeddings = new GoogleGenerativeAIEmbeddings({
    apiKey: config.geminiApiKey,
    model: config.embeddingModel,
  });

  const corpus = await loadCorpus();
  const rows = [];
  for (const doc of corpus) {
    const pieces = chunkText(doc.content);
    for (const text of pieces) {
      rows.push({ text, source: doc.source });
    }
  }

  if (!rows.length) {
    return { entries: [] };
  }

  const texts = rows.map((r) => r.text);
  const vectors = await embeddings.embedDocuments(texts);
  const entries = rows.map((row, i) => ({
    embedding: vectors[i] || [],
    text: row.text,
    source: row.source,
  }));

  return { entries: entries.filter((e) => e.embedding.length) };
}

export function warmKnowledgeIndex() {
  indexPromise = buildVectorIndex().catch((err) => {
    indexPromise = null;
    throw err;
  });
  return indexPromise;
}

async function ensureIndex() {
  if (!indexPromise) {
    warmKnowledgeIndex();
  }
  try {
    return await indexPromise;
  } catch {
    warmKnowledgeIndex();
    return await indexPromise;
  }
}

export function createKnowledgeBaseTool({ toolTracker, traceId }) {
  return tool(
    async ({ query }) => {
      toolTracker("knowledge_base");
      const argsSummary = JSON.stringify({ query });
      logToolInvoked(traceId, "knowledge_base", argsSummary);
      const started = Date.now();
      try {
        if (!config.geminiApiKey) {
          const msg = "Knowledge base is unavailable: GEMINI_API_KEY is not configured (required for embeddings).";
          logToolComplete(traceId, "knowledge_base", argsSummary, msg, false, Date.now() - started);
          return msg;
        }

        const index = await ensureIndex();
        if (!index || !index.entries.length) {
          const msg = "Knowledge base index is not ready yet.";
          logToolComplete(traceId, "knowledge_base", argsSummary, msg, false, Date.now() - started);
          return msg;
        }

        const embeddings = new GoogleGenerativeAIEmbeddings({
          apiKey: config.geminiApiKey,
          model: config.embeddingModel,
        });
        const qVec = await embeddings.embedQuery(query);
        const hits = mergePinnedAndGlobalHits(
          qVec,
          index.entries,
          config.knowledgeBaseTopK,
          config.knowledgeBasePinnedTopK,
          PINNED_HIGH_VALUE_SOURCES,
        );

        if (!hits.length) {
          const msg = "No relevant documents found in the current knowledge base.";
          logToolComplete(traceId, "knowledge_base", argsSummary, msg, true, Date.now() - started);
          return msg;
        }

        const body = hits
          .map((h, i) => {
            const p = h.entry.payload;
            const snippet = p.text.length > 500 ? p.text.slice(0, 500) + "…" : p.text;
            return `${i + 1}. Source: ${p.source}\nSimilarity: ${h.score.toFixed(4)}\nSnippet: ${snippet}`;
          })
          .join("\n\n");

        logToolComplete(traceId, "knowledge_base", argsSummary, body, true, Date.now() - started);
        return body;
      } catch (error) {
        logToolFailure(traceId, "knowledge_base", argsSummary, error, Date.now() - started);
        return `Knowledge base lookup failed: ${error.message}`;
      }
    },
    {
      name: "knowledge_base",
      description:
        "Use for questions about Cameron's background, projects, resume, and portfolio docs. Retrieves semantically similar passages with source paths.",
      schema,
    },
  );
}

/** Test helper: rank precomputed vectors without calling Gemini. */
export function rankChunksForTest(queryVec, chunks, k = 8) {
  const wrapped = chunks.map((c) => ({
    embedding: c.embedding,
    payload: { text: c.text, source: c.source },
  }));
  return topKByEmbedding(queryVec, wrapped, k).map((h) => ({
    source: h.entry.payload.source,
    score: h.score,
    text: h.entry.payload.text,
  }));
}
