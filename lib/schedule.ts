import type { Session, Speaker } from '@/lib/schema';

export interface Slot {
  startsAt: string;
  items: Session[];
}

// Groups sessions by startsAt; parallel sessions share one slot.
export function groupIntoSlots(sessions: Session[]): Slot[] {
  const map = new Map<string, Session[]>();
  for (const s of sessions) {
    const bucket = map.get(s.startsAt);
    if (bucket) {
      bucket.push(s);
    } else {
      map.set(s.startsAt, [s]);
    }
  }
  return Array.from(map.entries()).map(([startsAt, items]) => ({ startsAt, items }));
}

// Groups sessions by dayId preserving insertion order.
export function groupByDay(sessions: Session[]): Array<[dayId: string, sessions: Session[]]> {
  const map = new Map<string, Session[]>();
  for (const s of sessions) {
    const bucket = map.get(s.dayId);
    if (bucket) {
      bucket.push(s);
    } else {
      map.set(s.dayId, [s]);
    }
  }
  return Array.from(map.entries());
}

// Sorts speakers alphabetically and groups by first letter of name.
export function groupSpeakersByLetter(
  speakers: Speaker[],
): Array<[letter: string, speakers: Speaker[]]> {
  const map = new Map<string, Speaker[]>();
  const sorted = [...speakers].sort((a, b) => a.name.localeCompare(b.name));
  for (const sp of sorted) {
    const k = sp.name.charAt(0).toUpperCase();
    const bucket = map.get(k);
    if (bucket) {
      bucket.push(sp);
    } else {
      map.set(k, [sp]);
    }
  }
  return Array.from(map.entries());
}
