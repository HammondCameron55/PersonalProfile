# Agentic AI Interface for CamDigitalProfile — Context for Agents

**Purpose of this document:**  
This file explains how this website should use the Agentic Development course material to power an AI agent inside the site. Any AI agent or human working on the AI features of this site must read and follow this document **after** reading `JARVIS-ACCOUNTABILITY.md`.

---

## 1. Website Purpose and Audience

- **Audience:** Recruiters, hiring managers, and technical interviewers evaluating **Cameron Hammond**.
- **Goals:**
  - **Professional:** Demonstrate strong engineering skills, especially in **agentic AI**, modern web development, and practical AWS deployment.
  - **Personal:** Give a sense of Cameron’s personality, interests, and values.
  - **Show, don’t tell:** The AI features are themselves a portfolio artifact, not just a gimmick.

The AI agent and web UI are here to:
- Answer questions about Cameron (experience, projects, skills).
- Explain or demonstrate **how AI agents are built**, tied to the Agentic Development course.
- Optionally assist with simple, clear utilities (calculator, web search, later RAG over Cameron’s own docs).

---

## 2. Relationship to JARVIS-ACCOUNTABILITY

- `JARVIS-ACCOUNTABILITY.md` is the **meta playbook**: how any agent should operate in this repo (pipeline, planning, test-fix loop, security, logging, etc.).
- **This file** is **scope-specific**: it defines the **AI agent feature** for the personal profile site.

Any implementation or planning agent working on the AI UI or backend must:
1. Follow the pipeline in JARVIS (PRD → research → plan → roadmap → implement → verify → test → log → fix → commit).
2. Treat this file as the **PRD + high-level plan context** for the AI interface.

---

## 3. High-Level Agent Behavior

### 3.1 Core Concepts (from Dev Unit 7)

The agent should be built around these principles from **Dev Unit 7: Building AI Agents**:

- **ReAct pattern:** Think → Act → Observe → Repeat.
- **Agents = LLM + Tools + Loop**, not just single prompts.
- **Tools are functions with metadata:** name, description, schema (Zod).
- **Tool descriptions drive behavior:** they tell the model **when** to use each tool.
- Use **LangChain.js** (`langchain`, `@langchain/anthropic` or `@langchain/openai`, `@langchain/langgraph`, `@langchain/core`) with **Zod** schemas.

### 3.2 What the Agent Should Do on This Site

The site’s agent should:

- **Explain agentic concepts** in plain language, grounded in the course:
  - What ReAct is and how it works in code.
  - What tools are and how they are wired into an agent.
  - How LangChain and LangGraph structure the agent loop.
- **Demonstrate tools live**:
  - **Calculator tool:** evaluate mathematical expressions with precision.
  - **Web search tool:** retrieve current information not in training data (later phases).
  - (Future) **RAG over Cameron’s docs:** query a small vector store of Cameron’s own materials (resume, PRD, etc.).
- **Answer questions about Cameron**:
  - Pull from a curated knowledge base (static content, structured data, and later RAG) rather than hallucinating.
- **Respect the pipeline and safety rules** from JARVIS:
  - No secrets.
  - Proper logging.
  - Tests via `scripts/test.*` equivalents where appropriate.

---

## 4. Course Alignment (Agentic Development Overview)

The Agentic Development course (`agenticDevelopment.html`) defines how this project should be run:

- **Unit 1 (Generative AI Fundamentals):**
  - LLMs are “world’s best autocomplete”.
  - Agents differ from single-shot prompts because they **use tools and loops**.
- **Unit 2 (Ideation & Planning with AI):**
  - Use AI to write PRDs, roadmaps, and MVPs.
  - This AI feature should have its own **PRD and roadmap** in `aiDocs/` and `ai/roadmaps/`.
- **Unit 3 / 3.5 (Dev Setup & Implementation Lab):**
  - Use `aiDocs/context.md` and `ai/` folders.
  - Implement using the **implementation prompt pattern** and **verify against roadmap**.
  - Create CLI scripts for testing.
- **Unit 4 (Building AI-Friendly Code):**
  - Structured logging, test-fix loop, CLI-first interfaces.
  - The agent backend should log **structured JSON** for requests, tool calls, responses.
- **Unit 3.75 (Meeting Capture):**
  - Less directly relevant here, but can inspire how to summarize conversations.
- **Unit 7 (Building AI Agents):**
  - Directly drives the implementation of:
    - Tools (calculator, web search, later RAG).
    - ReAct-style agents with `createAgent`.
    - Streaming responses for a high-quality web UI.

This website’s AI section is effectively a **mini individual agent project** as described in Unit 7.

---

## 5. Required Tools and Capabilities (Phase 1)

In the **initial phase**, the agent running on the site should support at least:

1. **Calculator Tool**
   - **Name:** `calculator`
   - **Purpose:** Evaluate mathematical expressions where precision matters (e.g., `1523 * 456`, percentages, simple formulas).
   - **Schema:** `{ expression: string }`
   - **Behavior:** Returns result as string; catches and reports errors instead of throwing.

2. **(Optional Phase 1 or Phase 2) Web Search Tool**
   - **Name:** `web_search`
   - **Purpose:** Search the web for current information not in training data (news, current prices, recent events).
   - **Schema:** `{ query: string }`
   - **Backend:** Tavily or similar, as shown in Dev Unit 7.
   - **Formatting:** Summaries with title, content, URL, separated clearly for the LLM.

3. **Core “Profile Q&A” Capability**
   - Use either:
     - Static structured data (front-end or API) about Cameron, or
     - A small RAG index (future phase) over his resume, PRD, and selected docs.
   - The agent should prefer **factual, sourced answers** over speculation.

---

## 6. Web UI Expectations

The course emphasizes a **web UI** (not just a terminal) for the agent:

- **Chat-style interface** embedded in the existing site:
  - Recruiters can type questions.
  - Responses stream in (token by token, or at least step-by-step from the agent).
- **Visible agentic behavior (optional bonus):**
  - Optionally surface the “steps” (e.g., “Using calculator tool…”, “Searching the web…”) to showcase agent reasoning to technical viewers.
- **Design fit:**
  - Should match the site’s aesthetic and feel professional.
  - Reinforces that Cameron understands **UX + engineering**, not just back-end code.

---

## 7. Implementation Constraints and Non-Goals

- **Must follow JARVIS rules:**
  - Use `aiDocs/` and `ai/` correctly.
  - Plan and roadmap before large changes.
  - Use CLI scripts and test-fix loops for backend services.
- **No secrets in code or prompts:**
  - API keys must come from environment variables / `.testEnvVars` and never be committed.
- **Not a general-purpose assistant:**
  - The agent is scoped to:
    - Explaining Cameron, his work, and this course.
    - Demonstrating basic tools (calculator, web search, later RAG).
  - It is **not** meant to be a full multi-domain chatGPT clone.

---

## 8. Phases for This Feature

Agents working on this feature should treat its evolution in phases:

1. **Phase 1: Foundation**
   - Add PRD and roadmap files for “AI agent web UI” in `aiDocs/` and `ai/roadmaps/`.
   - Implement **calculator tool** and a minimal agent using LangChain.
   - Create a very simple web UI chat box hooked to the agent.
   - Ensure logging and basic test script exist.

2. **Phase 2: Enhance and Align With Course**
   - Add **web_search tool**.
   - Improve UI (streaming, better visual integration).
   - Make the agent able to explain ReAct, tools, and the course content.

3. **Phase 3: RAG + Profile Knowledge**
   - Add a small RAG index over Cameron’s docs (resume, selected markdown).
   - Enable the agent to answer recruiter questions with references to those docs.
   - Tighten tests, logs, and monitoring.

---

## 9. How Other Agents Should Use This Document

- When assigned to work on the **AI agent / chat UI**:
  1. Read `JARVIS-ACCOUNTABILITY.md`.
  2. Read `aiDocs/context.md`.
  3. Read **this document** to understand the intended behavior and course alignment.
  4. Check for an existing roadmap in `ai/roadmaps/` for this feature; if missing, create one per JARVIS.
  5. Implement or modify code only in ways consistent with:
     - The **Agentic Development** course materials.
     - The recruiter-facing goals of the site.

---

## 10. References

- Dev Unit 7 — Building AI Agents: `https://d1dtpagvh0qhqn.cloudfront.net/agentic7WebSlides/`
- Agentic Development Course Index: `https://d1dtpagvh0qhqn.cloudfront.net/agenticDevelopment.html`
- JARVIS Pipeline and Rules: `CamDigitalProfile/AI_Projects/docs/JARVIS-ACCOUNTABILITY.md`