# TASK-08: Navigator Docs Update

**Status**: 📋 Planned
**Created**: 2026-06-30
**Assignee**: Manual

---

## Context

**Problem**: `CLAUDE.md` and `.agent/system/*` are still greenfield placeholders ("TBD"). Once the
stack is real, the project docs must reflect the shipped architecture so future sessions load
accurate context.

**Goal**: Populate system docs + update `CLAUDE.md` with the real Next.js stack and patterns;
keep the task index current.

---

## Acceptance Criteria

- [ ] `.agent/system/project-architecture.md` documents routes, server/client split, data flow, single-deploy model.
- [ ] `.agent/system/tech-stack-patterns.md` documents Tailwind+CSS-var tokens, the `now`/hydration pattern, `useSyncExternalStore` persistence, Zod data contract, PWA/SW rules.
- [ ] Root `CLAUDE.md` no longer placeholder: real tech stack, project description, Next.js framework patterns, project-specific forbidden actions.
- [ ] `.agent/DEVELOPMENT-README.md` index reflects current tasks.

---

## Implementation

- [ ] Draft system-doc skeletons during TASK-01 scaffold; finalize here after TASK-06/07.
- [ ] Update `CLAUDE.md` Context, Tech Stack, Framework-Specific Patterns, Forbidden Actions.
- [ ] Refresh navigator index; archive completed task docs.

**Files**: `.agent/system/{project-architecture,tech-stack-patterns}.md`, `CLAUDE.md`, `.agent/DEVELOPMENT-README.md`.

---

## Out of Scope

- Code changes (covered by TASK-01..07).

---

## Verify

```bash
# Manual: open a fresh Navigator session and confirm loaded docs match reality.
```

## Done

- [ ] System docs reflect shipped architecture; `CLAUDE.md` updated; index current.

## Refs

- Plan: Phased execution plan → TASK-08; "Nav docs update" workstream.

---

**Last Updated**: 2026-06-30
