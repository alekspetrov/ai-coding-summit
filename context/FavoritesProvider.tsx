'use client';

import { createContext, useContext, useMemo, type ReactNode } from 'react';
import { getEventConfig } from '@/lib/config';
import { storageKey } from '@/lib/storage';
import { useLocalList } from '@/hooks/useLocalList';

// Favorited session ids, persisted under the per-brand namespace. Starts empty
// (no seeded favorites — seeds would reintroduce a hydration mismatch).
export interface FavoritesApi {
  ids: readonly string[];
  isFav: (id: string) => boolean;
  toggle: (id: string) => void;
  count: number;
}

const FavoritesContext = createContext<FavoritesApi | null>(null);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const key = storageKey(getEventConfig().brand.id, 'favs');
  const [ids, ops] = useLocalList(key);

  const api = useMemo<FavoritesApi>(
    () => ({
      ids,
      isFav: (id: string) => ids.includes(id),
      toggle: ops.toggle,
      count: ids.length,
    }),
    [ids, ops],
  );

  return <FavoritesContext.Provider value={api}>{children}</FavoritesContext.Provider>;
}

export function useFavorites(): FavoritesApi {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error('useFavorites must be used within a FavoritesProvider');
  return ctx;
}
