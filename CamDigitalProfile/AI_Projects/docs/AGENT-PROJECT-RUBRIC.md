## Agent Project Rubric — CamDigitalProfile

**Purpose:**  
This rubric describes the concrete requirements for the AI agent feature on the CamDigitalProfile site. It is adapted from the Agentic Development course (Units 7–8) and tailored to this portfolio project. Use this as the single checklist for “what done looks like” for the assignment.

---

### 1. Core Agent Requirements

- **1.1 Agent behavior**
  - The site exposes a **chat-style interface** where users can talk to an AI agent.
  - The agent runs a **ReAct-style loop** (LLM + tools + reasoning loop) via LangChain.js (or equivalent agent framework).
  - The agent is **scoped** to:
    - Explaining Cameron, his projects, and the agentic material.
    - Demonstrating the tools below (calculator, web search, later RAG).

- **1.2 Models and framework**
  - Uses a modern LLM (Anthropic or OpenAI) with an API key loaded from environment variables.
  - Uses LangChain.js (or equivalent) with explicit **tool definitions** (name, description, Zod schema).

---

### 2. Required Tools

- **2.1 Calculator tool (mandatory)**
  - **Name:** `calculator` (or equivalent, but keep consistent).
  - **Schema:** `{ expression: string }` using Zod.
  - **Behavior:**
    - Evaluates mathematical expressions (e.g. `1523 * 456`, percentages).
    - Returns a **string** result.
    - **Catches errors** and returns an error message instead of throwing.
  - **Tool description** clearly states:
    - Use for arithmetic, percentages, or calculations where precision matters.

- **2.2 Web search tool (mandatory)**
  - **Name:** `web_search` (or equivalent).
  - **Schema:** `{ query: string }`.
  - **Backend:** Tavily or similar web search API.
  - **Behavior:**
    - Searches the web for **current information** not in model training data.
    - Returns a formatted string summarizing top results with titles and URLs.
  - **Tool description** clearly states:
    - Use for up-to-date information: news, current events, prices, recent releases, etc.

- **2.3 RAG / knowledge base tool (assignment-level “complete”)**
  - **Name:** `knowledge_base` or similar.
  - **Schema:** `{ query: string }`.
  - **Backend:**
    - Embeddings (e.g. OpenAI `text-embedding-3-small`) + in-memory vector store (e.g. `MemoryVectorStore`).
    - Documents drawn from Cameron’s own materials (resume, selected docs, course notes, etc.).
  - **Behavior:**
    - Performs semantic search and returns top-k snippets with **source attribution**.
    - Returns a clear “no relevant documents found” message when appropriate.

---

### 3. Multi-Tool Agent & Conversation Memory

- **3.1 Multi-tool routing**
  - Agent is created with **multiple tools** (calculator, web search, knowledge base).
  - Tool descriptions are written so the LLM can:
    - Choose calculator for numeric questions.
    - Choose web search for external/current info.
    - Choose knowledge base for questions about Cameron or included docs.
  - Optional but ideal: agent can **chain tools** (e.g. RAG → calculator → answer).

- **3.2 Conversation memory**
  - The backend maintains **message history** across turns.
  - On each request, the agent receives the **full or truncated conversation history**.
  - The agent can answer follow-up questions that reference earlier messages (e.g. “And what about per year?”).
  - Simple truncation of history is acceptable as long as follow-ups work for short conversations.

---

### 4. Web UI & UX

- **4.1 Web chat interface**
  - A chat UI is embedded in the existing CamDigitalProfile site (not just a terminal script).
  - Users can:
    - Enter messages.
    - See responses in a scrollable conversation view.
  - Ideal: responses **stream in** rather than appearing all at once.

- **4.2 Visual integration**
  - The chat UI aligns with the site’s design (colors, typography, layout).
  - Optional bonus: surface agent steps (e.g. “Using calculator tool…”) to showcase agentic reasoning to technical viewers.

---

### 5. Infrastructure, Logging, and Testing

- **5.1 JARVIS compliance**
  - `JARVIS-ACCOUNTABILITY.md` is present and followed.
  - AI work uses the **full pipeline**: PRD → research → plan → roadmap → implement → verify → test → log → fix → commit.

- **5.2 Repo structure and docs**
  - `aiDocs/context.md` exists and describes:
    - Tech stack.
    - Critical files (including agent backend and UI).
    - Current focus for the agent project.
  - Agent-specific context is captured in `AGENT-AGENTIC-CONTEXT.md`.
  - Additional docs (PRD, MVP, plan, roadmap) live in `aiDocs/` and `ai/roadmaps/` as appropriate.

- **5.3 Scripts and testing**
  - There is at least one script (or documented command) to:
    - Start the agent backend.
    - Run basic tests or health checks.
  - Tests are run after significant changes (even if they are minimal smoke tests).

- **5.4 Structured logging**
  - Agent backend logs key events as **structured JSON**:
    - Incoming user message (redacting sensitive info).
    - Tool calls (name, arguments, brief result).
    - Errors and stack traces.
  - Logs are written to stdout/stderr or a log file in a way that an AI or human can use for debugging.

- **5.5 Security basics**
  - No API keys or secrets are committed to the repo.
  - `.env`, `.testEnvVars`, and other secret-bearing files are gitignored.
  - Calculator and web search tools treat user input as untrusted; no `eval` of raw user strings in production-like code.

---

### 6. Documentation & Demo

- **6.1 README / project docs**
  - A short README or doc section explains:
    - What the agent does.
    - Which tools are available.
    - How to run the agent locally.
  - Mentions that this is aligned with the Agentic Development course (Units 7–8).

- **6.2 Assignment “done” checklist**
  - ✅ Calculator tool implemented, tested, and used by the agent.  
  - ✅ Web search tool implemented, tested, and used by the agent.  
  - ✅ Knowledge base / RAG tool implemented over at least ~5 meaningful documents.  
  - ✅ Multi-tool agent routes to the right tool for different questions.  
  - ✅ Conversation memory supports basic multi-turn chat.  
  - ✅ Web UI chat is integrated into the CamDigitalProfile site.  
  - ✅ Logging, secrets handling, and basic tests comply with JARVIS.  
  - ✅ Context and planning docs (context, PRD, MVP, plan, roadmap) exist and are up to date.

Use this rubric as the authoritative “are we done yet?” document for the AI agent feature.

