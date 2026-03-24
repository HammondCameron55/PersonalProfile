import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { create, all } from "mathjs";
import { HumanMessage } from "@langchain/core/messages";
import { createAgent, FakeToolCallingModel, tool, toolCallLimitMiddleware } from "langchain";
import { z } from "zod";
import { appendToSession, clearMemory, getSessionHistory } from "../src/memory.js";
import { cosineSimilarity, topKByEmbedding } from "../src/rag/vectorRetrieval.js";
import { mergePinnedAndGlobalHits, rankChunksForTest } from "../src/tools/knowledgeBase.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function testMemoryRetention() {
  clearMemory();
  const sessionId = "test-session";
  appendToSession(sessionId, "Hi", "Hello", 2);
  appendToSession(sessionId, "What did I ask?", "You said Hi.", 2);
  appendToSession(sessionId, "One more", "Done", 2);
  const history = getSessionHistory(sessionId);
  assert.equal(history.length, 4, "memory should keep rolling N turns");
  assert.equal(history[0].content, "What did I ask?");
}

function testCalculatorGracefulFailure() {
  const math = create(all);
  let failed = false;
  try {
    math.evaluate("2+(");
  } catch (_error) {
    failed = true;
  }
  assert.equal(failed, true, "invalid expressions should throw in raw math parser");
}

function testCosineAndRank() {
  const a = [1, 0, 0];
  const b = [1, 0, 0];
  const c = [0, 1, 0];
  assert.ok(Math.abs(cosineSimilarity(a, b) - 1) < 1e-6);
  assert.ok(Math.abs(cosineSimilarity(a, c)) < 1e-6);
  const entries = [
    { embedding: [1, 0, 0], payload: { id: "x" } },
    { embedding: [0, 1, 0], payload: { id: "y" } },
  ];
  const top = topKByEmbedding([1, 0, 0], entries, 1);
  assert.equal(top[0].entry.payload.id, "x");
}

function testRankChunksFixture() {
  const chunks = [
    { embedding: [0.95, 0.28, 0], text: "aws lambda", source: "Architecture.md" },
    { embedding: [0.2, 0.1, 0.05], text: "related but weaker", source: "Other.md" },
  ];
  const q = [1, 0, 0];
  const ranked = rankChunksForTest(q, chunks);
  assert.equal(ranked[0].source, "Architecture.md");
  assert.ok(ranked.length >= 2, "fixture should yield multiple ranked chunks");
  assert.ok(ranked[0].score > ranked[1].score);
}

function testMergePinnedSurfacesArchitectureDoc() {
  const arch = "CamDigitalProfile/assets/documents/Website_Architecture_and_Runtime.md";
  const entries = [
    { embedding: [1, 0, 0], text: "sonicwall aws shop long chunk", source: "SonicWall.md" },
    { embedding: [0.85, 0.5, 0], text: "amplify route53 lambda dynamodb", source: arch },
  ];
  const q = [1, 0, 0];
  const pinned = new Set([arch]);
  const merged = mergePinnedAndGlobalHits(q, entries, 2, 2, pinned);
  assert.equal(merged[0].entry.payload.source, arch, "pinned source should lead merged results");
}

function testAgentUsesLangChainReActNotHeuristicRouter() {
  const agentSrc = fs.readFileSync(path.join(__dirname, "../src/agent.js"), "utf8");
  assert.match(agentSrc, /createAgent\s*\(/);
  assert.doesNotMatch(agentSrc, /shouldUseCalculator/);
  assert.doesNotMatch(agentSrc, /shouldUseWebSearch/);
  assert.doesNotMatch(agentSrc, /shouldUseKnowledgeBase/);
}

function testKnowledgeBaseUsesVectors() {
  const kbSrc = fs.readFileSync(path.join(__dirname, "../src/tools/knowledgeBase.js"), "utf8");
  assert.match(kbSrc, /GoogleGenerativeAIEmbeddings/);
  assert.match(kbSrc, /topKByEmbedding/);
  assert.doesNotMatch(kbSrc, /scoreSnippet/);
}

async function testFakeModelAgentRunsToolNode() {
  const calc = tool(
    async ({ expression }) => `Result: ${expression}`,
    {
      name: "calculator",
      description: "Calculator",
      schema: z.object({ expression: z.string() }),
    },
  );

  const fake = new FakeToolCallingModel({
    toolCalls: [[{ name: "calculator", id: "t1", args: { expression: "3*4" } }], []],
  });

  const agent = createAgent({
    model: fake,
    tools: [calc],
    systemPrompt: "Use calculator for math.",
    middleware: [toolCallLimitMiddleware({ runLimit: 5, exitBehavior: "continue" })],
  });

  const out = await agent.invoke(
    { messages: [new HumanMessage("Compute 3*4")] },
    { recursionLimit: 25 },
  );

  const types = (out.messages ?? []).map((m) => m._getType?.());
  assert.ok(types.includes("tool"), "agent graph should emit a tool message");
  const toolMsg = (out.messages ?? []).find((m) => m._getType?.() === "tool");
  assert.ok(String(toolMsg.content).includes("3*4"), "calculator tool should execute");
}

async function run() {
  testMemoryRetention();
  testCalculatorGracefulFailure();
  testCosineAndRank();
  testRankChunksFixture();
  testMergePinnedSurfacesArchitectureDoc();
  testAgentUsesLangChainReActNotHeuristicRouter();
  testKnowledgeBaseUsesVectors();
  await testFakeModelAgentRunsToolNode();
  console.log("All backend unit checks passed.");
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
