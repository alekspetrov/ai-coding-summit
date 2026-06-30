import { describe, it, expect } from 'vitest';
import { TZ, parseISO, fmtTime, fmtRange, fmtDayLong, diffMin, sessionStatus } from './time';

// These tests must pass under TZ=America/New_York (UTC-4 in summer).
// All formatting uses timeZone: 'Europe/Amsterdam' (UTC+2 in June = CEST).

describe('TZ', () => {
  it('is Europe/Amsterdam', () => {
    expect(TZ).toBe('Europe/Amsterdam');
  });
});

describe('parseISO', () => {
  it('parses ISO string with offset into a Date', () => {
    const d = parseISO('2026-06-13T09:30:00+02:00');
    expect(d).toBeInstanceOf(Date);
    // UTC equivalent: 07:30:00
    expect(d.getTime()).toBe(new Date('2026-06-13T07:30:00Z').getTime());
  });
});

describe('fmtTime', () => {
  it('formats in Amsterdam time regardless of process TZ', () => {
    // 09:30 CEST (+02:00) = 07:30 UTC = 03:30 EDT — must output "09:30"
    expect(fmtTime('2026-06-13T09:30:00+02:00')).toBe('09:30');
  });

  it('accepts a Date object', () => {
    const d = parseISO('2026-06-13T10:15:00+02:00');
    expect(fmtTime(d)).toBe('10:15');
  });

  it('zero-pads single-digit minutes', () => {
    expect(fmtTime('2026-06-13T09:05:00+02:00')).toBe('09:05');
  });

  it('formats midnight correctly', () => {
    // 00:00 Amsterdam = 22:00 UTC-2 previous day — not a real case but good edge test
    expect(fmtTime('2026-06-13T00:00:00+02:00')).toBe('00:00');
  });
});

describe('fmtRange', () => {
  it('produces "HH:MM–HH:MM" format', () => {
    expect(fmtRange('2026-06-13T09:30:00+02:00', '2026-06-13T10:15:00+02:00'))
      .toBe('09:30–10:15');
  });

  it('accepts Date objects', () => {
    const s = parseISO('2026-06-13T14:30:00+02:00');
    const e = parseISO('2026-06-13T15:00:00+02:00');
    expect(fmtRange(s, e)).toBe('14:30–15:00');
  });
});

describe('fmtDayLong', () => {
  it('returns full weekday, day and month in Amsterdam time', () => {
    // June 13, 2026 is a Saturday
    const result = fmtDayLong('2026-06-13T09:30:00+02:00');
    expect(result).toContain('Saturday');
    expect(result).toContain('June');
    expect(result).toContain('13');
  });

  it('accepts a Date object', () => {
    const d = parseISO('2026-06-14T10:00:00+02:00');
    // June 14, 2026 is a Sunday
    const result = fmtDayLong(d);
    expect(result).toContain('Sunday');
    expect(result).toContain('14');
  });

  it('uses Amsterdam TZ — late UTC Saturday appears as Sunday in Amsterdam', () => {
    // 23:00 UTC Saturday June 13 = 01:00 CEST Sunday June 14
    // Formatting in UTC would show Saturday/13; Amsterdam shows Sunday/14.
    const result = fmtDayLong('2026-06-13T23:00:00Z');
    expect(result).toContain('Sunday');
    expect(result).toContain('14');
  });
});

describe('diffMin', () => {
  it('returns positive minutes from a to b', () => {
    expect(diffMin('2026-06-13T09:00:00+02:00', '2026-06-13T09:30:00+02:00')).toBe(30);
  });

  it('returns negative when a is after b', () => {
    expect(diffMin('2026-06-13T09:30:00+02:00', '2026-06-13T09:00:00+02:00')).toBe(-30);
  });

  it('returns 0 for equal timestamps', () => {
    const t = '2026-06-13T10:00:00+02:00';
    expect(diffMin(t, t)).toBe(0);
  });

  it('rounds sub-minute differences', () => {
    expect(diffMin('2026-06-13T10:00:00+02:00', '2026-06-13T10:01:29+02:00')).toBe(1);
    expect(diffMin('2026-06-13T10:00:00+02:00', '2026-06-13T10:01:30+02:00')).toBe(2);
  });

  it('accepts Date objects', () => {
    const a = parseISO('2026-06-13T12:00:00+02:00');
    const b = parseISO('2026-06-13T13:30:00+02:00');
    expect(diffMin(a, b)).toBe(90);
  });
});

describe('sessionStatus', () => {
  const s = {
    startsAt: '2026-06-13T09:30:00+02:00',
    endsAt:   '2026-06-13T10:15:00+02:00',
  };

  it('returns "before" when now is before startsAt', () => {
    expect(sessionStatus(s, '2026-06-13T09:00:00+02:00')).toBe('before');
  });

  it('returns "before" when now equals startsAt minus 1ms', () => {
    expect(sessionStatus(s, '2026-06-13T09:29:59+02:00')).toBe('before');
  });

  it('returns "live" when now is exactly at startsAt', () => {
    expect(sessionStatus(s, '2026-06-13T09:30:00+02:00')).toBe('live');
  });

  it('returns "live" during the session', () => {
    expect(sessionStatus(s, '2026-06-13T10:00:00+02:00')).toBe('live');
  });

  it('returns "after" when now equals endsAt', () => {
    expect(sessionStatus(s, '2026-06-13T10:15:00+02:00')).toBe('after');
  });

  it('returns "after" when now is past endsAt', () => {
    expect(sessionStatus(s, '2026-06-13T11:00:00+02:00')).toBe('after');
  });
});
