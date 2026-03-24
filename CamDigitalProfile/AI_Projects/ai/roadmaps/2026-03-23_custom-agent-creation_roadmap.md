# Custom Agent Creation — Roadmap
_Date: 2026-03-23_

> **Verification note (2026-03-24):** Several tasks here were checked against intent before the backend was audited against PRD v1.2. **ReAct orchestration, vector RAG, and per-tool structured logging** require rework—see `2026-03-24_rubric-completion_agent-hardening_roadmap.md` for the authoritative submit-ready checklist.

## Links
- PRD: `CamDigitalProfile/AI_Projects/aiDocs/custom-agent-creation-prd.md`
- Plan: `CamDigitalProfile/AI_Projects/ai/roadmaps/2026-03-23_custom-agent-creation_plan.md`
- Context: `CamDigitalProfile/AI_Projects/aiDocs/context.md`
- JARVIS: `CamDigitalProfile/AI_Projects/docs/JARVIS-ACCOUNTABILITY.md`

## Constraints and Scope Guardrails
- No new AWS infrastructure in this phase.
- RAG corpus ingestion scaling workflow is deferred.
- User-facing transparency reveals tool names only.
- Environment parity requirement: keep `GEMINI_API_KEY` and `TAVILY_API_KEY` present in both local `.env` and AWS Amplify env settings (same exact names).

## Phase 0 — Discovery and Setup
- [x] Confirm agent backend location and API route within current repo structure.
- [x] Confirm frontend integration point (`index.html` vs dedicated AI page).
- [x] Add/verify env var loading for `GEMINI_API_KEY` and `TAVILY_API_KEY`.
- [x] Confirm `.gitignore` protects `.env`, `.testEnvVars`, and secret-like files.
- [x] Define initial test prompts for calculator, web search, memory, and error paths.

Completion criteria:
- [x] File/folder ownership for frontend and backend is documented.
- [x] Secret-loading strategy is implemented without exposing keys in code or logs.
- [x] Initial validation prompt set exists for development checks.

## Phase 1 — Core Agent Backend (MVP Core)
- [x] Implement chat endpoint contract: `message` + `sessionId` in, `answer` + metadata out.
- [x] Configure Gemini model with LangChain ReAct-style orchestration.
- [x] Add recursion/iteration limits and upstream timeout handling.
- [x] Implement `calculator` tool (Zod schema + safe math parser + graceful errors).
- [x] Implement `web_search` tool (Zod schema + Tavily wrapper + normalized sources).
- [x] Add tool-routing prompt guidance in agent instructions.

Completion criteria:
- [ ] Chat endpoint returns stable responses for basic prompts.
- [ ] Calculator queries reliably call `calculator`.
- [ ] Fresh/external info prompts reliably call `web_search`.
- [x] Tool failures return controlled, user-safe responses.

## Phase 2 — Frontend Chat Integration + Memory
- [x] Build/integrate chat UI into CamDigitalProfile frontend.
- [x] Wire submit/send flow to backend endpoint.
- [x] Render assistant responses with loading/streaming state where available.
- [x] Implement per-session short-term memory flow using `sessionId`.
- [x] Display "tools used" metadata in response UI (names only).
- [x] Add UI-level graceful error rendering (no broken chat state).

Completion criteria:
- [ ] User can complete multi-turn chat from website UI.
- [ ] Follow-up prompts are context-aware within session limits.
- [x] Tool usage is visible at high level without exposing internal reasoning.

## Phase 3 — Hardening, Logging, and Controls
- [x] Add structured JSON logs for request, tool usage summary, and errors.
- [x] Ensure logs exclude secrets and minimize sensitive user content.
- [x] Add basic rate/cost controls (limits and sensible defaults).
- [x] Validate prompt-injection mitigations in system prompt and tool handling.
- [x] Add/confirm smoke checks and documented local run commands.

Completion criteria:
- [x] Logs are useful for debugging and test-fix loop analysis.
- [x] No secrets appear in repository, logs, or user-visible responses.
- [x] Timeout, loop-limit, and cost guardrails are active.

## Phase 4 — Assignment-Complete (RAG Tool)
- [x] Implement `knowledge_base` tool with `{ query: string }` schema.
- [x] Add baseline corpus of at least 5 meaningful Cameron docs.
- [x] Return snippets with source attribution for retrieved passages.
- [x] Add no-results behavior with clear fallback text.
- [ ] Validate multi-tool routing across all three tools.

Completion criteria:
- [ ] Knowledge tool is callable and helpful for profile/project questions.
- [ ] Responses include source attribution where applicable.
- [ ] Tool-routing checks cover calculator, web_search, and knowledge_base.

## Phase 5 — Verification, Documentation, and Handoff
- [ ] Verify delivered behavior against PRD MVP criteria.
- [ ] Verify assignment-complete criteria against rubric expectations.
- [x] Update any changed developer docs (commands, run/test notes, constraints).
- [x] Add concise changelog entry describing outcomes and rationale.
- [x] Prepare recruiter demo script (5-8 canonical prompts).

Completion criteria:
- [ ] PRD acceptance criteria are demonstrably met or explicitly deferred.
- [x] Documentation is current and usable by a fresh contributor.
- [ ] Demo path consistently showcases tool use + memory.

## Validation Checklist (Cross-Phase)
- [ ] Typical recruiter question yields first useful response quickly and clearly.
- [ ] At least one multi-turn follow-up works correctly.
- [x] Invalid math expression fails gracefully.
- [x] Upstream model/tool outage fails gracefully.
- [x] No secrets committed or echoed in logs.

## Suggested Execution Cadence
- Phase 0-1 in first implementation cycle.
- Phase 2-3 in second cycle.
- Phase 4-5 in final rubric-completion cycle.
