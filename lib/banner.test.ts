import { describe, it, expect } from 'vitest';
import { computeBanner } from './banner';
import { CONFERENCE, SESSIONS, TIME_STATES } from './fixtures/time-states';

// Convenience: run computeBanner with the full prototype session list.
const banner = (now: string) => computeBanner(SESSIONS, now, CONFERENCE);

describe('computeBanner — all 7 TIME_STATES', () => {
  it('pre: hidden before conference starts', () => {
    const result = banner(TIME_STATES.pre.now);
    expect(result.state).toBe('hidden');
  });

  it('d1-open: upcoming — keynote starts in ~20 min', () => {
    // 09:10; keynote at 09:30 (20 min away). Registration break is live but breaks are skipped.
    const result = banner(TIME_STATES['d1-open'].now);
    expect(result.state).toBe('upcoming');
    if (result.state === 'upcoming') {
      expect(result.session.id).toBe('s-d1-1');
    }
  });

  it('d1-am: live — CSS talk and Edge talk are running at 10:42', () => {
    // 10:42 is within 10:30–11:00 for two parallel talks.
    const result = banner(TIME_STATES['d1-am'].now);
    expect(result.state).toBe('live');
    if (result.state === 'live') {
      // First matching non-break session in array order
      expect(['s-d1-2', 's-d1-3']).toContain(result.session.id);
    }
  });

  it('d1-lunch: upcoming — cross-framework keynote starts in 45 min', () => {
    // 12:45; lunch break is live, next non-break is keynote at 13:30 (45 min).
    const result = banner(TIME_STATES['d1-lunch'].now);
    expect(result.state).toBe('upcoming');
    if (result.state === 'upcoming') {
      expect(result.session.id).toBe('s-d1-7');
    }
  });

  it('d1-pm: live — two talks running at 14:45', () => {
    const result = banner(TIME_STATES['d1-pm'].now);
    expect(result.state).toBe('live');
    if (result.state === 'live') {
      expect(['s-d1-8', 's-d1-9']).toContain(result.session.id);
    }
  });

  it('d2: live — workshops running at 11:00', () => {
    const result = banner(TIME_STATES.d2.now);
    expect(result.state).toBe('live');
    if (result.state === 'live') {
      expect(['s-d2-1', 's-d2-2']).toContain(result.session.id);
    }
  });

  it('post: hidden after conference ends', () => {
    const result = banner(TIME_STATES.post.now);
    expect(result.state).toBe('hidden');
  });
});

describe('computeBanner — boundary conditions', () => {
  it('hidden exactly at conference startsAt when no session is live', () => {
    // Conference starts at 09:00 but first session (registration break) starts at 08:30.
    // At 09:00 the registration break is live (kind=break → skip). Keynote is at 09:30.
    // 09:00 is within conference hours; next non-break is 30 min away.
    const result = banner(CONFERENCE.startsAt);
    expect(result.state).toBe('upcoming');
  });

  it('hidden after conference endsAt', () => {
    const result = banner(CONFERENCE.endsAt);
    // At exactly endsAt (18:00) tNow === tEnd, condition is tNow > tEnd = false.
    // 18:00 — no live content sessions, no upcoming non-break sessions on that day.
    // The last workshop ends at 17:00; 18:00 is past everything.
    expect(result.state).toBe('hidden');
  });

  it('hides upcoming session more than 360 minutes away', () => {
    // Put "now" just after conference start with a session 361 minutes away.
    const conf = {
      startsAt: '2026-06-13T00:00:00+02:00',
      endsAt:   '2026-06-13T23:59:00+02:00',
    };
    const sessions = [
      { kind: 'talk' as const, id: 'far', title: 'Far Away',
        startsAt: '2026-06-13T06:02:00+02:00', endsAt: '2026-06-13T07:00:00+02:00',
        dayId: 'd1', roomId: 'r-main', trackId: 't-react', abstract: '', speakerIds: [] },
    ];
    // now = 00:01, session starts at 06:02 → 361 minutes away → hidden
    const result = computeBanner(sessions, '2026-06-13T00:01:00+02:00', conf);
    expect(result.state).toBe('hidden');
  });

  it('shows upcoming session exactly 360 minutes away', () => {
    const conf = {
      startsAt: '2026-06-13T00:00:00+02:00',
      endsAt:   '2026-06-13T23:59:00+02:00',
    };
    const sessions = [
      { kind: 'talk' as const, id: 'near', title: 'Near',
        startsAt: '2026-06-13T06:00:00+02:00', endsAt: '2026-06-13T07:00:00+02:00',
        dayId: 'd1', roomId: 'r-main', trackId: 't-react', abstract: '', speakerIds: [] },
    ];
    // now = 00:00, session starts at 06:00 → exactly 360 min → upcoming
    const result = computeBanner(sessions, '2026-06-13T00:00:00+02:00', conf);
    expect(result.state).toBe('upcoming');
  });

  it('skips breaks when finding live session', () => {
    const conf = { startsAt: '2026-06-13T08:00:00+02:00', endsAt: '2026-06-13T18:00:00+02:00' };
    const sessions = [
      { kind: 'break' as const, id: 'brk', title: 'Coffee',
        startsAt: '2026-06-13T09:00:00+02:00', endsAt: '2026-06-13T10:00:00+02:00',
        dayId: 'd1', roomId: 'r-foyer', breakType: 'coffee' as const },
      { kind: 'talk' as const, id: 'tlk', title: 'A Talk',
        startsAt: '2026-06-13T10:00:00+02:00', endsAt: '2026-06-13T11:00:00+02:00',
        dayId: 'd1', roomId: 'r-main', trackId: 't-react', abstract: '', speakerIds: [] },
    ];
    // During the coffee break, banner should show upcoming talk, not live break
    const result = computeBanner(sessions, '2026-06-13T09:30:00+02:00', conf);
    expect(result.state).toBe('upcoming');
    if (result.state === 'upcoming') {
      expect(result.session.id).toBe('tlk');
    }
  });

  it('returns hidden when no sessions exist within conference hours', () => {
    const conf = { startsAt: '2026-06-13T09:00:00+02:00', endsAt: '2026-06-13T18:00:00+02:00' };
    const result = computeBanner([], '2026-06-13T10:00:00+02:00', conf);
    expect(result.state).toBe('hidden');
  });
});
