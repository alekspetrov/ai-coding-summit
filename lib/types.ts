// Minimal types for pure-logic functions.
// TASK-02 will replace these with Zod-inferred equivalents.

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
