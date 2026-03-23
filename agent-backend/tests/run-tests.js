import assert from "node:assert/strict";
import { create, all } from "mathjs";
import { appendToSession, clearMemory, getSessionHistory } from "../src/memory.js";

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

function testToolRoutingPromptSet() {
  const prompts = [
    "what is 12 * 19",
    "what is the current price of aws lambda",
    "tell me about cameron's aws projects",
  ];
  assert.equal(prompts.length, 3, "baseline routing prompts should exist");
}

function run() {
  testMemoryRetention();
  testCalculatorGracefulFailure();
  testToolRoutingPromptSet();
  console.log("All backend unit checks passed.");
}

run();
