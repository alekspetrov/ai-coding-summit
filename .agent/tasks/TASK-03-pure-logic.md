# TASK-03: Pure Logic + Tests

**Status**: ✅ Merged (Pilot #2, commit `9074176`) · ⚠️ **data-layer integration deferred** — see Review
**Created**: 2026-06-30
**Assignee**: Pilot (handoff)

> **Review (2026-06-30, read-only — no execution):** `lib/{time,banner,schedule,search}.ts`
> + tests + `lib/fixtures/time-states.ts` are merged; commit `9074176` reports 96 tests green
> under `TZ=America/New_York`. The pure-logic layer is sound **in isolation**.
>
> **The index status "integrated" overstates it.** The functions are still typed against the
> throwaway `lib/types.ts` (its own header says *"TASK-02 will replace these"*), which was
> **not** removed — commit `9074176` explicitly defers it (*"Unify as follow-up"*). This passes
> CI for two reasons: (a) array-taking functions (`groupIntoSlots`, `computeBanner`, …) accept
> `schema.Session[]` because the strict schema type is structurally assignable to the loose
> `types.Session`; (b) the one function that reads a whole `Event` — `searchEvent` — has **no
> real caller yet** (UI wiring is TASK-05/06).
>
> ⚠️ **Latent defect (will throw when wired):** `searchEvent`'s `SearchableEvent` reads
> SCREAMING_CASE keys (`event.SESSIONS` / `SPEAKERS` / `TRACKS`); the merged `@/lib/schema`
> `Event` uses lowercase (`sessions`/`speakers`/`tracks`). Calling `searchEvent(getEvent(), q)`
> → `undefined.filter` → **TypeError**, uncaught by typecheck/tests.
>
> **Follow-up before TASK-05/06 wire search:** rewire logic imports `./types` → `@/lib/schema`,
> rename `SearchableEvent` keys to lowercase (or accept `Event` directly), delete `lib/types.ts`.

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
