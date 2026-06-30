'use client';

import { useSyncExternalStore, type ReactNode } from 'react';

// Pre-baked simulated "now" timestamps so time-dependent UI (the live banner,
// session status) can be scrubbed without waiting. Ported from the prototype
// TIME_STATES (app.jsx). Selected via `?t=<key>` (runtime) or
// NEXT_PUBLIC_TIME_STATE (build-time); otherwise the real wall clock is used.
export const TIME_STATES = {
  pre: '2026-06-12T17:00:00+02:00',
  'd1-open': '2026-06-13T09:10:00+02:00',
  'd1-am': '2026-06-13T10:42:00+02:00',
  'd1-lunch': '2026-06-13T12:45:00+02:00',
  'd1-pm': '2026-06-13T14:45:00+02:00',
  d2: '2026-06-14T11:00:00+02:00',
  post: '2026-06-15T10:00:00+02:00',
} as const;

export type TimeStateKey = keyof typeof TIME_STATES;

function isTimeStateKey(key: string | null | undefined): key is TimeStateKey {
  return !!key && key in TIME_STATES;
}

function resolveOverride(): Date | null {
  let key: string | null = null;
  if (typeof window !== 'undefined') {
    key = new URLSearchParams(window.location.search).get('t');
  }
  if (!key) key = process.env.NEXT_PUBLIC_TIME_STATE ?? null;
  return isTimeStateKey(key) ? new Date(TIME_STATES[key]) : null;
}

// Clock as an external store. `now` is null until the first client subscriber,
// so the server snapshot and first client paint agree (no hydration mismatch);
// React reconciles to a real time post-mount. With a `?t=` override the clock is
// advanced rather than frozen, so countdowns still tick while scrubbing.
let now: Date | null = null;
let override: Date | null = null;
let timer: ReturnType<typeof setInterval> | null = null;
const listeners = new Set<() => void>();

function emit(): void {
  listeners.forEach((l) => l());
}

function tick(): void {
  now = override ? new Date(now!.getTime() + 30_000) : new Date();
  emit();
}

function subscribe(callback: () => void): () => void {
  if (listeners.size === 0) {
    override = resolveOverride();
    now = override ?? new Date();
    timer = setInterval(tick, 30_000);
  }
  listeners.add(callback);
  return () => {
    listeners.delete(callback);
    if (listeners.size === 0 && timer !== null) {
      clearInterval(timer);
      timer = null;
    }
  };
}

export function useNow(): Date | null {
  return useSyncExternalStore(
    subscribe,
    () => now,
    () => null,
  );
}

// Boundary marker kept for symmetry with the other providers and to document
// where client time enters the tree; `now` itself is the module store above,
// read via useNow() (no context needed).
export function NowProvider({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
