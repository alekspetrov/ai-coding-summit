'use client';

import { useCallback, useSyncExternalStore } from 'react';
import { isCompanionKey } from '@/lib/storage';

// A list of ids (favorites, recents) persisted to localStorage and shared across
// the app via useSyncExternalStore. The server snapshot is a stable empty array,
// so the first client render matches SSR (no hydration mismatch); React then
// reconciles to the real stored value after mount. Cross-tab updates arrive via
// the `storage` event; same-tab updates via an in-process listener set.

const EMPTY: readonly string[] = Object.freeze([]);

// Cache parsed values per key so getSnapshot returns a stable reference until the
// underlying raw string changes (required by useSyncExternalStore).
const cache = new Map<string, { raw: string | null; value: readonly string[] }>();
const listeners = new Set<() => void>();

function read(key: string): readonly string[] {
  if (typeof window === 'undefined') return EMPTY;
  let raw: string | null = null;
  try {
    raw = window.localStorage.getItem(key);
  } catch {
    raw = null;
  }
  const cached = cache.get(key);
  if (cached && cached.raw === raw) return cached.value;

  let value: readonly string[] = EMPTY;
  if (raw) {
    try {
      const parsed: unknown = JSON.parse(raw);
      if (Array.isArray(parsed)) value = parsed.filter((x): x is string => typeof x === 'string');
    } catch {
      value = EMPTY;
    }
  }
  cache.set(key, { raw, value });
  return value;
}

function write(key: string, next: readonly string[]): void {
  if (typeof window === 'undefined') return;
  const raw = JSON.stringify(next);
  try {
    window.localStorage.setItem(key, raw);
  } catch {
    // ignore (private mode / quota) — in-memory cache still updates so the UI reacts
  }
  cache.set(key, { raw, value: next });
  listeners.forEach((l) => l());
}

function subscribe(callback: () => void): () => void {
  listeners.add(callback);
  const onStorage = (e: StorageEvent) => {
    if (isCompanionKey(e.key)) callback();
  };
  window.addEventListener('storage', onStorage);
  return () => {
    listeners.delete(callback);
    window.removeEventListener('storage', onStorage);
  };
}

export interface LocalListOps {
  toggle: (id: string) => void;
  set: (ids: readonly string[]) => void;
  clear: () => void;
}

export function useLocalList(key: string): [readonly string[], LocalListOps] {
  const value = useSyncExternalStore(
    subscribe,
    () => read(key),
    () => EMPTY,
  );

  const set = useCallback((ids: readonly string[]) => write(key, ids), [key]);
  const toggle = useCallback(
    (id: string) => {
      const cur = read(key);
      write(key, cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id]);
    },
    [key],
  );
  const clear = useCallback(() => write(key, EMPTY), [key]);

  return [value, { toggle, set, clear }];
}
