# Product Requirements Document — Custom Agent Creation for CamDigitalProfile

**Version:** 1.0  
**Owner:** Cameron Hammond  
**Date:** 2026-03-12  

---

## 1. Overview

### 1.1 Product Summary

This project adds a **custom, agentic AI experience** to the CamDigitalProfile recruiter website.  

Instead of a simple “chatbot,” the site will expose a **tool-using AI agent** that:
- Runs on **Google Gemini** via the Gemini API.
- Is orchestrated with **LangChain.js** (ReAct loop + tools).
- Integrates directly into the existing **CamDigitalProfile** site as a web chat UI.

The agent’s role is to:
- Answer questions about **Cameron’s background, projects, and skills**.
- Demonstrate Cameron’s understanding of **agentic AI** (tools, ReAct, RAG, memory).
- Provide a polished, low-latency UX that feels like a serious engineering artifact, not a toy.

This PRD defines what “done” means for the initial shipping version of this feature.

### 1.2 Out of Scope (for this PRD)

- General-purpose chatbot behavior across arbitrary domains.
- Multi-user accounts, authentication, or personalization beyond simple session-level context.
- Complex multi-agent orchestration (e.g., many cooperating agents).
- Full production monitoring stack beyond basic structured logging and simple metrics.

Future phases (beyond this PRD) may extend the system with more tools, deeper RAG, or advanced memory, but are not required for the initial release.

---

## 2. Users and Use Cases

### 2.1 Primary Users

- **Recruiters and hiring managers**
  - Want a quick, engaging way to understand Cameron’s skills and thought process.
  - May ask technical and non-technical questions about projects, technologies, or experience.

### 2.2 Secondary Users

- **Technical interviewers / engineers**
  - Evaluate how Cameron builds real systems.
  - May probe details about architecture, choices, and tradeoffs.

- **Cameron (the site owner)**
  - Uses the system as a portfolio piece to demonstrate competence with agents, LangChain, Gemini, AWS, and secure/observable AI practices.

### 2.3 Key Use Cases

1. **Profile Q&A**
   - User: “What technologies did you use to build this site?”
   - Agent: Provides accurate, concise answer grounded in Cameron’s docs, with clear structure.

2. **Project / Experience Deep Dive**
   - User: “Tell me about a time you used AWS in a project.”
   - Agent: Summarizes relevant project(s) and highlights design decisions.

3. **Tool Demonstration — Calculator**
   - User: “If we increased conversion by 3% on 50,000 visitors, how many more signups is that?”
   - Agent: Routes to calculator tool, computes precisely, and explains the result clearly.

4. **Tool Demonstration — Web Search**
   - User: “What is the current price of AWS Lambda in us-east-1?”
   - Agent: Uses Tavily-backed web_search tool and answers with cited, up-to-date information.

5. **Multi-Turn Conversation**
   - User: “What tech does this agent use?”  
   - User: “And why did you choose Gemini instead of another provider?”  
   - Agent: Remembers prior context and answers follow-ups coherently.

---

## 3. Functional Requirements

### 3.1 Web Chat UI

**FR-1**: A chat UI must be embedded into the existing CamDigitalProfile site (e.g., on `index.html` or a clearly linked subpage).
- Users can enter free-form text, press send, and see responses appended in a scrollable conversation.
- The UX must be responsive and visually consistent with the rest of the site.

**FR-2**: The UI should support **streaming responses** (token-by-token or chunk-by-chunk) so users see the agent “thinking” in near real time, where backend and hosting allow.

### 3.2 Agent Core (LangChain + Gemini)

**FR-3**: The backend must expose an endpoint that:
- Accepts a user message (and optional conversation history/session ID).
- Routes it through a **LangChain.js**-based agent using **Google Gemini** (e.g., Gemini 1.5 Flash).
- Returns the agent’s response (and any relevant metadata needed for the UI).

**FR-4**: The agent must be configured as a **tool-using, ReAct-style agent**:
- Uses LangChain agent/graph primitives (e.g., `createAgent` / `create_tool_calling_agent` or equivalent).
- Reasoning loop: Think → Act (tool) → Observe → Repeat, bounded by an iteration/recursion limit.

### 3.3 Tools

**FR-5**: **Calculator tool**
- Implement a safe calculator tool with:
  - Name: `calculator`.
  - Input schema: `{ expression: string }` via Zod.
  - Implementation that avoids raw `eval` (e.g., `mathjs` or similar secure parser).
- Tool description must clearly instruct the agent to use this tool for any mathematical or numeric reasoning tasks.
- Errors or invalid expressions must be returned as error strings, not uncaught exceptions.

**FR-6**: **Web search tool**
- Implement a Tavily-backed web search tool with:
  - Name: `web_search`.
  - Input schema: `{ query: string }` via Zod.
  - Reasonable defaults for max results and search depth (aligned with `AGENT-PROJECT-RUBRIC.md`).
- Tool description must clearly instruct the agent to use this for up-to-date, external information (news, prices, recent events, etc.).
- Responses must include enough source information (titles/URLs) for the agent to cite or reference.

**FR-7**: **Future RAG / knowledge tool (design-ready, not required to ship MVP)**
- The architecture and plan must anticipate a third tool (e.g., `knowledge_base`) for RAG over Cameron’s docs.
- Actual implementation of RAG can be deferred to a later phase, but the PRD assumes this is part of the longer-term vision.

### 3.4 Conversation Memory

**FR-8**: The agent must support **basic conversation memory** for short multi-turn chats:
- Maintain a per-session message history (e.g., in memory or via simple session token).
- Pass recent conversation context to the agent on each turn so follow-up questions make sense.
- Implement a simple truncation strategy (e.g., last N messages) to stay within context limits.

### 3.5 Logging, Errors, and Observability

**FR-9**: The backend must emit **structured logs** for:
- Incoming user messages (with PII minimized and no secrets).
- Tool calls (tool name, arguments summary, result summary).
- Errors, including stack traces where applicable.

**FR-10**: User-visible errors must be graceful:
- If a tool or the model fails, the user receives a clear, human-readable error message.
- The UI should show failures in a way that does not break the entire chat interface.

---

## 4. Non-Functional Requirements

### 4.1 Performance & Latency

**NFR-1**: Time-to-first-token for a typical recruiter question should **ideally be under ~2 seconds** for warm invocations (excluding cold starts), subject to model and network constraints.

**NFR-2**: The system should avoid unbounded loops:
- Set a clear max iterations / recursion limit (e.g., 5–10 tool invocations per user message).

### 4.2 Security & Compliance

**NFR-3**: Secrets must never be committed:
- Gemini API key, Tavily API key, and any other credentials must be loaded from environment variables / `.testEnvVars` / AWS secrets.
- `.env`, `.testEnvVars`, and similar files must remain gitignored (per `.gitignore` and `JARVIS-ACCOUNTABILITY.md`).

**NFR-4**: Prompt-injection and misuse mitigations:
- System prompt must clearly separate system instructions from user input.
- The agent must not reveal system prompts or internal implementation details if directly asked.
- Calculations must not execute arbitrary code, and web search results must be treated as untrusted input.

### 4.3 Reliability & Cost

**NFR-5**: The system must implement:
- Reasonable timeouts for calls to Gemini and Tavily.
- Basic rate limiting or usage caps to prevent abuse and runaway costs (even if primitive).

**NFR-6**: Model and tool usage should default to a **cost-effective configuration** (e.g., Gemini 1.5 Flash, limited results from Tavily) appropriate for a personal portfolio.

---

## 5. Metrics & Success Criteria

### 5.1 Qualitative Success

- Recruiters and interviewers report that:
  - The agent feels **polished and professional**.
  - The agent gives **accurate, concise answers** about Cameron and his work.
  - The tools (calculator, web search) work reliably and clearly demonstrate technical depth.

### 5.2 Quantitative / Behavioral Signals

- Conversation completion:
  - Majority of sessions (e.g., >80%) reach at least one valid agent response without visible errors.

- Tool usage:
  - For queries that obviously require math or fresh web info, the agent calls the correct tool the majority of the time (e.g., >80% on a curated test set).

- Errors:
  - No unhandled exceptions / HTTP 5xx visible to the user in normal usage.

---

## 6. Dependencies and Constraints

### 6.1 External Dependencies

- **Google Gemini API** (for LLM).
- **Tavily API** (for web search).
- **LangChain.js** and any supporting libraries (e.g., Zod, mathjs).

### 6.2 Internal Dependencies

- Existing CamDigitalProfile site structure and deployment pipeline.
- JARVIS-ACCOUNTABILITY process and docs:
  - Plan, roadmap, and implementation must follow that pipeline.

---

## 7. Risks and Open Questions

### 7.1 Risks

- **LLM cost / quota issues**:
  - Misconfigured models or unlimited retries could incur unexpected costs.

- **Prompt injection / misuse**:
  - A determined attacker could still cause undesired behavior if guardrails are weak.

- **Cold-start latency (if using serverless)**:
  - First invocation after idle may be slow; must be acceptable for a portfolio context.

### 7.2 Open Questions

- Exact AWS deployment choices for the agent backend (e.g., Lambda vs. another service).
- How much RAG and long-term memory should be included in the **initial** release vs. later.
- How deeply to expose implementation details to users (e.g., whether to show which tools are being used step-by-step).

These items should be addressed and refined in the **Plan** and **Roadmap** documents that follow this PRD.

