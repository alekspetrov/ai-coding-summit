# TASK-02: Data Layer (Zod + Loader + JSON)

**Status**: 📋 Planned
**Created**: 2026-06-30
**Assignee**: Manual

---

## Context

**Problem**: The prototype ships data via `window.__DATA__` in `data.js`. Production needs a
typed, validated, per-event data contract bundled statically.

**Goal**: Zod schemas mirroring the model, per-event JSON files, and a server-only loader that
validates at load and exposes selectors.

---

## Acceptance Criteria

- [ ] `Event.parse(reactSummitJson)` succeeds; a corrupt fixture throws with a useful path.
- [ ] Discriminated union on `kind` (keynote/talk/lightning/workshop/break) with correct per-kind fields.
- [ ] Datetimes validated as ISO with offset; build-time check that offsets match Europe/Amsterdam.
- [ ] No `any`; types are `z.infer`-derived. Loader is `server-only` + `React.cache`d.

---

## Implementation

### Phase 1: Schema
- [ ] `lib/schema.ts` — `Conference`, `Day`, `Track`, `Room`, `Speaker`, `Session` (discriminated union), `Event`.

### Phase 2: Data + loader
- [ ] Transcribe `data.js` → `data/react-summit-amsterdam-2026.json`.
- [ ] Add `data/jsnation-amsterdam-2026.json`, `data/node-congress-berlin-2026.json` (can reuse schedule, re-skinned).
- [ ] `lib/event.ts` — `import 'server-only'`, load `getEventConfig().dataFile`, `Event.parse`, `React.cache`; selectors `getEvent/getSession/getSpeaker/getDays`.

**Files**: `lib/schema.ts`, `lib/event.ts`, `data/*.json`, `lib/schema.test.ts`.

---

## Out of Scope

- UI consumption (TASK-04/06). Multi-event-per-origin request-time resolution.

---

## Technical Decisions

| Decision | Options | Chosen | Reasoning |
|---|---|---|---|
| Validation | none, io-ts, Zod | Zod 4 discriminated union | Single source of truth via `z.infer`, clear errors |
| Data source | bundled JSON, API/CMS | Static bundled JSON per event | Static-first, offline, forkable |
| Datetime | `Date`, ISO string | ISO string + Intl formatting | Deterministic SSR; conference TZ display |

---

## Verify

```bash
pnpm test lib/schema.test.ts
pnpm typecheck
```

## Done

- [ ] `lib/event.ts` returns a validated `Event`; selectors work.
- [ ] Per-`kind` parse tests pass; corrupt fixture rejected.

## Refs

- Plan: Layer 3 → Data layer; Layer 4 → Schemas.
- Prototype: `data.js`.

---

**Last Updated**: 2026-06-30
