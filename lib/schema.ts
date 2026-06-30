import { z } from 'zod';

const ISODatetime = z.iso.datetime({ offset: true });

const Media = z.object({
  slidesUrl: z.string().optional(),
  videoUrl: z.string().optional(),
  repoUrl: z.string().optional(),
  demoUrl: z.string().optional(),
}).optional();

const Level = z.enum(['beginner', 'intermediate', 'advanced']).optional();

export const Conference = z.object({
  name: z.string(),
  edition: z.string(),
  startsAt: ISODatetime,
  endsAt: ISODatetime,
  timezone: z.string(),
  venue: z.object({ name: z.string() }),
});

export const Day = z.object({
  id: z.string(),
  date: z.string(),
  label: z.string(),
  short: z.string(),
});

export const Track = z.object({
  id: z.string(),
  name: z.string(),
  color: z.string(),
});

export const Room = z.object({
  id: z.string(),
  name: z.string(),
  capacity: z.number().int().nonnegative(),
});

export const Speaker = z.object({
  id: z.string(),
  name: z.string(),
  company: z.string(),
  tagline: z.string(),
  bio: z.string(),
  initials: z.string(),
  tint: z.string(),
  socials: z.object({
    twitter: z.string().optional(),
    github: z.string().optional(),
    mastodon: z.string().optional(),
    bluesky: z.string().optional(),
    linkedin: z.string().optional(),
    website: z.string().optional(),
  }).optional(),
});

const BaseSession = z.object({
  id: z.string(),
  title: z.string(),
  startsAt: ISODatetime,
  endsAt: ISODatetime,
  dayId: z.string(),
  roomId: z.string(),
});

const ContentBase = BaseSession.extend({
  abstract: z.string(),
  trackId: z.string(),
  speakerIds: z.array(z.string()),
  level: Level,
  media: Media,
});

const KeynoteSession = ContentBase.extend({ kind: z.literal('keynote') });
const TalkSession = ContentBase.extend({ kind: z.literal('talk') });
const LightningSession = ContentBase.extend({ kind: z.literal('lightning') });

const WorkshopSession = ContentBase.extend({
  kind: z.literal('workshop'),
  capacity: z.number().int().positive(),
  prerequisites: z.string(),
  signupUrl: z.string(),
});

const BreakSession = BaseSession.extend({
  kind: z.literal('break'),
  breakType: z.enum(['coffee', 'lunch', 'social']),
});

export const Session = z.discriminatedUnion('kind', [
  KeynoteSession,
  TalkSession,
  LightningSession,
  WorkshopSession,
  BreakSession,
]);

export const Event = z.object({
  conference: Conference,
  days: z.array(Day),
  tracks: z.array(Track),
  rooms: z.array(Room),
  speakers: z.array(Speaker),
  sessions: z.array(Session),
});

export type Conference = z.infer<typeof Conference>;
export type Day = z.infer<typeof Day>;
export type Track = z.infer<typeof Track>;
export type Room = z.infer<typeof Room>;
export type Speaker = z.infer<typeof Speaker>;
export type Session = z.infer<typeof Session>;
export type Event = z.infer<typeof Event>;
