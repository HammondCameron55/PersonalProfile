# Agent Backend Runbook

## Locations
- Backend service: `agent-backend/`
- Frontend chat UI: `CamDigitalProfile/index.html`, `CamDigitalProfile/assets/js/main.js`, `CamDigitalProfile/assets/css/main.css`

## Environment Variables
- `GEMINI_API_KEY` (required for chat completion)
- `TAVILY_API_KEY` (required for live `web_search`)
- Secret source of truth for all contributors/agents:
  - Local development uses repo-root `.env` (`PersonalProfile/.env`).
  - Hosted deployment uses AWS Amplify environment variables.
  - Both environments must use the exact same variable names: `GEMINI_API_KEY` and `TAVILY_API_KEY`.
  - Do not create alternate spellings (for example `TAVILYL_API_KEY`): this causes runtime missing-key failures.
- Optional:
  - `PORT` (default: `8787`)
  - `GEMINI_MODEL` (default: `gemini-2.0-flash`; override with any [supported model ID](https://ai.google.dev/gemini-api/docs/models))
  - `GEMINI_EMBEDDING_MODEL` (default: `gemini-embedding-001`; used to build the in-memory vector index for `knowledge_base` at server startup)
  - `AGENT_MAX_ITERATIONS` (default: `7`)
  - `MODEL_TIMEOUT_MS` (default: `15000`)
  - `MEMORY_TURNS` (default: `8`)
  - `ALLOWED_ORIGIN` (default `*`) — CORS. Use one origin or a **comma-separated** list, for example `https://www.cameronhammonddigitalportfolio.com,https://main.d123.amplifyapp.com`.
  - `AGENT_DEBUG_ERRORS=1` — include a short `detail` field in JSON error responses (raw upstream message snippet) for local debugging. Omit in production.

## Chat error responses

On failure, `POST /api/agent/chat` returns JSON such as:

- `error` — human-readable explanation
- `code` — stable machine code (e.g. `GEMINI_RATE_LIMIT`, `GEMINI_MODEL_NOT_FOUND`, `GEMINI_AUTH`, `GEMINI_TIMEOUT`, `AGENT_FAILED`)
- `traceId` — correlate with server logs
- `detail` — optional; only when `AGENT_DEBUG_ERRORS=1` or `NODE_ENV=development`

See [Gemini API rate limits](https://ai.google.dev/gemini-api/docs/rate-limits) and [models](https://ai.google.dev/gemini-api/docs/models) for quota and model IDs.

### Tavily (`web_search`) troubleshooting

- Keys are created in the [Tavily dashboard](https://app.tavily.com/home). Paste into `TAVILY_API_KEY` with no quotes or trailing spaces (Windows `.env` line endings are trimmed by the backend).
- If chat shows **Tools used: web_search** but the assistant says search failed or “API key” errors, regenerate the key and update `.env`, then restart `npm run dev`.
- Optional: `TAVILY_SEARCH_DEPTH` = `basic` or `advanced` (default `basic`).

## Commands
From `agent-backend/`:

- Install dependencies:
  - `npm install`
- Run backend:
  - `npm run dev`
- Run test checks:
  - `npm test`
  - Optional live embedding check (requires `GEMINI_API_KEY`):
    - `npm run test:integration` — skips with a message if the key is missing.
- Run health smoke check:
  - `npm run smoke`

## API Contracts
- `GET /api/agent/health`
  - Returns backend liveness JSON.
- `POST /api/agent/chat`
  - Request body:
    - `message: string`
    - `sessionId: string`
  - Response body:
    - `answer: string`
    - `toolsUsed: string[]`
    - `sessionId: string`
    - `traceId: string`

## Recruiter Demo Prompt Script (8 Prompts)
1. `What technologies power this portfolio?`
2. `Tell me about Cameron's AWS experience.`
3. `If conversion increases by 3% on 50,000 visitors, how many additional signups is that?`
4. `What is the current AWS Lambda pricing model?`
5. `Summarize Cameron's strengths for a sales engineer role.`
6. `What project best demonstrates DevOps experience?`
7. `And what security outcomes came from that project?` (memory follow-up)
8. `What are Cameron's current career goals?`

## Notes
- The chat UI resolves `POST /api/agent/chat` automatically: **localhost** uses `http://localhost:8787/api/agent/chat`; **production** defaults to **same-origin** `https://<your-domain>/api/agent/chat` (configure Amplify rewrites to your agent backend). Override with `meta[name="cam-agent-chat-endpoint"]` or `window.AGENT_CHAT_ENDPOINT` before `main.js` loads.
- UI transparency intentionally exposes tool names only (no chain-of-thought).
