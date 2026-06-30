# TASK-01: Scaffold + Theming Foundation

**Status**: 🚧 In Progress
**Created**: 2026-06-30
**Assignee**: Manual

---

## Context

**Problem**: Greenfield repo with no app code. We need a Next.js foundation and the
theming system that every screen depends on, reproducing the prototype's light/dark
token sets and per-brand CSS variables with **no theme flash**.

**Goal**: Bootable Next.js (App Router) + TS strict + Tailwind v4 + Vitest/RTL app whose
`<html>` carries the correct `data-theme`/`data-brand` and brand CSS vars from the server.

---

## Acceptance Criteria

- [ ] `pnpm dev` boots; `/` renders using theme tokens.
- [ ] `<html>` has `data-theme`, `data-brand`, and inline `--brand*` vars in the first byte (no flash).
- [ ] `hexA` and `brandVars` unit tests pass (light → accentLight, dark → accentDark).
- [ ] `pnpm tsc --noEmit` clean; `pnpm test` green.

---

## Implementation

### Phase 1: Toolchain
**Tasks**:
- [ ] `package.json` (Next 16, React 19, TS 6, Tailwind v4, Zod 4, Vitest 4, RTL, server-only).
- [ ] `tsconfig.json` (strict, `noUncheckedIndexedAccess`, `verbatimModuleSyntax`, `@/*` → `./*`).
- [ ] `next.config.ts`, `postcss.config.mjs` (`@tailwindcss/postcss`), `eslint.config.mjs` (flat, next).
- [ ] `vitest.config.ts` (jsdom, `@` alias) + `vitest.setup.ts` (jest-dom).

### Phase 2: Theming
**Tasks**:
- [ ] `app/theme.css` — light/dark token vars under `[data-theme]`, `@theme inline` color aliases, `liveBeacon` keyframe, `prefers-reduced-motion`.
- [ ] `lib/brands.ts` (BRANDS record + types), `lib/color.ts` (`hexA`, `brandVars`), `lib/config.ts` (`getEventConfig` from `NEXT_PUBLIC_EVENT`).
- [ ] `app/layout.tsx` (root: `data-*` + brand vars + metadata/viewport `viewport-fit=cover`), `app/(tabs)/layout.tsx`, `app/(tabs)/page.tsx` placeholder.

**Files**: `package.json`, `tsconfig.json`, `next.config.ts`, `postcss.config.mjs`, `eslint.config.mjs`, `vitest.config.ts`, `vitest.setup.ts`, `app/theme.css`, `app/layout.tsx`, `app/(tabs)/{layout,page}.tsx`, `lib/{brands,color,config}.ts`, `lib/color.test.ts`.

---

## Out of Scope

- Real screens, components, data loading (TASK-02/04/06).
- PWA/service worker (TASK-07).
- `prefers-color-scheme` auto-dark + manual toggle (event has a fixed default theme for now).

---

## Technical Decisions

| Decision | Options | Chosen | Reasoning |
|---|---|---|---|
| Styling | CSS Modules, Tailwind+arbitrary, Tailwind+CSS vars | Tailwind v4 + CSS-var tokens | Pixel fidelity + Navigator default + flash-free dark/brand |
| Theme mechanism | JS `themeVars` prop-drill, CSS vars on `<html>` | CSS vars keyed by `data-theme`/`data-brand` | No flash, no `dark` prop-drilling |
| Versions | Next 15 / Next 16 | Next 16 + React 19 + TS 6 | Latest coherent set |

---

## Verify

```bash
pnpm install
pnpm typecheck
pnpm test
pnpm build   # static prerender sanity
```

## Done

- [ ] `lib/color.ts` exports `hexA`, `brandVars`; tests pass.
- [ ] App boots and renders `confEdition` with token colors.
- [ ] `tsc --noEmit` + build succeed.

## Refs

- Plan: `~/.claude/plans/research-this-with-a-playful-newell.md` (Layer 3 → Theming, Styling)
- Prototype: `app.jsx` (BRANDS, brandVars), `components.jsx` (themeVars)

---

**Last Updated**: 2026-06-30
