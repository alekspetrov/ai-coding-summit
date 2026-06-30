# TASK-03: Pure Logic + Tests

**Status**: 📋 Planned
**Created**: 2026-06-30
**Assignee**: Manual

---

## Context

**Problem**: Time/status/banner/grouping/search logic drives the whole UI and must be
deterministic across server and client. The prototype computes these inline; we extract them.

**Goal**: Framework-agnostic, side-effect-free `lib/` functions (no `Date.now()` — `now` is always
an argument) with high unit coverage.

---

## Acceptance Criteria

- [ ] `fmtTime` returns Europe/Amsterdam time regardless of process TZ (test under `TZ=America/New_York`).
- [ ] `sessionStatus` and `computeBanner` produce the expected state for all 7 `TIME_STATES` fixtures.
- [ ] `groupIntoSlots` merges parallel sessions into one time row; `groupByDay`/`groupSpeakersByLetter` correct.
- [ ] `searchEvent` matches sessions/speakers/tracks (case-insensitive). Coverage ≥90% on `lib/`.

---

## Implementation

### Phase 1: Time + status
- [ ] `lib/time.ts` — `TZ`, `parseISO`, `fmtTime`, `fmtRange`, `fmtDayLong`, `diffMin`, `sessionStatus`.

### Phase 2: Derived views
- [ ] `lib/banner.ts` — `computeBanner` (hidden outside hours → first live non-break → next non-break ≤360m → hidden).
- [ ] `lib/schedule.ts` — `groupIntoSlots`, `groupByDay`, `groupSpeakersByLetter`.
- [ ] `lib/search.ts` — `searchEvent`.
- [ ] Fixtures from the 7 `TIME_STATES`; colocated `*.test.ts`.

**Files**: `lib/{time,banner,schedule,search}.ts` + tests, `lib/fixtures/time-states.ts`.

---

## Out of Scope

- React wiring of `now` (TASK-05). Rendering (TASK-06).

---

## Technical Decisions

| Decision | Options | Chosen | Reasoning |
|---|---|---|---|
| "now" injection | global clock, argument | `now` as function arg | Deterministic SSR + trivial tests |
| TZ formatting | manual offset math, Intl | `Intl.DateTimeFormat` fixed TZ | Correct DST + locale, runtime-consistent w/ full ICU |

---

## Verify

```bash
TZ=America/New_York pnpm test lib/time.test.ts
pnpm test lib/banner.test.ts lib/schedule.test.ts lib/search.test.ts
```

## Done

- [ ] All pure-logic tests pass under a non-Amsterdam TZ.
- [ ] `lib/` coverage ≥90%.

## Refs

- Plan: Layer 3 → Pure logic; Layer 4 → Hydration sequence.
- Prototype: `components.jsx` (time helpers, sessionStatus), `app.jsx` (computeBanner, TIME_STATES), `screens.jsx` (slot grouping).

---

**Last Updated**: 2026-06-30
