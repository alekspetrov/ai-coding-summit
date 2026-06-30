import type { Event, Session, Speaker, Track } from '@/lib/schema';

export interface SearchResults {
  sessions: Session[];
  speakers: Speaker[];
  tracks: Track[];
}

// Accepts the real event shape (lowercase keys), so `searchEvent(getEvent(), q)`
// works directly.
export type SearchableEvent = Pick<Event, 'sessions' | 'speakers' | 'tracks'>;

// Returns null for empty/whitespace query. Breaks are excluded from sessions.
// Case-insensitive substring match on title / name / tagline / company / track name.
export function searchEvent(event: SearchableEvent, query: string): SearchResults | null {
  const q = query.trim().toLowerCase();
  if (!q) return null;

  return {
    sessions: event.sessions.filter(
      (s) => s.kind !== 'break' && s.title.toLowerCase().includes(q),
    ),
    speakers: event.speakers.filter(
      (sp) =>
        sp.name.toLowerCase().includes(q) ||
        sp.tagline.toLowerCase().includes(q) ||
        sp.company.toLowerCase().includes(q),
    ),
    tracks: event.tracks.filter((tr) => tr.name.toLowerCase().includes(q)),
  };
}
