import type { Session, Speaker, Track } from './types';

export interface SearchResults {
  sessions: Session[];
  speakers: Speaker[];
  tracks: Track[];
}

interface SearchableEvent {
  SESSIONS: Session[];
  SPEAKERS: Speaker[];
  TRACKS: Track[];
}

// Returns null for empty/whitespace query. Breaks are excluded from sessions.
// Case-insensitive substring match on title / name / tagline / company / track name.
export function searchEvent(event: SearchableEvent, query: string): SearchResults | null {
  const q = query.trim().toLowerCase();
  if (!q) return null;

  return {
    sessions: event.SESSIONS.filter(
      s => s.kind !== 'break' && s.title.toLowerCase().includes(q),
    ),
    speakers: event.SPEAKERS.filter(
      sp =>
        sp.name.toLowerCase().includes(q) ||
        (sp.tagline ?? '').toLowerCase().includes(q) ||
        (sp.company ?? '').toLowerCase().includes(q),
    ),
    tracks: event.TRACKS.filter(tr => tr.name.toLowerCase().includes(q)),
  };
}
