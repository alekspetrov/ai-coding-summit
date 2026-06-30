# TASK-06: Screens + Routing

**Status**: 📋 Planned
**Created**: 2026-06-30
**Assignee**: Manual

---

## Context

**Problem**: The prototype navigates via an in-memory tab/stack. Production needs real,
deep-linkable App Router routes with the tab shell + detail routes, composing the atoms and the
live/personal layer.

**Goal**: All 6 screens working end-to-end as routes, prerendered where static, with the client
islands wired (day switcher, auto-scroll-to-live, A–Z rail, search) and native scroll restoration.

---

## Acceptance Criteria

- [ ] 6 screens match the prototype: Schedule `/`, Search `/search`, Saved `/saved`, Speakers `/speakers`, `/session/[id]`, `/speaker/[id]`.
- [ ] Detail routes deep-link + share; `dynamicParams=false` → 404 on bad id; bottom nav hidden on detail.
- [ ] Schedule auto-scrolls to the live slot under `?t=d1-am` (window scroll + `scrollIntoView` + `scroll-margin-top`).
- [ ] Speakers A–Z jump works; Search autofocus + recents + "From your saved"/"Don't miss these" + Browse tracks + grouped results + no-results state.
- [ ] Saved groups by day with exact empty-state copy.

---

## Implementation

### Phase 1: Shell + tab screens
- [ ] `app/(tabs)/layout.tsx` (banner + `{children}` + BottomNav), Schedule/Search/Saved/Speakers pages.
- [ ] Client islands: `DaySwitcher` (`?day=`), `ScheduleScroller`, `AZJumpRail`, `SearchBox`/`SearchResults`/`RecentSearches`.

### Phase 2: Detail routes
- [ ] `app/session/[id]/page.tsx`, `app/speaker/[id]/page.tsx` with `generateStaticParams` + `dynamicParams=false`; `PushHeader` (`router.back()`).
- [ ] Route-change focus management (`<h1 tabindex="-1">` + `aria-live`).

**Files**: `app/(tabs)/**`, `app/session/[id]/page.tsx`, `app/speaker/[id]/page.tsx`, `components/{schedule,search,chrome,speaker}/*`.

---

## Out of Scope

- PWA/offline (TASK-07). Intercepting/parallel routes for slide-over (deferred enhancement).

---

## Technical Decisions

| Decision | Options | Chosen | Reasoning |
|---|---|---|---|
| Navigation | in-memory stack, real routes | Real routes + `(tabs)` group | Deep-linkable, shareable, nav hides on detail naturally |
| Scroll | inner `overflow:auto`, window scroll | Window scroll | Next scroll restoration + `scrollIntoView` work |
| Selected day | state, `?day=` param | `?day=` searchParam | Stable SSR default, deep-linkable |

---

## Verify

```bash
pnpm build   # confirms generateStaticParams prerender + no dynamic errors
pnpm start
# manual: deep-link /session/<id>, bad id → 404, /?t=d1-am auto-scroll, search flows
```

## Done

- [ ] All 6 screens render + match; detail deep-links + 404 behavior correct.
- [ ] Auto-scroll, A–Z, search, Saved grouping verified.

## Refs

- Plan: Layer 1 (screens), Layer 2 (flows), Layer 3 → Routing, Server/Client split; Top risks #4, #7, #8.
- Prototype: `screens.jsx`, `app.jsx` (navigation/stack).

---

**Last Updated**: 2026-06-30
