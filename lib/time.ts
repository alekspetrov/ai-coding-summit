export const TZ = 'Europe/Amsterdam';

export function parseISO(s: string): Date {
  return new Date(s);
}

export function fmtTime(d: Date | string): string {
  const date = d instanceof Date ? d : parseISO(d);
  return new Intl.DateTimeFormat('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: TZ,
  }).format(date);
}

export function fmtRange(start: Date | string, end: Date | string): string {
  return `${fmtTime(start)}–${fmtTime(end)}`;
}

export function fmtDayLong(d: Date | string): string {
  const date = d instanceof Date ? d : parseISO(d);
  return new Intl.DateTimeFormat('en-GB', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    timeZone: TZ,
  }).format(date);
}

// Minutes from a to b; negative if a is after b.
export function diffMin(a: Date | string, b: Date | string): number {
  const ta = a instanceof Date ? a : parseISO(a);
  const tb = b instanceof Date ? b : parseISO(b);
  return Math.round((tb.getTime() - ta.getTime()) / 60_000);
}

export type SessionStatus = 'before' | 'live' | 'after';

export interface HasTimes {
  startsAt: string;
  endsAt: string;
}

// now is always passed in — never reads the wall clock.
export function sessionStatus(s: HasTimes, now: string): SessionStatus {
  const t = parseISO(now);
  if (t < parseISO(s.startsAt)) return 'before';
  if (t < parseISO(s.endsAt)) return 'live';
  return 'after';
}
