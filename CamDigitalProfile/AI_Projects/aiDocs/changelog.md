## Changelog — PersonalProfile / CamDigitalProfile

Entries are brief “what & why” notes, newest at the top. Keep this concise and focused on meaningful changes.

---

### 2026-03-24

- **Rubric hardening — ReAct agent, vector RAG, per-tool logs, tests, root README** *(PRD v1.2 / roadmap Phases B–E)*
  - Replaced heuristic keyword routing in `agent-backend/src/agent.js` with LangChain **`createAgent`** + **`toolCallLimitMiddleware`** (`AGENT_MAX_ITERATIONS`), **`ChatGoogleGenerativeAI`** tool loop, and session history as `HumanMessage` / `AIMessage` turns; LangGraph **`recursionLimit`** scaled with `maxIterations`.
  - Rebuilt **`knowledge_base`** with **`GoogleGenerativeAIEmbeddings`** (default model **`gemini-embedding-001`**, overridable via **`GEMINI_EMBEDDING_MODEL`**), paragraph chunking plus **`src/rag/vectorRetrieval.js`** fallback for short documents, startup **`warmKnowledgeIndex()`**, and in-memory cosine **top‑k** retrieval (sources + similarity scores; keyword **`scoreSnippet`** removed).
  - Extended **`logger.js`** with **`tool.invoked`**, **`tool.completed`**, **`tool.failed`** (truncated args/result previews; **`durationMs`**; stacks on failure); **`agent.failed`** includes **`stack`** when present.
  - Tests: **`npm test`** — vector/cosine fixtures, **`rankChunksForTest`** helper, source guards against heuristic-only **`agent.js`** and keyword-only **`knowledgeBase.js`**, **FakeToolCallingModel** + **`createAgent`** test that exercises the **tool** node; **`npm run test:integration`** — optional live embedding sanity check (**`GEMINI_API_KEY`** required; exits 0 with skip message if unset).
  - Docs/repo: root **`PersonalProfile/README.md`**, **`aiDocs/context.md`** (submit-ready focus), **`AGENT-BACKEND-RUNBOOK.md`** (**`GEMINI_EMBEDDING_MODEL`**, **`test:integration`**).
  - **Not in this code drop:** roadmap **Phase F** (manual demo script on running server, ~2‑minute assignment video, ticking **`AGENT-PROJECT-RUBRIC.md` §8** in the doc) — still on the human submission checklist.

- **Tavily client options + env trimming**
  - `web_search` now passes `maxResults` / `searchDepth` (camelCase) to `@tavily/core` as required by the SDK.
  - `GEMINI_API_KEY` and `TAVILY_API_KEY` are trimmed after load to avoid stray whitespace/BOM issues on Windows.
  - Clearer tool error text when Tavily returns auth failures; runbook notes on regenerating the Tavily key.

- **Web search routing + model reply formatting** *(historical; pre–ReAct hardening)*
  - Expanded `shouldUseWebSearch` keywords (`search`, `online`, `internet`, etc.) so prompts like “search online …” invoke Tavily instead of skipping tools. **Superseded:** same-day ReAct hardening removed **`shouldUse*`** routing; **`web_search`** is selected by the **model** via **`createAgent`**.
  - Normalized Gemini `response.content` (string vs multimodal parts) so empty arrays are not shown as literal `[]` in the chat UI.

- **Default Gemini model set to `gemini-2.5-flash-lite`**
  - Updated `agent-backend/src/config.js` default and documented in `AGENT-BACKEND-RUNBOOK.md`; optional `GEMINI_MODEL` in repo-root `.env` overrides.
  - Confirmed Live Server uses absolute `http://localhost:8787/api/agent/chat` via `index.html` (`window.AGENT_CHAT_ENDPOINT`).

### 2026-03-23

- **Structured chat error responses for debugging**
  - Backend maps Gemini/LangChain failures to stable `code` values and clearer `error` messages; optional `detail` when `AGENT_DEBUG_ERRORS=1` or `NODE_ENV=development`.
  - Frontend chat displays `code`, `traceId`, and `detail` when the server returns them.

- **Clarified agent secret management across local and Amplify**
  - Updated roadmap and runbook docs to state that local development reads `PersonalProfile/.env`, while deployment reads AWS Amplify environment variables.
  - Documented that both environments must define `GEMINI_API_KEY` and `TAVILY_API_KEY` with exact names to avoid runtime misconfiguration.
  - Added explicit warning about typoed variable names (such as `TAVILYL_API_KEY`) for future contributors and agents.

- **Audited custom-agent work against plan + roadmap and aligned status notes**
  - Reviewed `ai/roadmaps/2026-03-23_custom-agent-creation_plan.md` and `ai/roadmaps/2026-03-23_custom-agent-creation_roadmap.md` against implemented artifacts in `agent-backend/`, `CamDigitalProfile/index.html`, `assets/js/main.js`, and `assets/css/main.css`.
  - Confirmed core delivery is implemented: chat endpoint contract, LangChain+Gemini orchestration, `calculator`/`web_search`/`knowledge_base` tools, session memory flow, structured logging, and recruiter-facing chat UI with tool-usage disclosure.
  - Captured remaining open validation items from roadmap completion criteria: stable endpoint behavior checks, full multi-turn UI verification, and cross-tool routing verification across all three tools.
  - Kept changelog focus on outcome + readiness so follow-on verification can be tracked explicitly.

- **Implemented custom agent backend + website chat UI**
  - Created `agent-backend/` service with `POST /api/agent/chat` and `GET /api/agent/health`, structured JSON logs, payload validation, session memory, iteration limits, and timeout controls.
  - Added LangChain + Gemini agent orchestration and three tools: `calculator`, `web_search` (Tavily), and `knowledge_base` (5-document local corpus with source-attributed snippets).
  - Integrated a recruiter-facing chat panel into `CamDigitalProfile/index.html` with loading, graceful errors, and "tools used" disclosure in `assets/js/main.js` and `assets/css/main.css`.
  - Added backend verification utilities (`npm test`, `npm run smoke`) and documented local run/test/demo instructions in `CamDigitalProfile/AI_Projects/docs/AGENT-BACKEND-RUNBOOK.md`.

### 2026-03-12

- **Set up AI dev scaffolding**
  - Added `aiDocs/context.md` to describe repo structure, tech stack, and current focus on the AI agent + chat UI.
  - Created `aiDocs/changelog.md` to track high-level history.
  - Documented agent scope and rubric in `CamDigitalProfile/AI_Projects/docs/AGENT-AGENTIC-CONTEXT.md` and `AGENT-PROJECT-RUBRIC.md`.

- **Captured Gemini Deep Research**
  - Converted initial Gemini Deep Research output into a dated research document under `ai/roadmaps/` for the agent project (architecture and best practices).

