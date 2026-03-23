---
name: jarvis-prd-creation
description: Creates or updates Product Requirement Documents (PRDs) following the JARVIS-ACCOUNTABILITY pattern. Use when defining or refining the scope of a feature, lab module, or app change, or when the user’s goal is fuzzy and needs to be turned into a clear problem statement, users, constraints, risks, and acceptance criteria.
---

# JARVIS PRD Creation

Use this skill to **turn fuzzy ideas into clear PRDs** that can drive planning, roadmaps, and implementation.

## Core References

- Primary process: `docs/JARVIS-ACCOUNTABILITY.md`
- Project context and repo role: `docs/PROJECT-CONTEXT.md`
- Existing PRD patterns (if present): `docs/recruitment-signup-PRD.md`
- AI context and current focus: `aiDocs/context.md`

If these files are missing, still follow the same structure but adapt names and locations to the current repo.

## When to Use This Skill

Trigger `jarvis-prd-creation` when:

- The user describes an idea, outcome, or problem that is **not yet crisply specified**.
- The user asks for “requirements”, “scope”, “definition of done”, or “what exactly are we building?”.
- You need a **single, canonical reference doc** before creating a plan or roadmap.

Avoid using this skill for tiny, localized tweaks where a full PRD would be overkill.

## PRD Structure (WHAT to Produce)

A JARVIS-aligned PRD should be concise and cover:

1. **Title and summary**
2. **Problem / opportunity**
3. **Users and stakeholders**
4. **Scope (in / out)**
5. **Constraints (including air-gap, security, infra limits)**
6. **Risks and tradeoffs**
7. **Acceptance criteria / success metrics**
8. **Dependencies and related docs**

Keep prose short; bullets beat paragraphs.

## Workflow (HOW to Create or Update a PRD)

1. **Gather context**
   - Read `aiDocs/context.md` and `docs/PROJECT-CONTEXT.md` to understand the repo’s role.
   - If this is the recruitment-signup repo, skim `docs/recruitment-signup-PRD.md` to match tone and structure.

2. **Clarify the ask**
   - From the user’s request, infer:
     - What problem they are trying to solve.
     - Who benefits (users, teams).
     - Any explicit constraints (e.g., air-gapped, Proxmox/Ansible, training objectives).

3. **Draft or update the PRD**
   - If a PRD already exists for this area (e.g. `docs/recruitment-signup-PRD.md`), **add a new section** or extend it rather than creating random new files.
   - If this is a new module or feature with no PRD:
     - Propose a filename under `docs/` such as `docs/<feature-name>-PRD.md`.
   - Use the template below as a starting point.

4. **Keep it implementation-neutral**
   - Describe **what and why**, not detailed design or code.
   - Defer technical breakdown to `jarvis-plan-and-roadmap`.

5. **Validate PRD completeness**
   - Check that:
     - The problem is clear and testable.
     - Acceptance criteria can later be mapped to tests.
     - Constraints and risks are visible (not hidden assumptions).

## PRD Template (Copy/Paste)

```markdown
# [Feature / Module Name] — PRD

## 1. Summary
One or two sentences describing what this is and why it matters.

## 2. Problem / Opportunity
- What problem are we solving?
- Who experiences this problem today?

## 3. Users and Stakeholders
- Primary users:
- Secondary users:
- Stakeholders (e.g., teams, roles, training audiences):

## 4. Scope
- In scope:
  - [ ]
- Out of scope:
  - [ ]

## 5. Constraints
- Technical (e.g., air-gapped, Proxmox/Ansible, Python version, lab environment):
- Security:
- Organizational / process:

## 6. Risks and Tradeoffs
- Risk 1 and mitigation
- Risk 2 and mitigation

## 7. Acceptance Criteria
List concrete, testable outcomes. Each should be checkable later via tests, scripts, or manual verification.

- [ ] Criterion 1
- [ ] Criterion 2

## 8. Dependencies and References
- Related docs:
  - `docs/PROJECT-CONTEXT.md`
  - `docs/JARVIS-ACCOUNTABILITY.md`
  - [Other relevant docs or repos]