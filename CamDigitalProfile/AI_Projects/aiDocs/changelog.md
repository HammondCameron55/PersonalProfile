## Changelog — PersonalProfile / CamDigitalProfile

Entries are brief “what & why” notes, newest at the top. Keep this concise and focused on meaningful changes.

---

### 2026-03-23

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

