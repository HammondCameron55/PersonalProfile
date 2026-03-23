---
name: jarvis-logging-and-changelog
description: Applies JARVIS logging and changelog practices: structured logging, CLI test outputs, and concise changelog entries for major changes. Use after implementing and testing work to record what changed and why, and when setting up or reviewing logs to support the test-fix loop and debugging.
---

# JARVIS Logging and Changelog

Use this skill to **capture history and observability**: logs for runtime behavior and a concise changelog for “what changed and why”.

## Core References

- Logging and test-fix loop: `docs/JARVIS-ACCOUNTABILITY.md`
- Changelog: `aiDocs/changelog.md`
- Testing and scripts: `scripts/` (e.g. `scripts/test.sh`)
- Any logging-specific docs or guides (e.g. `ai/guides/testing.md` if present)

## When to Use This Skill

Trigger `jarvis-logging-and-changelog` when:

- A feature, bugfix, or significant refactor has just been implemented and tested.
- You are adding or improving **structured logging** or test outputs.
- You need to update `aiDocs/changelog.md` to reflect recent work.

## Logging Practices (Runtime and Tests)

1. **Prefer structured logs**
   - Use JSON or key-value formats where possible so logs are machine-readable.
   - Include:
     - Timestamp
     - Log level (e.g., debug, info, warn, error)
     - Event or action name
     - Context fields (user id, request id, feature flag, etc. as appropriate)
     - Error details when applicable

2. **Respect log destinations and gitignore**
   - Log files should typically live under `logs/` or equivalent directories that are gitignored (see `.gitignore`).
   - Do not commit log files to the repository.

3. **Integrate logs with tests**
   - Ensure test scripts (e.g. `./scripts/test.sh`) produce **clear, structured output**:
     - Summary of passed/failed tests.
     - Non-zero exit codes for failure.
     - Enough detail to diagnose failures quickly.

4. **Avoid sensitive data**
   - Never log secrets, passwords, or sensitive identifiers in plaintext.
   - Redact where necessary.

## Changelog Practices (aiDocs/changelog.md)

`aiDocs/changelog.md` should remain **concise and high-signal**:

- 1–2 lines per entry.
- Focus on **what changed and why**, not implementation detail.
- Group entries by date.

### Changelog Update Workflow

1. **Identify significant changes**
   - New features or modules.
   - Behavioral changes, especially those visible to users or other teams.
   - Structural changes to tests, logging, or deployment scripts.

2. **Write brief entries**
   - Use bold short labels and brief descriptions.
   - Reference relevant files or areas in plain language (no giant paths).

3. **Place entries under the correct date**
   - Use the existing date heading or create a new one (`## YYYY-MM-DD`).

### Changelog Snippet Template

```markdown
## YYYY-MM-DD

- **Area (short label):** One-line summary of what changed and why it matters.
- **Another area:** Short note tying the change back to JARVIS pipeline, tests, or deployment.