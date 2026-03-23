# Custom Agent Creation — Roadmap
_Date: 2026-03-23_

## Links
- PRD: `CamDigitalProfile/AI_Projects/aiDocs/custom-agent-creation-prd.md`
- Plan: `CamDigitalProfile/AI_Projects/ai/roadmaps/2026-03-23_custom-agent-creation_plan.md`
- Context: `CamDigitalProfile/AI_Projects/aiDocs/context.md`
- JARVIS: `CamDigitalProfile/AI_Projects/docs/JARVIS-ACCOUNTABILITY.md`

## Constraints and Scope Guardrails
- No new AWS infrastructure in this phase.
- RAG corpus ingestion scaling workflow is deferred.
- User-facing transparency reveals tool names only.

## Phase 0 — Discovery and Setup
- [ ] Confirm agent backend location and API route within current repo structure.
- [ ] Confirm frontend integration point (`index.html` vs dedicated AI page).
- [ ] Add/verify env var loading for `GEMINI_API_KEY` and `TAVILY_API_KEY`.
- [ ] Confirm `.gitignore` protects `.env`, `.testEnvVars`, and secret-like files.
- [ ] Define initial test prompts for calculator, web search, memory, and error paths.

Completion criteria:
- [ ] File/folder ownership for frontend and backend is documented.
- [ ] Secret-loading strategy is implemented without exposing keys in code or logs.
- [ ] Initial validation prompt set exists for development checks.

## Phase 1 — Core Agent Backend (MVP Core)
- [ ] Implement chat endpoint contract: `message` + `sessionId` in, `answer` + metadata out.
- [ ] Configure Gemini model with LangChain ReAct-style orchestration.
- [ ] Add recursion/iteration limits and upstream timeout handling.
- [ ] Implement `calculator` tool (Zod schema + safe math parser + graceful errors).
- [ ] Implement `web_search` tool (Zod schema + Tavily wrapper + normalized sources).
- [ ] Add tool-routing prompt guidance in agent instructions.

Completion criteria:
- [ ] Chat endpoint returns stable responses for basic prompts.
- [ ] Calculator queries reliably call `calculator`.
- [ ] Fresh/external info prompts reliably call `web_search`.
- [ ] Tool failures return controlled, user-safe responses.

## Phase 2 — Frontend Chat Integration + Memory
- [ ] Build/integrate chat UI into CamDigitalProfile frontend.
- [ ] Wire submit/send flow to backend endpoint.
- [ ] Render assistant responses with loading/streaming state where available.
- [ ] Implement per-session short-term memory flow using `sessionId`.
- [ ] Display "tools used" metadata in response UI (names only).
- [ ] Add UI-level graceful error rendering (no broken chat state).

Completion criteria:
- [ ] User can complete multi-turn chat from website UI.
- [ ] Follow-up prompts are context-aware within session limits.
- [ ] Tool usage is visible at high level without exposing internal reasoning.

## Phase 3 — Hardening, Logging, and Controls
- [ ] Add structured JSON logs for request, tool usage summary, and errors.
- [ ] Ensure logs exclude secrets and minimize sensitive user content.
- [ ] Add basic rate/cost controls (limits and sensible defaults).
- [ ] Validate prompt-injection mitigations in system prompt and tool handling.
- [ ] Add/confirm smoke checks and documented local run commands.

Completion criteria:
- [ ] Logs are useful for debugging and test-fix loop analysis.
- [ ] No secrets appear in repository, logs, or user-visible responses.
- [ ] Timeout, loop-limit, and cost guardrails are active.

## Phase 4 — Assignment-Complete (RAG Tool)
- [ ] Implement `knowledge_base` tool with `{ query: string }` schema.
- [ ] Add baseline corpus of at least 5 meaningful Cameron docs.
- [ ] Return snippets with source attribution for retrieved passages.
- [ ] Add no-results behavior with clear fallback text.
- [ ] Validate multi-tool routing across all three tools.

Completion criteria:
- [ ] Knowledge tool is callable and helpful for profile/project questions.
- [ ] Responses include source attribution where applicable.
- [ ] Tool-routing checks cover calculator, web_search, and knowledge_base.

## Phase 5 — Verification, Documentation, and Handoff
- [ ] Verify delivered behavior against PRD MVP criteria.
- [ ] Verify assignment-complete criteria against rubric expectations.
- [ ] Update any changed developer docs (commands, run/test notes, constraints).
- [ ] Add concise changelog entry describing outcomes and rationale.
- [ ] Prepare recruiter demo script (5-8 canonical prompts).

Completion criteria:
- [ ] PRD acceptance criteria are demonstrably met or explicitly deferred.
- [ ] Documentation is current and usable by a fresh contributor.
- [ ] Demo path consistently showcases tool use + memory.

## Validation Checklist (Cross-Phase)
- [ ] Typical recruiter question yields first useful response quickly and clearly.
- [ ] At least one multi-turn follow-up works correctly.
- [ ] Invalid math expression fails gracefully.
- [ ] Upstream model/tool outage fails gracefully.
- [ ] No secrets committed or echoed in logs.

## Suggested Execution Cadence
- Phase 0-1 in first implementation cycle.
- Phase 2-3 in second cycle.
- Phase 4-5 in final rubric-completion cycle.
