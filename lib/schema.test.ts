import { describe, expect, it } from 'vitest';
import { ZodError } from 'zod';
import { Event, Session } from './schema';
import reactSummitFixture from '../data/react-summit-amsterdam-2026.json';

describe('Event.parse — full fixture', () => {
  it('parses the React Summit fixture without error', () => {
    const event = Event.parse(reactSummitFixture);
    expect(event.conference.name).toBe('React Summit');
    expect(event.conference.edition).toBe('Amsterdam 2026');
    expect(event.days).toHaveLength(2);
    expect(event.tracks).toHaveLength(6);
    expect(event.rooms).toHaveLength(5);
    expect(event.speakers).toHaveLength(12);
    expect(event.sessions.length).toBeGreaterThan(0);
  });

  it('contains sessions of each kind', () => {
    const event = Event.parse(reactSummitFixture);
    const kinds = new Set(event.sessions.map((s) => s.kind));
    expect(kinds).toContain('keynote');
    expect(kinds).toContain('talk');
    expect(kinds).toContain('lightning');
    expect(kinds).toContain('workshop');
    expect(kinds).toContain('break');
  });
});

describe('Session discriminated union — per-kind fixtures', () => {
  it('accepts kind=keynote', () => {
    const session = Session.parse({
      kind: 'keynote',
      id: 's-test-keynote',
      title: 'Opening Keynote',
      abstract: 'A state-of-the-union for the platform.',
      startsAt: '2026-06-13T09:30:00+02:00',
      endsAt: '2026-06-13T10:15:00+02:00',
      dayId: 'd1',
      roomId: 'r-main',
      trackId: 't-react',
      speakerIds: ['sp-dan'],
    });
    expect(session.kind).toBe('keynote');
    if (session.kind === 'keynote') {
      expect(session.abstract).toBe('A state-of-the-union for the platform.');
    }
  });

  it('accepts kind=talk', () => {
    const session = Session.parse({
      kind: 'talk',
      id: 's-test-talk',
      title: 'Deep Dive: useMemo',
      abstract: 'When to use it and when to delete it.',
      startsAt: '2026-06-13T10:30:00+02:00',
      endsAt: '2026-06-13T11:00:00+02:00',
      dayId: 'd1',
      roomId: 'r-main',
      trackId: 't-react',
      speakerIds: ['sp-una'],
      level: 'intermediate',
    });
    expect(session.kind).toBe('talk');
    if (session.kind === 'talk') {
      expect(session.level).toBe('intermediate');
    }
  });

  it('accepts kind=lightning', () => {
    const session = Session.parse({
      kind: 'lightning',
      id: 's-test-lightning',
      title: 'Five TypeScript Tricks in Five Minutes',
      abstract: 'Rapid-fire TS patterns that ship.',
      startsAt: '2026-06-13T11:30:00+02:00',
      endsAt: '2026-06-13T11:45:00+02:00',
      dayId: 'd1',
      roomId: 'r-side',
      trackId: 't-arch',
      speakerIds: ['sp-jenn'],
    });
    expect(session.kind).toBe('lightning');
  });

  it('accepts kind=workshop', () => {
    const session = Session.parse({
      kind: 'workshop',
      id: 's-test-workshop',
      title: 'Testing Server Components',
      abstract: 'Hands-on testing for the server-component era.',
      startsAt: '2026-06-14T10:00:00+02:00',
      endsAt: '2026-06-14T13:00:00+02:00',
      dayId: 'd2',
      roomId: 'r-lab',
      trackId: 't-react',
      speakerIds: ['sp-kent'],
      capacity: 40,
      prerequisites: 'Familiarity with Vitest.',
      signupUrl: 'https://example.com/signup',
    });
    expect(session.kind).toBe('workshop');
    if (session.kind === 'workshop') {
      expect(session.capacity).toBe(40);
    }
  });

  it('accepts kind=break', () => {
    const session = Session.parse({
      kind: 'break',
      id: 's-test-break',
      title: 'Lunch',
      startsAt: '2026-06-13T12:00:00+02:00',
      endsAt: '2026-06-13T13:30:00+02:00',
      dayId: 'd1',
      roomId: 'r-foyer',
      breakType: 'lunch',
    });
    expect(session.kind).toBe('break');
    if (session.kind === 'break') {
      expect(session.breakType).toBe('lunch');
    }
  });

  it('rejects an unknown kind', () => {
    expect(() =>
      Session.parse({
        kind: 'panel',
        id: 's-test-bad',
        title: 'Mystery Session',
      })
    ).toThrow(ZodError);
  });
});

describe('Corrupt fixture rejection with path error', () => {
  it('throws ZodError identifying missing conference.name', () => {
    let caught: unknown;
    try {
      Event.parse({
        conference: {
          edition: 'Amsterdam 2026',
          startsAt: '2026-06-13T09:00:00+02:00',
          endsAt: '2026-06-14T18:00:00+02:00',
          timezone: 'Europe/Amsterdam',
          venue: { name: 'Theater Amsterdam' },
        },
        days: [],
        tracks: [],
        rooms: [],
        speakers: [],
        sessions: [],
      });
    } catch (e) {
      caught = e;
    }
    expect(caught).toBeInstanceOf(ZodError);
    const err = caught as ZodError;
    const paths = err.issues.map((i) => i.path.join('.'));
    expect(paths.some((p) => p.includes('name'))).toBe(true);
  });

  it('throws ZodError with sessions path on invalid session kind', () => {
    let caught: unknown;
    try {
      Event.parse({
        conference: {
          name: 'Test Conf',
          edition: '2026',
          startsAt: '2026-06-13T09:00:00+02:00',
          endsAt: '2026-06-14T18:00:00+02:00',
          timezone: 'Europe/Amsterdam',
          venue: { name: 'Test Venue' },
        },
        days: [],
        tracks: [],
        rooms: [],
        speakers: [],
        sessions: [
          { kind: 'panel', id: 's-bad', title: 'Bad Session' },
        ],
      });
    } catch (e) {
      caught = e;
    }
    expect(caught).toBeInstanceOf(ZodError);
    const err = caught as ZodError;
    const hasSessionsPath = err.issues.some((i) =>
      i.path.some((p) => p === 'sessions' || p === 0 || p === 'kind')
    );
    expect(hasSessionsPath).toBe(true);
  });
});

describe('Europe/Amsterdam offset check', () => {
  it('accepts datetimes with +02:00 offset (Amsterdam CEST)', () => {
    const session = Session.parse({
      kind: 'break',
      id: 's-tz-cest',
      title: 'CEST timezone test',
      startsAt: '2026-06-13T09:00:00+02:00',
      endsAt: '2026-06-13T09:30:00+02:00',
      dayId: 'd1',
      roomId: 'r-foyer',
      breakType: 'coffee',
    });
    expect(session.startsAt).toContain('+02:00');
    expect(session.endsAt).toContain('+02:00');
  });

  it('accepts datetimes with +01:00 offset (Amsterdam CET, winter events)', () => {
    const session = Session.parse({
      kind: 'break',
      id: 's-tz-cet',
      title: 'CET timezone test',
      startsAt: '2026-10-08T09:00:00+02:00',
      endsAt: '2026-10-08T09:30:00+02:00',
      dayId: 'd1',
      roomId: 'r-foyer',
      breakType: 'coffee',
    });
    expect(session.startsAt).toContain('+02:00');
  });

  it('rejects datetime without timezone indicator', () => {
    expect(() =>
      Session.parse({
        kind: 'break',
        id: 's-tz-bad',
        title: 'No offset',
        startsAt: '2026-06-13T09:00:00',
        endsAt: '2026-06-13T09:30:00',
        dayId: 'd1',
        roomId: 'r-foyer',
        breakType: 'coffee',
      })
    ).toThrow(ZodError);
  });

  it('all React Summit sessions use Europe/Amsterdam offset (+02:00)', () => {
    const event = Event.parse(reactSummitFixture);
    for (const session of event.sessions) {
      expect(session.startsAt).toMatch(/\+02:00$/);
      expect(session.endsAt).toMatch(/\+02:00$/);
    }
  });
});
