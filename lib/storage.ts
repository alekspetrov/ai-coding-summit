// Namespaced, versioned localStorage keys. Per-brand namespace so a fork or a
// re-deploy for a different event never inherits the previous event's saved
// state; the version segment lets us invalidate stored shapes on a breaking
// change. Ported from the prototype's storageKey (app.jsx), plus versioning.
export const STORAGE_NS = 'gn.companion';
export const STORAGE_VERSION = 1;

export type StorageKind = 'favs' | 'recents';

export function storageKey(brandId: string, kind: StorageKind): string {
  return `${STORAGE_NS}.v${STORAGE_VERSION}.${brandId}.${kind}`;
}

// True for any key in our namespace — used to filter cross-tab `storage` events.
export function isCompanionKey(key: string | null): boolean {
  return key === null || key.startsWith(STORAGE_NS);
}
