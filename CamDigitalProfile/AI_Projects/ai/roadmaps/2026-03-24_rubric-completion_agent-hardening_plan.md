# Rubric completion — Agent hardening (ReAct, vector RAG, logging)
_Date: 2026-03-24_

## Links
- PRD: `CamDigitalProfile/AI_Projects/aiDocs/custom-agent-creation-prd.md` (v1.2+)
- Prior plan (reference): `CamDigitalProfile/AI_Projects/ai/roadmaps/2026-03-23_custom-agent-creation_plan.md`
- Roadmap (execute this): `CamDigitalProfile/AI_Projects/ai/roadmaps/2026-03-24_rubric-completion_agent-hardening_roadmap.md`
- Rubrics: `CamDigitalProfile/AI_Projects/docs/AGENT-PROJECT-RUBRIC.md`, `CamDigitalProfile/AI_Projects/docs/class_Rubric.md`
- Backend: `agent-backend/`

## What went wrong (concise)

| Requirement | In PRD (pre–v1.2)? | In 2026-03-23 plan? | In roadmap? | Why the miss |
|-------------|-------------------|---------------------|---------------|--------------|
| **ReAct** | Yes (FR-4) | Yes | Marked done | Implementation used **regex routing + single tool + one `invoke`**, not LangChain’s **model-driven** tool loop. Roadmap lacked a “code review gate” tied to FR-4. |
| **Vector / semantic RAG** | Implied (“RAG”) but not explicit | Said “local retrieval module” | Marked done | **Keyword overlap** matched “snippets + sources” mentally; **course rubric says vector search** explicitly. |
| **Structured logging (args/results)** | Yes (FR-9) | Yes | Marked done | Only **request + `toolsUsed` array + errors** were logged; **no per-tool arg/result events**. |
| **Tests proving routing** | Yes (§5.3) | Yes | Partly open | Placeholder test (`testToolRoutingPromptSet`) never invoked the agent. |

**Conclusion:** This was **not** primarily a PRD/plan omission; it was **implementation shortcutting** plus **optimistic roadmap checkoffs** without verification against `FR-4`, `FR-7`, and `FR-9`. PRD v1.2 removes ambiguity (vector required; heuristic-only routing forbidden; logging spelled out).

## Technical approach (high level)

### 1) Replace heuristic orchestration with LangChain ReAct-style agent
- Use `createAgent` (LangChain v1) or LangGraph with **bindTools** / tool node, Gemini **`ChatGoogleGenerativeAI`**, `MessagesAnnotation` or equivalent message list, and **max iterations** from env (already documented in runbook).
- **Remove** `shouldUseCalculator` / `shouldUseWebSearch` / `shouldUseKnowledgeBase` as the primary control path (or reduce to optional telemetry only).
- System prompt steers tool use; **model** chooses tools and may call **multiple** steps in one user turn (within cap).

### 2) Rebuild `knowledge_base` with embeddings
- Chunk markdown corpus (existing paths under `CamDigitalProfile/assets/documents/` + static PRD/rubric/context files).
- Embed with **Gemini embedding API** (or LangChain’s Google embeddings wrapper) for consistency with current stack.
- Store in **`MemoryVectorStore`** (or similar) built at server startup; optional file cache later for performance (stretch: persistent store).
- Tool handler: `similaritySearchWithScore` (or API equivalent), return top-k snippets with **source paths**; keep graceful no-results string.

### 3) Structured logging (FR-9 / FR-9a)
- On each tool execution: `logEvent("info", "tool.completed", { traceId, tool, argsSummary, resultSummary, durationMs? })`.
- On tool error: same with `level: error` and message; agent failures include `stack` when present.
- Keep redaction rules for secrets.

### 4) Verification
- Extend `agent-backend/tests/run-tests.js` (or add `tests/agent-routing.integration.test.js`) to:
  - Mock LLM **or** use recorded fixtures if CI must stay offline—**at minimum**, unit-test the **vector store** returns expected doc for a known query embedding fixture **or** smoke test with real API in `npm run test:integration` (document opt-in).
  - Document manual **demo script** alignment with runbook prompts.
- Add root **`README.md`** (course deliverable): clone, `cd agent-backend`, `npm install`, env vars, `npm run dev`, open site, expected behavior.

### 5) Docs sync
- Update `CamDigitalProfile/AI_Projects/aiDocs/context.md` “Current Focus” to **implemented** backend + pointer to PRD v1.2.
- Update `AGENT-BACKEND-RUNBOOK.md` if env vars change (e.g., embedding model id).

## Dependencies
- `@langchain/google-genai` (existing) — confirm embedding API surface for chosen model.
- Possible additions: `@langchain/community` or core vectorstore helpers (follow LangChain v1 docs for your exact import path).

## Risks
- **Latency:** embedding + vector search per request—mitigate with startup indexing and small k.
- **Cost:** embedding calls—mitigate with batch embed at load time only.
- **Test flakiness:** integration tests hitting live Gemini—gate behind env flag.

## Definition of done (this hardening pass)
- PRD **FR-4**, **FR-7** (vector), and **FR-9** satisfied by production code paths.
- `class_Rubric.md` and `AGENT-PROJECT-RUBRIC.md` checklist passes manual + automated smoke level agreed in roadmap.
- Root `README.md` exists; `context.md` reflects reality.
