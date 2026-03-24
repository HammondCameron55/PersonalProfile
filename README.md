# PersonalProfile / CamDigitalProfile

Monorepo for **Cameron Hammond**’s recruiter-facing portfolio site plus an **agentic AI backend** (LangChain.js + Google Gemini + tools).

## What's in the repo

- **`CamDigitalProfile/`** — Static site (`index.html`, assets) with an embedded chat UI that talks to the agent API.
- **`agent-backend/`** — Node.js (ESM) Express service: ReAct-style LangChain agent with `calculator`, `web_search` (Tavily), and embedding-based `knowledge_base` RAG over Cameron’s docs.

## Run the agent backend locally

From the repo root:

```bash
cd agent-backend
npm install
npm run dev
```

The server listens on **port 8787** by default (`PORT` overrides). Ensure a **`PersonalProfile/.env`** file (gitignored) exists at the repo root with:

- `GEMINI_API_KEY` — required for chat and document embeddings.
- `TAVILY_API_KEY` — required for live web search.

**Optional env vars:** see [CamDigitalProfile/AI_Projects/docs/AGENT-BACKEND-RUNBOOK.md](CamDigitalProfile/AI_Projects/docs/AGENT-BACKEND-RUNBOOK.md) (`GEMINI_MODEL`, `GEMINI_EMBEDDING_MODEL`, `AGENT_MAX_ITERATIONS`, `MODEL_TIMEOUT_MS`, `MEMORY_TURNS`, etc.).

## Tests and smoke

From `agent-backend/`:

- `npm test` — unit/regression checks (memory, vector ranking, agent graph with a fake tool-calling model, source guards against heuristic-only routing / keyword-only RAG).
- `npm run test:integration` — optional live Gemini embedding sanity check (**requires** `GEMINI_API_KEY`; exits 0 with a skip message if missing).
- `npm run smoke` — HTTP health check (`GET /api/agent/health`). Start the server first (`npm run dev`).

## Use the site chat

Open **`CamDigitalProfile/index.html`** in a browser (e.g. Live Server). The UI posts to `http://localhost:8787/api/agent/chat` (configurable via `window.AGENT_CHAT_ENDPOINT` in the HTML).

## Documentation

- **Runbook & env:** [CamDigitalProfile/AI_Projects/docs/AGENT-BACKEND-RUNBOOK.md](CamDigitalProfile/AI_Projects/docs/AGENT-BACKEND-RUNBOOK.md)  
- **Product requirements:** [CamDigitalProfile/AI_Projects/aiDocs/custom-agent-creation-prd.md](CamDigitalProfile/AI_Projects/aiDocs/custom-agent-creation-prd.md)  
- **Rubric:** [CamDigitalProfile/AI_Projects/docs/AGENT-PROJECT-RUBRIC.md](CamDigitalProfile/AI_Projects/docs/AGENT-PROJECT-RUBRIC.md)
