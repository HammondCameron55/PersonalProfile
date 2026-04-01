# AGENTS.md

## Cursor Cloud specific instructions

### Overview

This is a monorepo with two components:

- **`CamDigitalProfile/`** — Static HTML/CSS/JS portfolio site (no build step). Serve with any static server (e.g. `npx serve -l 3000 CamDigitalProfile`).
- **`agent-backend/`** — Node.js (ESM) Express API on port 8787 with a LangChain.js ReAct agent (Google Gemini + tools).

### Required secrets

- `GEMINI_API_KEY` — required for chat and document embeddings.
- `TAVILY_API_KEY` — required for the `web_search` tool; the agent degrades gracefully without it.

These must be available as environment variables. The backend reads them from a repo-root `.env` file (path `../.env` relative to `agent-backend/`). Create `.env` at the workspace root:

```
GEMINI_API_KEY=<value>
TAVILY_API_KEY=<value>
```

### Running services

| Service | Command | Port | Notes |
|---|---|---|---|
| Agent backend | `cd agent-backend && npm run dev` | 8787 | Warms knowledge-base embedding index at startup |
| Static frontend | `npx serve -l 3000 CamDigitalProfile` | 3000 | Chat UI posts to `http://localhost:8787/api/agent/chat` |

### Testing commands (from `agent-backend/`)

| Command | What it does | API key needed? |
|---|---|---|
| `npm test` | Unit/regression tests (memory, vector ranking, agent graph, source guards) | No |
| `npm run test:integration` | Live Gemini embedding sanity check (skips gracefully if key is missing) | Yes |
| `npm run smoke` | HTTP health check — requires server running first | No |

### Non-obvious caveats

- The `.env` file must be at the **repo root** (not inside `agent-backend/`). The config reads `../.env` relative to its own directory.
- The knowledge-base embedding index warms asynchronously on server startup. If a `knowledge_base` query arrives before warming completes, it may return fewer results.
- There is no linter configured in this project (no ESLint, Prettier, or similar).
- There is no build step — the backend runs directly via `node src/server.js` and the frontend is plain HTML.
- See `README.md` and `CamDigitalProfile/AI_Projects/docs/AGENT-BACKEND-RUNBOOK.md` for full env var reference and API contracts.
