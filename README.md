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

Open **`CamDigitalProfile/index.html`** in a browser (e.g. Live Server). The chat UI targets **`http://localhost:8787/api/agent/chat`** when the hostname is `localhost` / `127.0.0.1`; on any other host it defaults to **same-origin** `/api/agent/chat` (see `_redirects.example` and README for production).

## Production chat (fixing “Failed to fetch”)

Browsers block or fail requests when an **HTTPS** portfolio page tries to call **`http://localhost:8787`** (wrong host, mixed content, or unreachable). The UI now picks:

- **Local dev:** `http://localhost:8787/api/agent/chat`
- **Deployed site:** `<origin>/api/agent/chat` unless you set `window.AGENT_CHAT_ENDPOINT` or `<meta name="cam-agent-chat-endpoint" content="https://...">`

**Recommended:** Add Amplify Hosting **rewrites** (or a `CamDigitalProfile/_redirects` file Amplify honors) so **`/api/agent/chat`** and **`/api/agent/health`** on your **site origin** (e.g. `https://cameronhammonddigitalportfolio.com`) proxy to your **serverless agent** URL (Lambda function URL, API Gateway, or Amplify Gen-2 function route). Without this, the browser calls your static host at `/api/agent/chat`, gets **404**, or fails the request. See `CamDigitalProfile/_redirects.example` for the pattern.

If the frontend and agent live in the **same Amplify app**, add rules in **Amplify Console → Hosting → Rewrites and redirects** (or keep `_redirects` in the published root) so those paths forward to the deployed function’s HTTPS URL.

Set backend **`ALLOWED_ORIGIN`** to the **exact** origin(s) visitors use (apex and `www` differ). Example:

`ALLOWED_ORIGIN=https://cameronhammonddigitalportfolio.com,https://www.cameronhammonddigitalportfolio.com`

### Amplify build: monorepo `amplify.yml`

If the Amplify app uses a monorepo app root (e.g. **`AMPLIFY_MONOREPO_APP_ROOT=CamDigitalProfile`**), root **`amplify.yml`** must use an **`applications`** list with **`appRoot`**, not a top-level **`frontend:`** block. Otherwise Amplify fails with **`CustomerError: Monorepo spec provided without "applications" key`**. See [monorepo configuration](https://docs.aws.amazon.com/amplify/latest/userguide/monorepo-configuration.html).

### Point the live site at your agent (404 on `/api/agent/chat`)

If you **do not** use same-origin **rewrites** to your Lambda, the browser posts to `https://<your-domain>/api/agent/chat` and Amplify returns **404** (HTML), which shows as a chat error.

**Option A — Amplify build env (simplest with this repo):** In Amplify → **Environment variables**, add **`PORTFOLIO_AGENT_CHAT_URL`** for **All branches** (available at build time). Value must be the **full HTTPS URL** to the chat route, for example:

`https://xxxxxxxx.lambda-url.us-east-1.on.aws/api/agent/chat`

On each build, `scripts/inject-agent-endpoint.py` writes that URL into **`CamDigitalProfile/index.html`** `meta name="cam-agent-chat-endpoint"`, which the UI reads before calling `fetch`.

**Option B — Hosting rewrites:** Keep `meta` empty and add **Rewrites and redirects** (or `_redirects`) so `/api/agent/chat` proxies to the same URL as above. See `CamDigitalProfile/_redirects.example`.

The build step locates `scripts/inject-agent-endpoint.py` whether the job’s **current directory is already `CamDigitalProfile`** (common for `appRoot`) or the **repository root** (then it `cd`s into that folder).

## Documentation

- **Runbook & env:** [CamDigitalProfile/AI_Projects/docs/AGENT-BACKEND-RUNBOOK.md](CamDigitalProfile/AI_Projects/docs/AGENT-BACKEND-RUNBOOK.md)  
- **Product requirements:** [CamDigitalProfile/AI_Projects/aiDocs/custom-agent-creation-prd.md](CamDigitalProfile/AI_Projects/aiDocs/custom-agent-creation-prd.md)  
- **Rubric:** [CamDigitalProfile/AI_Projects/docs/AGENT-PROJECT-RUBRIC.md](CamDigitalProfile/AI_Projects/docs/AGENT-PROJECT-RUBRIC.md)
