# AGENTS.md

## Cursor Cloud specific instructions

### Repository overview

This is a monorepo containing:
- **`CamDigitalProfile/`** — Static portfolio site (HTML/CSS/JS, Bootstrap 5) with an embedded AI chat widget.
- **`agent-backend/`** — Node.js (ESM) Express API backend implementing a LangChain ReAct agent with Google Gemini. Tools: `calculator`, `web_search` (Tavily), `knowledge_base` (in-memory RAG).

### Running services

| Service | Command | Port | Notes |
|---------|---------|------|-------|
| Agent backend | `cd agent-backend && npm run dev` | 8787 | Starts Express server |
| Static site | `npx serve CamDigitalProfile -l 3000` | 3000 | Serves portfolio HTML |

The chat widget on the static site POSTs to `http://localhost:8787/api/agent/chat`.

### Environment variables

The `.env` file is expected at the **repo root** (`/workspace/.env`), not inside `agent-backend/`. The backend loads it via `dotenv.config({ path: "../.env" })`.

- `GEMINI_API_KEY` — Required for full LLM chat and embeddings. Without it, the agent still returns responses using a fallback/stub.
- `TAVILY_API_KEY` — Optional; enables the `web_search` tool. Agent degrades gracefully without it.

### Testing

- `cd agent-backend && npm test` — Offline unit/regression tests (no API key needed).
- `cd agent-backend && npm run test:integration` — Live Gemini embedding check (requires `GEMINI_API_KEY`; skips gracefully if absent).
- `cd agent-backend && npm run smoke` — HTTP health check against running server (start server first).

### Non-obvious caveats

- **No linter/TypeScript config** exists in this project. Code quality checks are limited to unit tests.
- **No Docker/containers** needed — the project is intentionally simple.
- **The backend works without API keys** for basic chat (fallback behavior), but full AI features require `GEMINI_API_KEY`.
- **`npx serve`** may prompt to install on first run. Use `npx -y serve CamDigitalProfile -l 3000` to skip the prompt.
- **All state is in-memory** — no database required. Restarting the server clears session history.
