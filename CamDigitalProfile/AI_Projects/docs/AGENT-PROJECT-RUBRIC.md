## Agent Project Rubric — CamDigitalProfile

**Purpose:**  
This rubric is the authoritative checklist for the CamDigitalProfile multi-tool AI agent project. It merges course assignment requirements with repository standards so "done" is clear, testable, and auditable.

---

### 1. Assignment Outcome (What Must Exist)

- A recruiter-facing **multi-tool chatbot** built with LangChain.js and ReAct-style behavior.
- Required capabilities:
  - `calculator` tool
  - `web_search` tool (Tavily or equivalent)
  - `knowledge_base` RAG tool over at least 5 meaningful docs with source attribution
  - conversation memory for multi-turn follow-ups
  - web UI chat experience integrated into the site (terminal-only is not the target)
- Streaming responses are recommended but not required for assignment completion.

---

### 2. Core Agent and Model Requirements

- **2.1 Agent behavior**
  - Uses a ReAct-style loop (LLM + tools + iterative reasoning).
  - Is scoped to Cameron's profile, projects, and agentic AI demonstration; not a general-purpose assistant.
  - Can route to the correct tool by user intent.

- **2.2 Models and framework**
  - Uses LangChain.js (or equivalent) with explicit tool metadata (name, description, Zod schema).
  - Uses a modern hosted LLM with API key from environment variables.
  - **Provider clarification:** Anthropic/OpenAI are acceptable examples in class materials; **Gemini is also accepted** for this project.

---

### 3. Required Tools (All Mandatory for Assignment-Complete)

- **3.1 Calculator tool**
  - Name: `calculator` (or clearly documented equivalent).
  - Schema: `{ expression: string }` with Zod.
  - Returns string output and catches errors without throwing.
  - Must avoid unsafe raw `eval` patterns in production-like code.

- **3.2 Web search tool**
  - Name: `web_search` (or clearly documented equivalent).
  - Schema: `{ query: string }`.
  - Uses Tavily (or equivalent) for current/external information.
  - Returns summarized results with source titles/URLs suitable for citation.

- **3.3 Knowledge base / RAG tool**
  - Name: `knowledge_base` (or clearly documented equivalent).
  - Schema: `{ query: string }`.
  - Performs semantic retrieval over **at least 5 meaningful documents**.
  - Returns relevant snippets with explicit source attribution.
  - Handles no-result cases gracefully.
  - Source corpus can include resume, project docs, and transcript/story `.md` or `.txt` files authored by Cameron.

---

### 4. Multi-Tool Routing and Memory

- Agent is initialized with calculator, web search, and knowledge base tools.
- Tool descriptions clearly steer routing:
  - calculator for numeric reasoning
  - web search for current/external information
  - knowledge base for Cameron-specific knowledge from documents
- Optional but strong: chain tools when needed (example: RAG retrieval then calculator).
- Maintains conversation history across turns (full or truncated) so follow-up questions work.

---

### 5. Web UI and UX

- Chat UI is embedded into the existing CamDigitalProfile web experience.
- Users can submit messages and view assistant responses in a scrollable conversation.
- Visual style aligns with site aesthetics.
- Streaming is optional bonus; non-streaming responses are acceptable if UX remains responsive.
- Optional bonus: expose tool-step hints for technical viewers.

---

### 6. Repo, Process, and Infrastructure Requirements

- **6.1 JARVIS process compliance**
  - Follow: PRD -> research -> plan -> roadmap -> implement -> verify/test -> log -> fix -> commit.
  - Keep long-lived docs in `aiDocs/` and support docs in `docs/` per project conventions.

- **6.2 Required documentation artifacts**
  - `aiDocs/context.md` updated and accurate.
  - PRD for this feature exists and is current.
  - MVP doc exists and is current.
  - Roadmap/plan artifacts exist in agreed locations.
  - README explains what the agent does and how to run it.

- **6.3 Scripts and verification**
  - At least one documented command/script to run backend.
  - At least one documented command/script for smoke/health checks.
  - Minimal test set proving tool routing and memory behavior.

- **6.4 Structured logging**
  - Structured JSON logs capture:
    - incoming user messages (redacted as needed)
    - tool calls (name, arguments summary, result summary)
    - errors (with stack traces when available)

- **6.5 Security and secrets hygiene**
  - No secrets committed.
  - `.env`, `.testEnvVars`, and related files are gitignored.
  - Tool inputs treated as untrusted.

---

### 7. Delivery and Evidence

- Repository shows incremental, meaningful progress history (not a single large dump).
- Deliverables include:
  - working repo with multi-tool agent and web UI
  - README
  - short demo video showing key capabilities

---

### 8. Assignment-Complete Checklist

- [ ] Calculator tool implemented, tested, and used by agent.
- [ ] Web search tool implemented, tested, and used by agent.
- [ ] Knowledge base RAG tool implemented over at least 5 meaningful docs with source attribution.
- [ ] Agent correctly routes between tools for representative prompts.
- [ ] Conversation memory supports short multi-turn follow-ups.
- [ ] Web UI chat is integrated into CamDigitalProfile.
- [ ] Structured logging, secrets handling, and basic verification scripts are in place.
- [ ] `context.md`, PRD, MVP, and roadmap/plan docs are present and current.

Use this document as the authoritative "are we done yet?" rubric for this project.

