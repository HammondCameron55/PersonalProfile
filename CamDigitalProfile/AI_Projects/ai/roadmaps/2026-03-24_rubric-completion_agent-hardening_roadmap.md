# Rubric completion — Agent hardening roadmap
_Date: 2026-03-24_

## Links
- PRD: `CamDigitalProfile/AI_Projects/aiDocs/custom-agent-creation-prd.md` (v1.2)
- Plan: `CamDigitalProfile/AI_Projects/ai/roadmaps/2026-03-24_rubric-completion_agent-hardening_plan.md`
- Context (update): `CamDigitalProfile/AI_Projects/aiDocs/context.md`
- Changelog (append): `CamDigitalProfile/AI_Projects/aiDocs/changelog.md`

## Phase A — Baseline audit (same day)
- [ ] Re-read PRD §FR-4, FR-7, FR-9 and `docs/class_Rubric.md` assignment wording.
- [ ] Confirm current `agent-backend/src/agent.js` is heuristic-based (baseline for diff).
- [ ] List embedding model ID and confirm Gemini quota covers embed + chat.

**Done when:** Team agrees “replace router” is in scope for turn-in.

## Phase B — ReAct / LangChain agent core
- [ ] Replace `runAgent` with LangChain **`createAgent`** (or equivalent documented graph) using existing tools (`calculator`, `web_search`, `knowledge_base`).
- [ ] Wire **max iteration / recursion limit** from config (align with runbook `AGENT_MAX_ITERATIONS`).
- [ ] Pass **conversation history** into the agent in the format your chosen API expects (trimmed messages).
- [ ] Remove or quarantine heuristic `shouldUse*` routing from the primary code path.
- [ ] Manual smoke: one prompt each for calc, Tavily search, profile question (KB), and one follow-up using memory.

**Done when:** Logs show **model-issued tool calls** (or LangChain tool steps) across turns, not pre-selected branches only.

## Phase C — Vector RAG (`knowledge_base`)
- [ ] Implement document load + chunking for corpus paths currently in `knowledgeBase.js` (and keep ≥5 meaningful sources).
- [ ] Build **embedding index** at server startup (or first request) using Gemini embeddings.
- [ ] Replace keyword `scoreSnippet` retrieval with **vector similarity** top-k.
- [ ] Preserve **source attribution** and no-results message behavior.
- [ ] Add a **unit test** that a fixed chunk returns for a fixed query vector fixture *or* document a repeatable manual vector check (if unit embedding is heavy).

**Done when:** Course “vector search” and PRD “semantic retrieval” are demonstrably true (screenshot/log acceptable for class).

## Phase D — Structured logging (FR-9a)
- [ ] Emit `tool.invoked` / `tool.completed` (names flexible) with **argsSummary** + **resultSummary** per tool call.
- [ ] On errors, log **stack** server-side when `error.stack` exists; keep client response safe.
- [ ] Redact secrets and long PII in summaries (truncate to N chars).

**Done when:** One chat request produces JSON lines that identify each tool, inputs, and outcome without reading source.

## Phase E — Tests and repo hygiene
- [ ] Replace or extend placeholder routing test with real assertions (mocked agent graph or integration opt-in).
- [ ] Add **`README.md`** at **PersonalProfile repo root**: purpose, structure (`agent-backend/` + `CamDigitalProfile/`), env vars, run commands, link to runbook.
- [ ] Update `aiDocs/context.md` — **Current focus** = submit-ready agent; backend no longer “planned.”
- [ ] Append `aiDocs/changelog.md` entry for v1.2 PRD + hardening.

**Done when:** `npm test` fails if someone reintroduces heuristic-only routing (where feasible) or at minimum documents manual rubric checklist.

## Phase F — Submission evidence
- [ ] Run full **demo script** from `AGENT-BACKEND-RUNBOOK.md` against running backend.
- [ ] Record **2-minute demo video** (assignment): UI + at least two distinct tools visible.
- [ ] Final pass: `AGENT-PROJECT-RUBRIC.md` §8 checklist all checked.

## Exit criteria (all must be true)
- [ ] ReAct satisfied by LangChain agent loop, not regex router.
- [ ] `knowledge_base` uses **embeddings + vector similarity**.
- [ ] Structured logs include **per-tool** arg and result summaries + error stacks when available.
- [ ] README + context accurate; roadmap Phase B–E complete.
