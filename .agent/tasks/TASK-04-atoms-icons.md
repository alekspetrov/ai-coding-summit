# TASK-04: Atoms + Icons

**Status**: 🚧 Partial — Phase 1 (icons + atoms) + `FavoriteStar` done; Phase 2 cards in progress
**Created**: 2026-06-30
**Assignee**: Manual

> **Review (2026-06-30, read-only):** Phase 1 landed (`components/icons/icons.tsx`,
> `components/common/*`, `components/session/FavoriteStar.tsx` + colocated tests).
> Phase 2 in progress: `components/speaker/SpeakerRow.tsx` exists but is **untracked /
> uncommitted, with no colocated test yet** (every sibling has one). It is wired against
> the *merged* `@/lib/schema` `Speaker` (correct contract) and reuses `Avatar` + icons +
> theme tokens consistently. `SessionCard` not yet started. Cards are **no longer blocked**
> — the TASK-02 data layer is on main. Treat `SpeakerRow` as not-done until test + commit land.

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
