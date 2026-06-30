# TASK-05: State + Providers + Banner ("now")

**Status**: 📋 Planned
**Created**: 2026-06-30
**Assignee**: Manual

---

## Context

**Problem**: The two values a server can't know — current time and personal state (localStorage)
— drive most of the distinctive UI. Naively rendering them causes hydration mismatches and flashes.

**Goal**: Hydration-safe client layer: a `now` provider (neutral baseline → post-mount clock) and
`useSyncExternalStore`-backed favorites/recents, feeding the sticky live banner and nav badge.

---

## Acceptance Criteria

- [ ] No React hydration warnings on any route (server baseline === first client render).
- [ ] `?t=d1-am` shows a live banner with a ticking "ends in" countdown; `?t=post` hides it.
- [ ] Toggling a favorite updates the star and the nav badge; survives reload; brand swap resets namespace.
- [ ] Banner is sticky at top (`position: sticky; top: 0`, safe-area aware); no CLS on appear.

---

## Implementation

### Phase 1: now + persistence
- [ ] `context/NowProvider.tsx` — `now=null` on SSR/first paint; `useEffect` → `new Date()` (or `?t=`/`NEXT_PUBLIC_TIME_STATE`); `setInterval(30s)`.
- [ ] `hooks/useLocalState.ts` via `useSyncExternalStore` (empty server snapshot); `lib/storage.ts` (`gn.companion.{brand}.{kind}` + schema version).
- [ ] `context/{FavoritesProvider,RecentsProvider}.tsx`.

### Phase 2: live UI
- [ ] `components/chrome/HappeningNowBanner.tsx` (sticky; computeBanner + countdown), `FavoriteStar`, `BottomNav` (badge from favorites, hidden until mounted).

**Files**: `context/*`, `hooks/*`, `lib/storage.ts`, `components/chrome/{HappeningNowBanner,BottomNav}.tsx`, `components/session/FavoriteStar.tsx` + tests.

---

## Out of Scope

- Screen composition + routing (TASK-06).

---

## Technical Decisions

| Decision | Options | Chosen | Reasoning |
|---|---|---|---|
| localStorage SSR | `useState`+effect, `useSyncExternalStore` | `useSyncExternalStore` (empty server snapshot) | No mismatch; clean post-hydration reconcile |
| "now" | render-time `Date.now()`, post-mount provider | Post-mount `NowProvider` | Eliminates the central hydration hazard |
| Seeded favorites | keep prototype seeds, empty | Empty in production | Seeds reintroduce mismatch |

---

## Verify

```bash
pnpm test context/ components/chrome/
# manual: /?t=d1-am (live), /?t=post (hidden); toggle favorite → badge; reload
```

## Done

- [ ] Console clean (no hydration warnings) across routes.
- [ ] Banner states + favorites persistence verified.

## Refs

- Plan: Layer 3 → "now" problem, State & persistence; Top risks #1, #2, #5.
- Prototype: `app.jsx` (useLocalState, computeBanner, TIME_STATES), `components.jsx` (HappeningNowBanner, BottomNav, FavoriteStar).

---

**Last Updated**: 2026-06-30
