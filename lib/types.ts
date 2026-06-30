// Minimal structural types for the pure-logic layer (time/banner/schedule/search)
// and its test fixtures. The canonical data contract is the Zod-inferred types
// in lib/schema.ts; those are a strict subset of these (all fields here are
// optional/looser), so schema-derived data is assignable into the logic.
// FOLLOW-UP: unify on lib/schema.ts and make fixtures schema-valid, then delete
// this file (kept now so TASK-03's fixtures/tests stay self-consistent).

export interface Conference {
  name: string;
  edition: string;
  startsAt: string;
  endsAt: string;
  timezone: string;
  venue: { name: string };
}

export interface Day {
  id: string;
  date: string;
  label: string;
  short: string;
}

export interface Track {
  id: string;
  name: string;
  color: string;
}

export interface Room {
  id: string;
  name: string;
  capacity: number;
}

export interface Speaker {
  id: string;
  name: string;
  initials: string;
  tint: string;
  tagline?: string;
  company?: string;
  bio?: string;
  socials?: Record<string, string>;
}

interface BaseSession {
  id: string;
  title: string;
  startsAt: string;
  endsAt: string;
  dayId: string;
  roomId: string;
}

export interface BreakSession extends BaseSession {
  kind: 'break';
  breakType: 'coffee' | 'lunch' | 'social';
}

export interface ContentSession extends BaseSession {
  kind: 'keynote' | 'talk' | 'lightning' | 'workshop';
  trackId?: string;
  speakerIds?: string[];
  abstract?: string;
  level?: 'beginner' | 'intermediate' | 'advanced';
  capacity?: number;
  prerequisites?: string;
  signupUrl?: string;
  media?: Partial<Record<'slidesUrl' | 'videoUrl' | 'repoUrl' | 'demoUrl', string>>;
}

export type Session = BreakSession | ContentSession;

export interface Event {
  CONFERENCE: Conference;
  DAYS: Day[];
  TRACKS: Track[];
  ROOMS: Room[];
  SPEAKERS: Speaker[];
  SESSIONS: Session[];
}
