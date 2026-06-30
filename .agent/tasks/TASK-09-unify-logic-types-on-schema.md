# TASK-09: Unify Pure-Logic Types on the Zod Schema

**Status**: ✅ Complete (commit 193474e) — `lib/types.ts` deleted, `searchEvent` takes lowercase `Event`, fixtures schema-valid, 109 tests green under `TZ=America/New_York`
**Created**: 2026-06-30
**Assignee**: Manual

---

## Context

**Problem**: TASK-03's pure-logic layer (`lib/{time,banner,schedule,search}.ts`) is typed against a
throwaway `lib/types.ts` instead of the canonical Zod-inferred types in `lib/schema.ts` (TASK-02).
The TASK-03 integration commit (`9074176`) explicitly deferred the unification (*"Unify as
follow-up"*) and kept `lib/types.ts`. Tests pass in isolation, so the gap is invisible until the UI
wires these functions to the real `getEvent()` result.

Two concrete defects result:

1. **`searchEvent` will throw on real data (latent `TypeError`).** `lib/search.ts:9-13` declares
   `SearchableEvent` with **SCREAMING_CASE** keys (`SESSIONS`/`SPEAKERS`/`TRACKS`), and `lib/types.ts:75-82`
   mirrors that on its `Event`. The merged `lib/schema.ts:101-108` `Event` uses **lowercase**
   (`sessions`/`speakers`/`tracks`). `searchEvent(getEvent(), q)` → `event.SESSIONS` is `undefined`
   → `undefined.filter` → `TypeError`. Not caught by typecheck or tests because no real caller exists yet.

2. **Type-safety hole on `Session` (C2).** `lib/types.ts:60-71` collapses content kinds into one loose
   `ContentSession` with **optional** workshop fields (`capacity?`/`prerequisites?`/`signupUrl?`),
   whereas `lib/schema.ts` makes them **required** on `WorkshopSession` and keeps a per-kind
   discriminated union. Logic typed against `./types` would accept a workshop the Zod loader rejects,
   and `kind`-narrowing differs between the two type systems.

**Goal**: Single source of truth — all logic, fixtures, and tests type against `@/lib/schema`;
`lib/types.ts` deleted; `searchEvent` consumes the real `Event` shape.

---

## Acceptance Criteria

- [ ] `lib/types.ts` is deleted; nothing imports from `./types` / `../types`.
- [ ] `searchEvent` accepts the canonical `Event` (or `Pick<Event, 'sessions'|'speakers'|'tracks'>`) and
      reads lowercase keys; `searchEvent(getEvent(), q)` runs without throwing.
- [ ] `banner.ts`/`schedule.ts`/`search.ts`/fixtures import domain types from `@/lib/schema`.
- [ ] Workshop required-field divergence resolved (logic relies on the schema's discriminated union).
- [ ] All existing TASK-03 tests still pass (96) under `TZ=America/New_York`; fixtures retyped, not weakened.

---

## Implementation

### Phase 1: Repoint imports (blast radius — verified by research pass)

- [ ] `lib/banner.ts:2` — `import type { Session } from './types'` → `@/lib/schema`
- [ ] `lib/schedule.ts:1` — `import type { Session, Speaker } from './types'` → `@/lib/schema`
- [ ] `lib/search.ts:1` — `import type { Session, Speaker, Track } from './types'` → `@/lib/schema`
- [ ] `lib/fixtures/time-states.ts:3` — `import type { Conference, Session, Speaker, Track } from '../types'` → `@/lib/schema`
- [ ] `lib/schedule.test.ts:4` — direct `./types` import → `@/lib/schema`

### Phase 2: Fix `searchEvent` shape

- [ ] `lib/search.ts:9-13` — drop `SearchableEvent`'s SCREAMING_CASE keys; accept the real `Event`
      (lowercase `sessions`/`speakers`/`tracks`). Update `lib/search.test.ts` fixture construction
      (currently `{ SESSIONS, SPEAKERS, TRACKS }`) accordingly.

### Phase 3: Delete + verify

- [ ] Remove `lib/types.ts`. Retype `lib/fixtures/time-states.ts` constants against schema types
      (workshops must now satisfy required `capacity`/`prerequisites`/`signupUrl`).
- [ ] Re-run logic tests under a non-Amsterdam TZ.

**Files**: `lib/{banner,schedule,search}.ts`, `lib/search.ts` (`SearchableEvent`), `lib/fixtures/time-states.ts`,
`lib/schedule.test.ts`, `lib/search.test.ts`, **delete** `lib/types.ts`.

---

## Out of Scope

- Actually calling the logic from pages/components (that's the TASK-05/06 wiring this unblocks).

---

## Technical Decisions

| Decision | Options | Chosen | Reasoning |
|---|---|---|---|
| Search input type | keep `SearchableEvent`, accept full `Event`, accept `Pick<…>` | `Pick<Event,'sessions'\|'speakers'\|'tracks'>` | Minimal surface, real lowercase keys, no whole-Event coupling |
| Fixtures source of truth | keep loose `types.ts`, type against schema | Schema types | One contract; forces fixtures to satisfy required workshop fields |

---

## Verify

```bash
TZ=America/New_York pnpm test lib/
pnpm typecheck
```

## Done

- [ ] `git grep "from './types'"` and `"from '../types'"` return nothing.
- [ ] `searchEvent(getEvent(), 'react')` returns results instead of throwing.
- [ ] Logic tests green under non-Amsterdam TZ.

## Refs

- Source: read-only review + Navigator research pass (2026-06-30).
- Origin: TASK-03 integration commit `9074176` (deferred the unify).
- Related: [[TASK-03]] (pure logic), [[TASK-02]] (schema), [[TASK-05]]/[[TASK-06]] (consumers, blocked on this).

---

**Last Updated**: 2026-06-30
