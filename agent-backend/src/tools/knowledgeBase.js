import fs from "node:fs/promises";
import path from "node:path";
import { tool } from "langchain";
import { z } from "zod";

const schema = z.object({
  query: z.string().min(2),
});

const DOCUMENTS_DIR = "../CamDigitalProfile/assets/documents";

const STATIC_SOURCE_FILES = [
  "../CamDigitalProfile/AI_Projects/aiDocs/custom-agent-creation-prd.md",
  "../CamDigitalProfile/AI_Projects/docs/AGENT-PROJECT-RUBRIC.md",
  "../CamDigitalProfile/AI_Projects/aiDocs/context.md",
];

function scoreSnippet(snippet, queryTokens) {
  const lower = snippet.toLowerCase();
  return queryTokens.reduce((score, token) => score + (lower.includes(token) ? 1 : 0), 0);
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
      return { source: relativePath.replace("../", ""), content };
    }),
  );
  return docs;
}

export function createKnowledgeBaseTool(toolTracker) {
  let cachedCorpus = null;

  return tool(
    async ({ query }) => {
      toolTracker("knowledge_base");
      try {
        if (!cachedCorpus) {
          cachedCorpus = await loadCorpus();
        }
        const queryTokens = query.toLowerCase().split(/\W+/).filter(Boolean);
        const candidates = [];

        for (const doc of cachedCorpus) {
          const paragraphs = doc.content
            .split(/\n{2,}/)
            .map((part) => part.trim())
            .filter((part) => part.length > 40);

          for (const para of paragraphs) {
            const score = scoreSnippet(para, queryTokens);
            if (score > 0) {
              candidates.push({ score, source: doc.source, snippet: para.slice(0, 500) });
            }
          }
        }

        const top = candidates.sort((a, b) => b.score - a.score).slice(0, 3);
        if (!top.length) {
          return "No relevant documents found in the current knowledge base.";
        }

        return top
          .map(
            (item, index) =>
              `${index + 1}. Source: ${item.source}\nSnippet: ${item.snippet}`,
          )
          .join("\n\n");
      } catch (error) {
        return `Knowledge base lookup failed: ${error.message}`;
      }
    },
    {
      name: "knowledge_base",
      description:
        "Use for questions about Cameron's background, projects, resume, and portfolio docs. Return source-backed answers.",
      schema,
    },
  );
}
