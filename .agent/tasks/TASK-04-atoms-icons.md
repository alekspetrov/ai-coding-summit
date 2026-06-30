# TASK-04: Atoms + Icons

**Status**: ✅ Components complete (atoms + icons + both cards, all tested) — wiring deferred to TASK-05/06
**Created**: 2026-06-30
**Assignee**: Manual

> **Review (2026-06-30, read-only; updated after research pass):** all components built and
> **all have colocated tests**:
> - Phase 1 — `components/icons/icons.tsx` (13 icons), `components/common/*` (Avatar, KindChip,
>   TrackChip, LiveDot, EmptyState, SkeletonCard), `components/session/FavoriteStar.tsx`
>   (the only Client Component).
> - Phase 2 — `components/session/SessionCard.tsx` (5 kind variants, imports `@/lib/schema`)
>   **+ `SessionCard.test.tsx`**, and `components/speaker/SpeakerRow.tsx` **+ `SpeakerRow.test.tsx`**.
>   *(Corrects an earlier note that said SpeakerRow had no test — it now does.)*
> - `lib/storage.ts` (`storageKey`/`isCompanionKey`) added as TASK-05 groundwork — **untested, no callsites yet.**
>
> ⚠️ Not wired: `SessionCard`/`SpeakerRow` take `href` props pointing at `/sessions/[id]`,
> `/speakers/[id]` routes that **don't exist yet** (TASK-06). They accept `@/lib/schema` props
> but no page passes real data (TASK-05/06). Components are ready; integration is the open work.

---

## Context

**Problem**: The prototype's distinctive look lives in precise inline-styled atoms (exact px,
0.5px hairlines, specific rgba). These must be rebuilt as reusable components without token drift.

**Goal**: Pixel-faithful presentational atoms (server components) on Tailwind + CSS-var tokens,
plus the ported icon set and the live-beacon animation.

---

## Acceptance Criteria

- [ ] Atoms match the prototype at documented px/opacity values (light + dark).
- [ ] `KindChip` 5 variants; `SessionCard` keynote/talk/lightning/workshop/break; past → `opacity .5`.
- [ ] `LiveDot` pulse + `FavoriteStar` press scale honor `prefers-reduced-motion`.
- [ ] RTL tests via `getByRole`/`getByLabelText`; screenshot diff on 3 representative atoms.

---

## Implementation

### Phase 1: Primitives + icons
- [ ] `components/icons/icons.tsx` (schedule/search/star/users/back/pin/clock/x/chevR/external/coffee/utensils/party).
- [ ] `Avatar`, `TrackChip`, `KindChip`, `LiveDot`, `SectionLabel`, `EmptyState`, `SkeletonCard`, `DetailKV`, `ResourceRow`, `ScreenHeader`, `TimeMarker`.

### Phase 2: Composite cards
- [ ] `SessionCard` (server static parts + client `FavoriteStar`/status leaves), `SpeakerRow`.

**Files**: `components/common/*`, `components/session/*`, `components/speaker/*`, `components/icons/icons.tsx` + colocated tests.

---

## Out of Scope

- Data wiring, routing, navigation (TASK-06). Banner/now/favorites state (TASK-05).

---

## Technical Decisions

| Decision | Options | Chosen | Reasoning |
|---|---|---|---|
| Card click target | `div onClick`, `<Link>` | `<Link>` (nav) / `<button>` (actions) | A11y: keyboard, semantics, deep links |
| Hairlines | 1px, 0.5px | `border-[0.5px]` | Match prototype on retina |

---

## Verify

```bash
pnpm test components/
pnpm typecheck
```

## Done

- [ ] All atoms render with correct roles/labels; tests pass.
- [ ] Visual parity confirmed on Avatar/SessionCard/KindChip.

## Refs

- Plan: Layer 1 → Components; Layer 3 → Styling, A11y.
- Prototype: `components.jsx` (atoms, ICONS), `ios-frame.jsx` (NOT ported — device chrome dropped).

---

**Last Updated**: 2026-06-30
