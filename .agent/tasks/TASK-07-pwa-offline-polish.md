# TASK-07: PWA + Offline + Polish

**Status**: 📋 Planned
**Created**: 2026-06-30
**Assignee**: Manual

---

## Context

**Problem**: The product promise is "works on the venue's three-bar 3G / survives the venue WiFi
closing." We need installability + offline, plus final a11y/perf polish.

**Goal**: Installable PWA that works offline after one load; a11y and `backdrop-filter` perf
hardened; Lighthouse green on mobile.

---

## Acceptance Criteria

- [ ] Installable (manifest + icons + theme color); after one online load, schedule/saved/cached-detail work offline on Slow-3G.
- [ ] Service worker SWR for HTML/RSC, precache shell + all prerendered routes; never cache-first `?_rsc=`; cache-bust per deploy + "update available" toast.
- [ ] A11y: route-change focus, `prefers-reduced-motion`, link/button semantics, real social URLs, ≥44px hit areas.
- [ ] `backdrop-filter` gated behind `@supports` with solid fallback; profiled on low-end Android.
- [ ] Lighthouse PWA installable + mobile perf green; no console errors.

---

## Implementation

### Phase 1: PWA
- [ ] `@serwist/next`, `app/sw.ts`, `app/manifest.ts`, `public/icons/*`, `next.config.ts` Serwist wrap.

### Phase 2: Polish
- [ ] A11y sweep (focus, reduced-motion, semantics, social links, hit areas).
- [ ] `backdrop-filter` `@supports` fallback; perf profiling; visual regression across screens × light/dark.

**Files**: `app/{manifest.ts,sw.ts}`, `public/icons/*`, `next.config.ts`, `app/icon.tsx` (optional).

---

## Out of Scope

- Backend/API; multi-event-per-origin.

---

## Technical Decisions

| Decision | Options | Chosen | Reasoning |
|---|---|---|---|
| SW tooling | next-pwa, @serwist/next, hand-rolled | `@serwist/next` | Maintained, App-Router friendly |
| HTML/RSC caching | cache-first, SWR | SWR (never cache-first RSC) | Avoids stale-after-deploy payload bug |

---

## Verify

```bash
pnpm build && pnpm start
# DevTools: install PWA; throttle Slow 3G; reload offline; Lighthouse (PWA + perf)
```

## Done

- [ ] Offline reload works; installable; Lighthouse green; console clean.

## Refs

- Plan: Layer 3 → PWA/offline, A11y; Top risks #3, #9, #10.

---

**Last Updated**: 2026-06-30
