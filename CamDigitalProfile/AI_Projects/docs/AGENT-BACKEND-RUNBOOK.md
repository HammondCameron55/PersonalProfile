# Agent Backend Runbook

## Locations
- Backend service: `agent-backend/`
- Frontend chat UI: `CamDigitalProfile/index.html`, `CamDigitalProfile/assets/js/main.js`, `CamDigitalProfile/assets/css/main.css`

## Environment Variables
- `GEMINI_API_KEY` (required for chat completion)
- `TAVILY_API_KEY` (required for live `web_search`)
- Optional:
  - `PORT` (default: `8787`)
  - `AGENT_MAX_ITERATIONS` (default: `7`)
  - `MODEL_TIMEOUT_MS` (default: `15000`)
  - `MEMORY_TURNS` (default: `8`)
  - `ALLOWED_ORIGIN` (default: `*`)

## Commands
From `agent-backend/`:

- Install dependencies:
  - `npm install`
- Run backend:
  - `npm run dev`
- Run test checks:
  - `npm test`
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
- The chat UI sends requests to `/api/agent/chat` and persists `sessionId` in browser `sessionStorage`.
- UI transparency intentionally exposes tool names only (no chain-of-thought).
