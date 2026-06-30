'use client';

import { createContext, useContext, useMemo, type ReactNode } from 'react';
import { getEventConfig } from '@/lib/config';
import { storageKey } from '@/lib/storage';
import { useLocalList } from '@/hooks/useLocalList';

// Recent search queries, most-recent-first, capped. Persisted per-brand. Starts
// empty (no seeds — see FavoritesProvider).
const MAX_RECENTS = 8;

export interface RecentsApi {
  queries: readonly string[];
  push: (query: string) => void;
  clear: () => void;
}

const RecentsContext = createContext<RecentsApi | null>(null);

export function RecentsProvider({ children }: { children: ReactNode }) {
  const key = storageKey(getEventConfig().brand.id, 'recents');
  const [queries, ops] = useLocalList(key);

  const api = useMemo<RecentsApi>(
    () => ({
      queries,
      push: (query: string) => {
        const q = query.trim();
        if (!q) return;
        ops.set([q, ...queries.filter((x) => x !== q)].slice(0, MAX_RECENTS));
      },
      clear: ops.clear,
    }),
    [queries, ops],
  );

  return <RecentsContext.Provider value={api}>{children}</RecentsContext.Provider>;
}

export function useRecents(): RecentsApi {
  const ctx = useContext(RecentsContext);
  if (!ctx) throw new Error('useRecents must be used within a RecentsProvider');
  return ctx;
}
