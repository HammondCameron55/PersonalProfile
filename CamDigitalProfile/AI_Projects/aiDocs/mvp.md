# MVP Definition — CamDigitalProfile Agentic AI Chat

**Version:** 1.0  
**Owner:** Cameron Hammond  
**Date:** 2026-03-23

---

## 1. MVP Goal

Ship a recruiter-facing, web-integrated AI chat experience that demonstrates practical agentic AI fundamentals (ReAct, tools, memory, logging) on the CamDigitalProfile site using LangChain.js and Gemini.

This MVP is intentionally scoped to deliver clear value quickly while preparing for assignment-complete RAG requirements.

---

## 2. Target Users

- Recruiters and hiring managers who need a fast understanding of Cameron's experience.
- Technical interviewers evaluating engineering depth and agentic AI implementation quality.

---

## 3. MVP Scope (In Scope)

- Web chat UI integrated into the existing CamDigitalProfile site.
- Backend endpoint for chat requests using LangChain.js and Gemini.
- ReAct-style tool-using behavior with:
  - `calculator`
  - `web_search` (Tavily)
- Basic conversation memory for short multi-turn context.
- Structured JSON logging for message flow, tool calls, and errors.
- Secrets and config handled through environment variables / secure stores.
- Basic docs and commands so another developer can run and verify the feature.

---

## 4. Out of Scope for MVP

- Advanced RAG quality tuning and large-scale ingestion pipelines.
- Persistent long-term memory and user account personalization.
- Complex multi-agent orchestration.
- Full production observability stack and enterprise-grade monitoring.

Note: `knowledge_base` RAG remains required for assignment-complete and is addressed in the PRD and roadmap phases.

---

## 5. MVP Acceptance Criteria

- [ ] Chat UI is visible and usable in the web site (not terminal-only).
- [ ] User messages return coherent assistant responses through the backend.
- [ ] Agent can use `calculator` for numeric prompts.
- [ ] Agent can use `web_search` for current/external information prompts.
- [ ] At least one short follow-up conversation works via memory.
- [ ] Structured logs show request, tool-call, and error events.
- [ ] No secrets are committed in repo files.
- [ ] At least one command exists to run backend.
- [ ] At least one command/script exists for smoke/health verification.

---

## 6. Verification Approach

- Run command to start backend and confirm endpoint availability.
- Execute smoke/health command or script and confirm pass output.
- Run a minimal manual test set:
  - calculator question
  - web search question
  - follow-up memory question
- Confirm logs include message input, tool decision/use, and response/error state.

---

## 7. Dependencies

- Google Gemini API key.
- Tavily API key.
- LangChain.js and supporting libraries (e.g., Zod, math library).
- Existing CamDigitalProfile UI shell and deployment setup.

---

## 8. Relationship to Next Phases

After MVP sign-off:

1. Add `knowledge_base` RAG over at least 5 meaningful docs (including transcript/story `.md`/`.txt` files).
2. Validate multi-tool routing across all three tools.
3. Expand tests and documentation to satisfy assignment-complete rubric evidence.

This progression follows JARVIS pipeline expectations: PRD -> plan -> roadmap -> implement -> test/verify -> log.
