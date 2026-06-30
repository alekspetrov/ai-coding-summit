// Fixtures derived from the prototype (app.jsx TIME_STATES + data.js).
// Used by colocated *.test.ts files.
import type { Conference, Session, Speaker, Track } from '../types';

export const TIME_STATES = {
  pre:      { label: 'Pre-event',    now: '2026-06-12T17:00:00+02:00' },
  'd1-open':{ label: 'D1 · opening', now: '2026-06-13T09:10:00+02:00' },
  'd1-am':  { label: 'D1 · 10:40',   now: '2026-06-13T10:42:00+02:00' },
  'd1-lunch':{ label: 'D1 · lunch',  now: '2026-06-13T12:45:00+02:00' },
  'd1-pm':  { label: 'D1 · 14:45',   now: '2026-06-13T14:45:00+02:00' },
  d2:       { label: 'D2 · 11:00',   now: '2026-06-14T11:00:00+02:00' },
  post:     { label: 'After event',   now: '2026-06-15T10:00:00+02:00' },
} as const;

export const CONFERENCE: Conference = {
  name: 'React Summit',
  edition: 'Amsterdam 2026',
  startsAt: '2026-06-13T09:00:00+02:00',
  endsAt: '2026-06-14T18:00:00+02:00',
  timezone: 'Europe/Amsterdam',
  venue: { name: 'Theater Amsterdam' },
};

export const TRACKS: Track[] = [
  { id: 't-react', name: 'React Core',     color: '#61DAFB' },
  { id: 't-perf',  name: 'Performance',    color: '#F59E0B' },
  { id: 't-ai',    name: 'AI & Tooling',   color: '#A78BFA' },
  { id: 't-arch',  name: 'Architecture',   color: '#22C55E' },
  { id: 't-edge',  name: 'Edge & Runtime', color: '#F472B6' },
  { id: 't-state', name: 'State & Data',   color: '#38BDF8' },
];

export const SPEAKERS: Speaker[] = [
  { id: 'sp-dan',  name: 'Dan Abramov',   initials: 'DA', tint: '#61DAFB',
    company: 'Bluesky',    tagline: 'React core, now on Bluesky' },
  { id: 'sp-una',  name: 'Una Kravets',   initials: 'UK', tint: '#F472B6',
    company: 'Google',     tagline: 'CSS at Google' },
  { id: 'sp-rich', name: 'Rich Harris',   initials: 'RH', tint: '#FF3E00',
    company: 'Vercel',     tagline: 'Svelte creator' },
  { id: 'sp-sara', name: 'Sara Vieira',   initials: 'SV', tint: '#22C55E',
    company: 'Remix',      tagline: 'DX, GraphQL, opinions' },
  { id: 'sp-evan', name: 'Evan Bacon',    initials: 'EB', tint: '#000020',
    company: 'Expo',       tagline: 'React Native Web, Expo Router' },
  { id: 'sp-anjana',name:'Anjana Vakil',  initials: 'AV', tint: '#A78BFA',
    company: 'Mozilla',    tagline: 'JS, functional everything' },
  { id: 'sp-jenn', name: 'Jenn Creighton',initials: 'JC', tint: '#F59E0B',
    company: 'Watchful',   tagline: 'Frontend at scale' },
  { id: 'sp-kent', name: 'Kent C. Dodds', initials: 'KD', tint: '#38BDF8',
    company: 'Epic Web',   tagline: 'Testing, education' },
  { id: 'sp-tanya',name: 'Tanya Reilly',  initials: 'TR', tint: '#22C55E',
    company: 'Squarespace',tagline: 'Staff+ engineering' },
  { id: 'sp-fred', name: 'Fred K. Schott',initials: 'FS', tint: '#FF5D01',
    company: 'Astro',      tagline: 'Astro co-creator' },
  { id: 'sp-shru', name: 'Shruti Kapoor', initials: 'SK', tint: '#A78BFA',
    company: 'PayPal',     tagline: 'JS, accessibility' },
  { id: 'sp-theo', name: 'Theo Browne',   initials: 'TB', tint: '#F472B6',
    company: 'Ping Labs',  tagline: 'create-t3-app' },
];

export const SESSIONS: Session[] = [
  // ── Day 1 ────────────────────────────────────────────────────────────────
  { kind: 'break',   id: 's-d1-reg',  title: 'Registration & Coffee',
    startsAt: '2026-06-13T08:30:00+02:00', endsAt: '2026-06-13T09:30:00+02:00',
    dayId: 'd1', roomId: 'r-foyer', breakType: 'coffee' },

  { kind: 'keynote', id: 's-d1-1',   title: 'The Road Ahead for React',
    startsAt: '2026-06-13T09:30:00+02:00', endsAt: '2026-06-13T10:15:00+02:00',
    dayId: 'd1', roomId: 'r-main', trackId: 't-react', speakerIds: ['sp-dan'] },

  { kind: 'talk',    id: 's-d1-2',   title: "CSS You Didn't Know You Had",
    startsAt: '2026-06-13T10:30:00+02:00', endsAt: '2026-06-13T11:00:00+02:00',
    dayId: 'd1', roomId: 'r-main', trackId: 't-react', speakerIds: ['sp-una'] },

  { kind: 'talk',    id: 's-d1-3',   title: 'Edge Functions Without the Footguns',
    startsAt: '2026-06-13T10:30:00+02:00', endsAt: '2026-06-13T11:00:00+02:00',
    dayId: 'd1', roomId: 'r-side', trackId: 't-edge', speakerIds: ['sp-fred'] },

  { kind: 'break',   id: 's-d1-c1',  title: 'Coffee Break',
    startsAt: '2026-06-13T11:00:00+02:00', endsAt: '2026-06-13T11:30:00+02:00',
    dayId: 'd1', roomId: 'r-foyer', breakType: 'coffee' },

  { kind: 'talk',    id: 's-d1-4',   title: 'Forms, Finally',
    startsAt: '2026-06-13T11:30:00+02:00', endsAt: '2026-06-13T12:00:00+02:00',
    dayId: 'd1', roomId: 'r-main', trackId: 't-react', speakerIds: ['sp-sara'] },

  { kind: 'lightning',id:'s-d1-5',   title: 'Three React Patterns I Regret',
    startsAt: '2026-06-13T11:30:00+02:00', endsAt: '2026-06-13T11:45:00+02:00',
    dayId: 'd1', roomId: 'r-side', trackId: 't-arch', speakerIds: ['sp-jenn'] },

  { kind: 'lightning',id:'s-d1-6',   title: 'tRPC in 2026',
    startsAt: '2026-06-13T11:45:00+02:00', endsAt: '2026-06-13T12:00:00+02:00',
    dayId: 'd1', roomId: 'r-side', trackId: 't-state', speakerIds: ['sp-theo'] },

  { kind: 'break',   id: 's-d1-l1',  title: 'Lunch',
    startsAt: '2026-06-13T12:00:00+02:00', endsAt: '2026-06-13T13:30:00+02:00',
    dayId: 'd1', roomId: 'r-foyer', breakType: 'lunch' },

  { kind: 'keynote', id: 's-d1-7',   title: 'The Cross-Framework Future',
    startsAt: '2026-06-13T13:30:00+02:00', endsAt: '2026-06-13T14:15:00+02:00',
    dayId: 'd1', roomId: 'r-main', trackId: 't-arch', speakerIds: ['sp-rich'] },

  { kind: 'talk',    id: 's-d1-8',   title: 'Compiler-Era Performance',
    startsAt: '2026-06-13T14:30:00+02:00', endsAt: '2026-06-13T15:00:00+02:00',
    dayId: 'd1', roomId: 'r-main', trackId: 't-perf', speakerIds: ['sp-jenn'] },

  { kind: 'talk',    id: 's-d1-9',   title: 'Testing the Server-Component Era',
    startsAt: '2026-06-13T14:30:00+02:00', endsAt: '2026-06-13T15:00:00+02:00',
    dayId: 'd1', roomId: 'r-side', trackId: 't-react', speakerIds: ['sp-kent'] },

  { kind: 'break',   id: 's-d1-c2',  title: 'Afternoon Coffee',
    startsAt: '2026-06-13T15:00:00+02:00', endsAt: '2026-06-13T15:30:00+02:00',
    dayId: 'd1', roomId: 'r-foyer', breakType: 'coffee' },

  { kind: 'talk',    id: 's-d1-10',  title: 'AI Codegen, Honestly',
    startsAt: '2026-06-13T15:30:00+02:00', endsAt: '2026-06-13T16:00:00+02:00',
    dayId: 'd1', roomId: 'r-main', trackId: 't-ai', speakerIds: ['sp-shru'] },

  { kind: 'talk',    id: 's-d1-11',  title: 'A Functional Defense of useReducer',
    startsAt: '2026-06-13T15:30:00+02:00', endsAt: '2026-06-13T16:00:00+02:00',
    dayId: 'd1', roomId: 'r-side', trackId: 't-state', speakerIds: ['sp-anjana'] },

  { kind: 'keynote', id: 's-d1-12',  title: 'Staff Engineering, Five Years In',
    startsAt: '2026-06-13T16:15:00+02:00', endsAt: '2026-06-13T17:00:00+02:00',
    dayId: 'd1', roomId: 'r-main', trackId: 't-arch', speakerIds: ['sp-tanya'] },

  { kind: 'break',   id: 's-d1-party',title: 'Closing Drinks',
    startsAt: '2026-06-13T17:00:00+02:00', endsAt: '2026-06-13T19:00:00+02:00',
    dayId: 'd1', roomId: 'r-foyer', breakType: 'social' },

  // ── Day 2 — Workshops ──────────────────────────────────────────────────
  { kind: 'break',   id: 's-d2-reg', title: 'Check-in & Coffee',
    startsAt: '2026-06-14T09:00:00+02:00', endsAt: '2026-06-14T10:00:00+02:00',
    dayId: 'd2', roomId: 'r-foyer', breakType: 'coffee' },

  { kind: 'workshop',id:'s-d2-1',    title: 'Building Cross-Framework Components',
    startsAt: '2026-06-14T10:00:00+02:00', endsAt: '2026-06-14T13:00:00+02:00',
    dayId: 'd2', roomId: 'r-lab', trackId: 't-arch', speakerIds: ['sp-rich'], capacity: 40,
    signupUrl: '#' },

  { kind: 'workshop',id:'s-d2-2',    title: 'Universal React Native with Expo Router',
    startsAt: '2026-06-14T10:00:00+02:00', endsAt: '2026-06-14T13:00:00+02:00',
    dayId: 'd2', roomId: 'r-lab2', trackId: 't-react', speakerIds: ['sp-evan'], capacity: 35,
    signupUrl: '#' },

  { kind: 'break',   id: 's-d2-l1',  title: 'Lunch',
    startsAt: '2026-06-14T13:00:00+02:00', endsAt: '2026-06-14T14:00:00+02:00',
    dayId: 'd2', roomId: 'r-foyer', breakType: 'lunch' },

  { kind: 'workshop',id:'s-d2-3',    title: 'Testing Server Components, End to End',
    startsAt: '2026-06-14T14:00:00+02:00', endsAt: '2026-06-14T17:00:00+02:00',
    dayId: 'd2', roomId: 'r-lab', trackId: 't-react', speakerIds: ['sp-kent'], capacity: 40,
    signupUrl: '#' },

  { kind: 'workshop',id:'s-d2-4',    title: 'Real AI Tooling for Real Codebases',
    startsAt: '2026-06-14T14:00:00+02:00', endsAt: '2026-06-14T17:00:00+02:00',
    dayId: 'd2', roomId: 'r-lab2', trackId: 't-ai', speakerIds: ['sp-shru','sp-theo'], capacity: 35,
    signupUrl: '#' },
];
