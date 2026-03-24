## Project Context — CamDigitalProfile / PersonalProfile

**Purpose:**  
This file gives AI agents and humans a fast, opinionated overview of this repo so they can orient quickly before doing any work. Keep it concise and updated, not exhaustive.

---

### 1. High-Level Project Description

- **Repo:** PersonalProfile / CamDigitalProfile  
- **Goal:** Host a recruiter-facing personal website for **Cameron Hammond** that:
  - Showcases professional experience, projects, and technical depth.
  - Demonstrates modern web development and AWS deployment skills.
  - Includes **agentic AI features** (tools, ReAct-style agent, web chat UI) aligned with the Agentic Development course.

Core reference docs:
- `CamDigitalProfile/AI_Projects/docs/JARVIS-ACCOUNTABILITY.md` — pipeline, safety rules, and AI dev process.
- `CamDigitalProfile/AI_Projects/docs/AGENT-AGENTIC-CONTEXT.md` — scope and expectations for the AI agent feature.
- `CamDigitalProfile/AI_Projects/docs/AGENT-PROJECT-RUBRIC.md` — “what done looks like” for the agent project.

---

### 2. Tech Stack (Current / Intended)

- **Frontend:** Static/HTML site under `CamDigitalProfile/` (e.g. `index.html` and related assets), deployed via AWS.
- **Backend (implemented — `agent-backend/`):**
  - Node.js (**ES modules**) with **LangChain.js** `createAgent` ReAct loop (`toolCallLimitMiddleware` uses `AGENT_MAX_ITERATIONS`).
  - **LLM:** Google Gemini (`ChatGoogleGenerativeAI`) via `GEMINI_API_KEY`.
  - **Tools:** `calculator` (mathjs), `web_search` (Tavily), `knowledge_base` (Gemini **embeddings** + in-memory cosine similarity over chunked Cameron docs — **not** keyword-only retrieval).
  - **Logging:** Structured JSON per request plus per-tool `tool.invoked` / `tool.completed` / `tool.failed` (args/result previews, stacks on failure).
- **Infra:** AWS (likely S3/CloudFront for static hosting; agent backend runbook documents local + Amplify env vars).

If you need to change core tech choices, update this section.

---

### 3. Critical Files and Directories

- `CamDigitalProfile/index.html`
  - Main website entry point. Chat UI for the agent will eventually integrate here.

- `CamDigitalProfile/AI_Projects/docs/JARVIS-ACCOUNTABILITY.md`
  - **Read this first** for any non-trivial work. Defines the full pipeline (PRD → plan → roadmap → implement → verify → test → log → fix → commit).

- `CamDigitalProfile/AI_Projects/docs/AGENT-AGENTIC-CONTEXT.md`
  - Context and constraints for the AI agent / chat UI feature, including Unit 7 + Unit 8 expectations.

- `CamDigitalProfile/AI_Projects/docs/AGENT-PROJECT-RUBRIC.md`
  - Rubric and checklist for the agent project (tools, RAG, memory, web UI, logging, security).

- `aiDocs/`
  - Long-lived AI-facing docs:
    - `context.md` (this file)
    - `changelog.md` (high-level history)
    - Future: agent PRD, MVP, architecture notes.

- `ai/`
  - Working AI space (gitignored).
  - Use for:
    - `ai/roadmaps/YYYY-MM-DD_*_research.md`
    - `ai/roadmaps/YYYY-MM-DD_*_plan.md`
    - `ai/roadmaps/YYYY-MM-DD_*_roadmap.md`

Update this list when new critical files are added.

---

### 4. Current Focus

Submit-ready **Multi-Tool AI Agent** alignment (PRD v1.2 + `AGENT-PROJECT-RUBRIC.md`):

- **Work stream:** Hardening complete — model-driven tool loop (not regex routing), **vector / semantic** `knowledge_base`, per-tool structured logs, tests + root `README.md`.
- **Phase:** Rubric completion / evidence capture (demo video, runbook demo script).
- **Pointers:**
  - Product: `aiDocs/custom-agent-creation-prd.md` (FR-4, FR-7 vector retrieval, FR-9a logging).
  - Plan/roadmap: `ai/roadmaps/2026-03-24_rubric-completion_agent-hardening_plan.md`, `ai/roadmaps/2026-03-24_rubric-completion_agent-hardening_roadmap.md`.
  - Run locally: repo root `README.md` and `docs/AGENT-BACKEND-RUNBOOK.md`.

When this focus changes, update this section.

---

### 5. Conventions and Notes

- **AI workflow:**
  - Always follow `JARVIS-ACCOUNTABILITY.md`:
    - PRD / scope → research → plan → roadmap → implement → verify → test → log → fix → commit.
  - Use `ai/roadmaps/` for research/plan/roadmap docs (dated filenames).

- **Security:**
  - Never commit secrets (`.env`, `.testEnvVars`, API keys, etc.).
  - Use environment variables / AWS Secrets Manager for keys (Gemini, Tavily, etc.).

- **Logging & testing:**
  - Prefer structured logs (JSON).
  - Provide simple, scriptable ways to run tests and health checks for the agent backend (per JARVIS).

If any of these conventions change, update this section so future agents behave correctly.

