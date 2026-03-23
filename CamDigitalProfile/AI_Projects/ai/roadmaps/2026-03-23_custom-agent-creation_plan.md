# Custom Agent Creation — Implementation Plan
_Date: 2026-03-23_

## Links
- PRD: `CamDigitalProfile/AI_Projects/aiDocs/custom-agent-creation-prd.md`
- Context: `CamDigitalProfile/AI_Projects/aiDocs/context.md`
- JARVIS process: `CamDigitalProfile/AI_Projects/docs/JARVIS-ACCOUNTABILITY.md`
- Roadmap: `CamDigitalProfile/AI_Projects/ai/roadmaps/2026-03-23_custom-agent-creation_roadmap.md`

## Scope Decisions (Resolved from PRD 7.2)
- No additional AWS infrastructure is in scope for this project phase.
- Document ingestion/expansion workflow for future `.md`/`.txt` corpus growth is out of scope right now.
- Agent response transparency should reveal only which tools were used, not internal chain-of-thought details.

## Goal and Outcome
Deliver a recruiter-facing, production-quality portfolio agent integrated into CamDigitalProfile that demonstrates:
- Gemini-powered ReAct tool use through LangChain.js.
- Reliable multi-turn conversation with short-term session memory.
- Working calculator and Tavily web search tools for MVP.
- Clear path to assignment-complete with a `knowledge_base` RAG tool and source-attributed retrieval.

## Architecture and Integration Plan

### 1) Frontend Chat UI Integration
- Integrate a chat panel in `CamDigitalProfile/index.html` (or a clearly linked AI page) with:
  - Input box + send action.
  - Scrollable transcript area.
  - Distinct user/assistant message styles.
  - Loading/streaming state.
- Client requests should include:
  - `message` (user text)
  - `sessionId` (generated client-side and persisted in browser storage per tab/session)
- UI must gracefully render:
  - Normal assistant responses.
  - Recoverable error messages.
  - A lightweight "tools used" footer, populated from backend metadata.

### 2) Backend Agent Endpoint
- Implement a single chat endpoint (for example `/api/agent/chat`) that:
  - Validates request payloads.
  - Loads memory context for the provided `sessionId`.
  - Invokes a LangChain.js ReAct-style agent configured with Gemini.
  - Returns assistant text + tool-usage metadata + updated memory state.
- Keep implementation simple and aligned with existing site hosting constraints:
  - Reuse current deployment footprint where possible.
  - Avoid introducing new AWS services for this phase.

### 3) Agent Orchestration (LangChain + Gemini)
- Use Gemini model defaults optimized for cost and latency (e.g., Gemini Flash tier).
- Configure the agent with:
  - Explicit system prompt boundaries.
  - Tool calling enabled.
  - Iteration/recursion cap (5-10 max) to prevent loops.
  - Provider/API timeout controls.
- Agent output contract should include:
  - `answer` (assistant-visible response text)
  - `toolsUsed` (array of tool names only)
  - Optional citation block for search/RAG outputs

## Tooling Plan

### Calculator (`calculator`)
- Schema: `{ expression: string }` (Zod).
- Use a safe parser (for example `mathjs`), never raw `eval`.
- Handle invalid input with deterministic error strings.
- Agent prompt instruction: use for math and numeric reasoning.

### Web Search (`web_search`)
- Schema: `{ query: string }` (Zod).
- Tavily-backed wrapper with constrained defaults:
  - limited max results
  - bounded depth
  - explicit timeout
- Return normalized snippets with source title and URL.
- Agent prompt instruction: use only for fresh external information.

### Knowledge Base (`knowledge_base`) — Assignment-Complete
- Schema: `{ query: string }` (Zod).
- Build as a local retrieval module over Cameron docs (minimum 5 meaningful docs).
- Return:
  - top snippets
  - source identifiers/paths
  - no-result message when empty
- This phase is required for full rubric completion, but corpus expansion mechanics are intentionally deferred.

## Memory and Session Strategy
- Maintain per-session rolling chat history in backend memory (or lightweight store) keyed by `sessionId`.
- Truncate context by recent N messages to control token usage.
- Persist only what is needed for coherent follow-ups.
- No long-term user profiles or auth-scoped memory in this phase.

## Security Plan
- Secrets management:
  - Local/dev: `.testEnvVars` or `.env` (gitignored).
  - Hosted runtime: environment variables configured in the deployment platform.
- Required variables:
  - `GEMINI_API_KEY`
  - `TAVILY_API_KEY`
- Guardrails:
  - Never log raw keys or full secret-bearing payloads.
  - Separate system instructions from user content.
  - Treat tool output as untrusted input.
  - Do not expose chain-of-thought; expose tool names only.

## Logging and Observability Plan
- Emit structured JSON logs for:
  - request receipt (no PII/secrets)
  - model invocation summary
  - tool invocation summary (name + argument/result summary)
  - error traces
- Include correlation fields where possible:
  - `sessionId`
  - request timestamp
  - request/trace id
- Keep logs developer-friendly and test-fix-loop friendly.

## Testing and Verification Plan

### Minimum test coverage targets
- Tool routing tests:
  - calculator-appropriate prompts route to `calculator`.
  - freshness prompts route to `web_search`.
  - knowledge prompts route to `knowledge_base` (assignment-complete phase).
- Memory tests:
  - one follow-up conversation case confirms context retention.
- Error tests:
  - invalid calculator expression returns graceful failure.
  - simulated upstream provider error returns graceful UI-safe message.

### Runtime checks
- Document at least one backend run command.
- Document at least one smoke/health-check command.
- Provide quick manual script/checklist for recruiter-facing demo flow.

## Delivery Sequencing
1. Foundation + endpoint skeleton + environment loading.
2. ReAct agent + calculator + web search.
3. Frontend chat wiring + session memory + tool-used disclosure.
4. Structured logging + graceful error paths + timeout/rate/cost controls.
5. Knowledge base tool + source attribution + rubric completion checks.
6. Final verification against PRD acceptance criteria and rubric.

## Dependencies
- LangChain.js + Zod + safe math parser library.
- Gemini API access.
- Tavily API access.
- Existing CamDigitalProfile frontend and deployment setup.

## Risks and Mitigations
- Latency spikes:
  - Mitigation: streaming where possible, strict timeouts, small prompt/context windows.
- Cost overrun:
  - Mitigation: Flash model, capped iterations, constrained Tavily results.
- Prompt injection via search/tool output:
  - Mitigation: strict system prompt boundaries, sanitize/normalize tool output before synthesis.
- Memory bloat/context drift:
  - Mitigation: rolling truncation, bounded history.

## Definition of Done

### MVP done when:
- Chat UI is integrated and stable for normal conversations.
- Agent uses Gemini with ReAct-style tool calling.
- `calculator` and `web_search` work reliably.
- Basic short-turn memory is functional.
- Structured logs and graceful user-facing error handling are present.
- Secrets are externalized and uncommitted.

### Assignment-complete done when:
- `knowledge_base` tool is implemented and routable.
- At least 5 meaningful Cameron documents are queryable.
- Answers include source attribution.
- Minimal verification evidence exists for all tools + memory behavior.
