# TASK-02: Data Layer (Zod + Loader + JSON)

**Status**: ✅ Complete — merged to main (Pilot #1, data layer commit `ae083c4` → integrated via `1254f4e`)
**Created**: 2026-06-30
**Assignee**: Pilot (handoff)

> **Review (2026-06-30, read-only — no execution):** schema verified by reading.
> `lib/schema.ts` implements the 5-variant discriminated union on `kind`, ISO datetimes
> with `offset: true`, `z.infer`-derived types, and a `server-only` + `React.cache` loader
> with `getEvent/getSession/getSpeaker/getDays` selectors. Merge commit `1254f4e` reports
> green (34 tests); **not re-run here**.
> ⚠️ **One AC gap:** the *"build-time check that offsets match Europe/Amsterdam"* is **not
> implemented** — `ISODatetime` only requires *an* offset, not that it equals Amsterdam's.
> URL-ish fields (`socials.*`, `media.*Url`, `signupUrl`) are bare `z.string()`, not `z.url()`.

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
