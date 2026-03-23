---
name: jarvis-pipeline-orchestrator
description: Enforces the JARVIS-ACCOUNTABILITY pipeline (PRD → Research → Plan → Roadmap → Implement → Test → Log) across repositories. Use when starting or reshaping any substantial workstream to decide which JARVIS phase to run next, ensure outputs land in the correct files and folders (aiDocs/, ai/, docs/), and keep agents aligned with docs/JARVIS-ACCOUNTABILITY.md.
---

# JARVIS Pipeline Orchestrator

Use this skill to **steer work through the JARVIS pipeline**, not to do a single phase in depth. It decides **where we are** (PRD, Plan, Roadmap, Dev, Test, Logging) and **what should happen next**, then hands off to the more specific JARVIS skills.

## Core References

- **JARVIS source of truth:** `docs/JARVIS-ACCOUNTABILITY.md`
- **AI context bookshelf:** `aiDocs/context.md`
- **Changelog:** `aiDocs/changelog.md`
- **Roadmaps convention:** `ai/roadmaps/README.md` (if present)

If these files are not present in the current repo, adapt the same pipeline concept to whatever closest equivalents exist (README, CONTRIBUTING, project docs).

## When to Use This Skill

Use `jarvis-pipeline-orchestrator` when:

- A user asks for help with a **non-trivial task or feature** (“build X”, “refactor Y”, “set up deployment”, “design a lab”).
- You suspect the user is **mixing phases** (e.g., jumping into coding without a PRD/plan).
- You need to **re-anchor** to JARVIS after context drift (e.g., long sessions, many side quests).

Do **not** use this skill just to write a small function or quick fix where the pipeline is already clearly defined and in progress.

## How to Orchestrate the JARVIS Pipeline

When invoked:

1. **Anchor to context**
   - Look for `aiDocs/context.md`. If present, scan the “Critical Files” and “Current Focus” sections.
   - Look for `docs/JARVIS-ACCOUNTABILITY.md`. Treat it as the canonical process reference.

2. **Identify the current phase**
   - Infer from the user’s request and existing artifacts:
     - No clear problem statement or scope → we are at **PRD**.
     - PRD exists but no concrete implementation plan or roadmap → we are at **Plan/Roadmap**.
     - Plan/roadmap exists and user wants code changes → we are at **Dev/Test**.
     - Work is done and we need history/traceability → we are at **Logging/Changelog**.

3. **Route to the appropriate JARVIS skill**
   - For **PRD / scope** work → use `jarvis-prd-creation`.
   - For **Plan / Roadmap** work → use `jarvis-plan-and-roadmap`.
   - For **implementation / tests / debug** → use `jarvis-dev-and-test-loop`.
   - For **logging / changelog / history** → use `jarvis-logging-and-changelog`.

4. **Enforce JARVIS bias toward truth**
   - Show reasoning when changes are non-trivial.
   - Flag uncertainties explicitly.
   - Say “I don’t know” instead of guessing.
   - When in doubt, re-check `aiDocs/context.md` or `docs/JARVIS-ACCOUNTABILITY.md`.

5. **Keep artifacts in the right places**
   - Long-lived knowledge → `aiDocs/` or `docs/`.
   - Local working notes, research, and roadmaps → `ai/` (e.g. `ai/roadmaps/`).
   - Code and tests → project folders (e.g. `recruitment-signup/`, `scripts/`).

## Orchestration Checklist (Copy/Paste)

Use this mini-checklist before doing major work:

```markdown
JARVIS Orchestration:

- [ ] Did I review aiDocs/context.md and docs/JARVIS-ACCOUNTABILITY.md (if present)?
- [ ] Which phase is this: PRD, Plan/Roadmap, Dev/Test, or Logging?
- [ ] Which JARVIS skill should run next (prd-creation, plan-and-roadmap, dev-and-test-loop, logging-and-changelog)?
- [ ] Where will outputs live (docs/, aiDocs/, ai/, code dirs)?
- [ ] Did I keep the pipeline order: PRD → Plan → Roadmap → Implement → Test → Log?