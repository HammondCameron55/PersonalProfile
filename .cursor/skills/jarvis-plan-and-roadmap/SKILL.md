---
name: jarvis-plan-and-roadmap
description: Turns JARVIS-aligned PRDs and feature ideas into concrete plans and date-prefixed roadmaps using the Agentic Development pattern (PRD → Research → Plan → Roadmap → Execute). Use when the user asks for implementation strategy, phased checklists, or execution plans, or when a PRD exists and needs to be turned into actionable work.
---

# JARVIS Plan and Roadmap

Use this skill to **bridge from PRD to execution**: produce a clear plan and a roadmap that later drives development and testing.

## Core References

- Process and pipeline: `docs/JARVIS-ACCOUNTABILITY.md`
- AI workspace conventions: `ai/roadmaps/README.md`
- Project context and current focus: `aiDocs/context.md`
- Relevant PRD(s): e.g. `docs/recruitment-signup-PRD.md` or `docs/<feature>-PRD.md`

## When to Use This Skill

Trigger `jarvis-plan-and-roadmap` when:

- A PRD or clear problem statement already exists.
- The user wants a **step-by-step plan**, “how should we build this?”, or “what are the phases?”.
- You need a **roadmap document** in `ai/roadmaps/` to guide implementation agents.

Do not use this skill for one-off, tiny fixes; those can go straight to `jarvis-dev-and-test-loop` if the surrounding context is clear enough.

## Distinguishing Plan vs Roadmap

- **Plan (what & how)**:
  - Narrative breakdown of architecture, key decisions, and work items.
  - Can live in `ai/` or `docs/`, depending on permanence.
- **Roadmap (checklist & phases)**:
  - Concrete, ordered tasks with checkboxes and completion criteria.
  - Lives under `ai/roadmaps/` and is **date-prefixed** (local, gitignored by default).

## Workflow (HOW to Create Plan + Roadmap)

1. **Confirm PRD**
   - Ensure there is at least a lightweight PRD or problem statement (create via `jarvis-prd-creation` if missing).

2. **Summarize constraints and current state**
   - From `aiDocs/context.md`, `docs/PROJECT-CONTEXT.md`, and the PRD, capture:
     - Tech stack.
     - Deployment constraints (air-gap, Proxmox/Ansible, Docker).
     - Existing components that will be reused.

3. **Draft the Plan**
   - Break work into logical sections:
     - Architecture / design choices.
     - Data flows / interfaces.
     - Security / testing approach.
     - Dependencies and sequencing.
   - Keep it high-level but concrete enough that a senior engineer could implement from it.

4. **Create or update the Roadmap**
   - Choose a filename like `ai/roadmaps/YYYY-MM-DD_<feature-name>_roadmap.md`.
   - Organize tasks into phases (e.g., Phase 0: Setup, Phase 1: Core feature, Phase 2: Hardening, Phase 3: Documentation).
   - Include checkboxes and end-of-phase validation bullets.

5. **Link Plan, Roadmap, and PRD**
   - Ensure each artifact references the others so future agents can navigate quickly.

## Roadmap Template (Copy/Paste)

```markdown
# [Feature / Module Name] — Roadmap
_Date: YYYY-MM-DD_

## Links
- PRD: `docs/<feature-name>-PRD.md`
- Context: `aiDocs/context.md`
- JARVIS: `docs/JARVIS-ACCOUNTABILITY.md`

## Phase 0 — Discovery and Setup
- [ ] Confirm environment and constraints (air-gap, Proxmox/Ansible, Docker).
- [ ] Review existing code and docs relevant to this feature.
- [ ] Decide where new code and docs will live.

Completion criteria:
- [ ] Constraints and assumptions documented in PRD.
- [ ] Affected files and directories identified.

## Phase 1 — Core Implementation
- [ ] Implement core feature(s) in code.
- [ ] Add or update tests to cover new behavior.
- [ ] Update or create any required scripts (build/run/test) if needed.

Completion criteria:
- [ ] Core tests pass locally via `./scripts/test.sh`.
- [ ] Feature works end-to-end in dev environment.

## Phase 2 — Hardening and Validation
- [ ] Address security considerations from PRD.
- [ ] Handle edge cases and error paths.
- [ ] Update docs/README where behavior changed.

Completion criteria:
- [ ] All critical risks from PRD addressed or explicitly accepted.
- [ ] Documentation is up to date.

## Phase 3 — Logging and Changelog
- [ ] Ensure structured logging and test outputs follow JARVIS guidance.
- [ ] Add 1–2 line entry to `aiDocs/changelog.md` (if this repo uses it).

Completion criteria:
- [ ] Logs are useful for debugging.
- [ ] Changelog reflects what changed and why.