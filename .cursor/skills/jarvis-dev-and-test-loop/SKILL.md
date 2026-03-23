---
name: jarvis-dev-and-test-loop
description: Guides implementation using the JARVIS-ACCOUNTABILITY implementation pattern and the autonomous test-fix loop. Use when writing or modifying code, scripts, or configs based on an existing plan or roadmap, and when running tests, inspecting failures, patching code, and re-running until passing.
---

# JARVIS Dev and Test Loop

Use this skill to **implement changes and drive them to green tests** using the JARVIS development pattern and test-fix loop.

## Core References

- Implementation and test-fix loop: `docs/JARVIS-ACCOUNTABILITY.md`
- Project context and tech stack: `aiDocs/context.md`
- Roadmaps and plans: `ai/roadmaps/` (if present)
- Scripts (build/run/test): `scripts/` (e.g. `scripts/build.sh`, `scripts/run.sh`, `scripts/test.sh`)

## When to Use This Skill

Trigger `jarvis-dev-and-test-loop` when:

- There is already a **PRD and roadmap/plan** for the work.
- The user asks to **implement**, **refactor**, **fix a bug**, or **debug failing tests**.
- You need to run `./scripts/test.sh` (or equivalent) and iterate.

Avoid using this skill to define scope or requirements—that belongs to `jarvis-prd-creation` and `jarvis-plan-and-roadmap`.

## Development & Test-Fix Workflow

1. **Anchor to the roadmap**
   - Find the relevant roadmap in `ai/roadmaps/` or equivalent docs.
   - Identify the **smallest next task** you can complete end-to-end.

2. **Plan the change in the current file(s)**
   - Before editing, quickly summarize:
     - What behavior should change?
     - Which files/functions will be touched?
   - Match the repo’s coding style (`aiDocs/coding-style.md` if present).

3. **Implement in small, testable slices**
   - Make minimal, coherent edits rather than broad refactors.
   - Keep security and air-gap constraints in mind (no real secrets, no unintended external calls).

4. **Run tests via CLI**
   - Prefer project scripts:
     - Example: `./scripts/test.sh` from repo root (as used in this lab).
   - Keep outputs structured (tests often write JSON or logs).
   - Treat **non-zero exit codes as failures** that must be understood.

5. **Test-fix loop**
   - If tests fail:
     - Read the error message and stack trace carefully.
     - Identify which test and which behavior failed.
     - Hypothesize the root cause and adjust code or tests.
     - Re-run only as many tests as needed to confirm the fix (or the full suite if cheap).
   - Repeat until the relevant tests pass.

6. **Verify against PRD and roadmap**
   - After tests pass, confirm:
     - The behavior aligns with the PRD’s acceptance criteria.
     - The corresponding roadmap tasks can be checked off.

7. **Prepare for logging and changelog**
   - Note any significant behavior or interface changes for `jarvis-logging-and-changelog`.

## Mini Checklist (Copy/Paste)

```markdown
JARVIS Dev & Test Loop:

- [ ] Read the relevant roadmap/plan and identify the next small task.
- [ ] Make focused code changes matching repo style.
- [ ] Run tests via project scripts (e.g. ./scripts/test.sh).
- [ ] If tests fail, inspect output, hypothesize cause, and patch.
- [ ] Re-run tests until passing.
- [ ] Confirm behavior against PRD acceptance criteria.
- [ ] Capture key changes for logs and aiDocs/changelog.md.