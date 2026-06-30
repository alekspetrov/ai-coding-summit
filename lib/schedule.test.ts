import { describe, it, expect } from 'vitest';
import { groupIntoSlots, groupByDay, groupSpeakersByLetter } from './schedule';
import { SESSIONS, SPEAKERS } from './fixtures/time-states';
import type { Session, Speaker } from '@/lib/schema';

// Builders fill the schema's required fields so each test can focus on the
// grouping behavior (startsAt / dayId / name) without restating boilerplate.
function mkTalk(
  id: string,
  startsAt: string,
  opts: Partial<{ endsAt: string; dayId: string; roomId: string; trackId: string; title: string }> = {},
): Session {
  return {
    kind: 'talk',
    id,
    title: opts.title ?? id,
    startsAt,
    endsAt: opts.endsAt ?? startsAt,
    dayId: opts.dayId ?? 'd1',
    roomId: opts.roomId ?? 'r1',
    abstract: '',
    trackId: opts.trackId ?? 't1',
    speakerIds: [],
  };
}

function mkSpeaker(id: string, name: string): Speaker {
  return { id, name, initials: name.charAt(0), tint: '#000', company: '', tagline: '', bio: '' };
}

describe('groupIntoSlots', () => {
  it('single session per time → one slot per session', () => {
    const slots = groupIntoSlots([
      mkTalk('s1', '09:00', { endsAt: '10:00' }),
      mkTalk('s2', '10:00', { endsAt: '11:00' }),
    ]);
    expect(slots).toHaveLength(2);
    expect(slots[0]?.items).toHaveLength(1);
    expect(slots[1]?.items).toHaveLength(1);
  });

  it('parallel sessions share one slot', () => {
    const slots = groupIntoSlots([
      mkTalk('s1', '10:30', { endsAt: '11:00', roomId: 'r-main' }),
      mkTalk('s2', '10:30', { endsAt: '11:00', roomId: 'r-side', trackId: 't2' }),
    ]);
    expect(slots).toHaveLength(1);
    expect(slots[0]?.items).toHaveLength(2);
    expect(slots[0]?.startsAt).toBe('10:30');
  });

  it('returns empty array for empty input', () => {
    expect(groupIntoSlots([])).toEqual([]);
  });

  it('preserves insertion order within a slot', () => {
    const slots = groupIntoSlots([
      mkTalk('first', '10:00', { endsAt: '11:00' }),
      mkTalk('second', '10:00', { endsAt: '11:00', roomId: 'r2', trackId: 't2' }),
    ]);
    expect(slots[0]?.items[0]?.id).toBe('first');
    expect(slots[0]?.items[1]?.id).toBe('second');
  });

  it('merges the two parallel talks at 10:30 in the prototype schedule', () => {
    const d1 = SESSIONS.filter((s) => s.dayId === 'd1');
    const slots = groupIntoSlots(d1);
    const slot1030 = slots.find((sl) => sl.startsAt === '2026-06-13T10:30:00+02:00');
    expect(slot1030).toBeDefined();
    expect(slot1030?.items).toHaveLength(2);
    const ids = slot1030?.items.map((s) => s.id);
    expect(ids).toContain('s-d1-2');
    expect(ids).toContain('s-d1-3');
  });
});

describe('groupByDay', () => {
  it('groups sessions by dayId', () => {
    const groups = groupByDay([
      mkTalk('a', '09:00', { endsAt: '10:00' }),
      mkTalk('b', '09:00', { endsAt: '10:00', dayId: 'd2' }),
      mkTalk('c', '10:00', { endsAt: '11:00' }),
    ]);
    expect(groups).toHaveLength(2);
    expect(groups.find(([id]) => id === 'd1')?.[1]).toHaveLength(2);
    expect(groups.find(([id]) => id === 'd2')?.[1]).toHaveLength(1);
  });

  it('returns empty array for empty input', () => {
    expect(groupByDay([])).toEqual([]);
  });

  it('splits prototype SESSIONS into d1 and d2', () => {
    const groups = groupByDay(SESSIONS);
    expect(groups).toHaveLength(2);
    const ids = groups.map(([id]) => id);
    expect(ids).toContain('d1');
    expect(ids).toContain('d2');
  });
});

describe('groupSpeakersByLetter', () => {
  it('groups speakers alphabetically by first letter', () => {
    const groups = groupSpeakersByLetter([
      mkSpeaker('a', 'Alice'),
      mkSpeaker('b', 'Bob'),
      mkSpeaker('c', 'Anna'),
    ]);
    expect(groups).toHaveLength(2);
    const [aGroup, bGroup] = groups;
    expect(aGroup?.[0]).toBe('A');
    expect(aGroup?.[1]).toHaveLength(2);
    expect(aGroup?.[1][0]?.name).toBe('Alice');
    expect(aGroup?.[1][1]?.name).toBe('Anna');
    expect(bGroup?.[0]).toBe('B');
  });

  it('returns empty array for empty input', () => {
    expect(groupSpeakersByLetter([])).toEqual([]);
  });

  it('sorts speakers alphabetically before grouping', () => {
    const groups = groupSpeakersByLetter([
      mkSpeaker('z', 'Zara'),
      mkSpeaker('a', 'Aaron'),
      mkSpeaker('m', 'Maria'),
    ]);
    expect(groups[0]?.[0]).toBe('A');
    expect(groups[1]?.[0]).toBe('M');
    expect(groups[2]?.[0]).toBe('Z');
  });

  it('handles prototype speakers (12 speakers, some share a letter)', () => {
    const groups = groupSpeakersByLetter(SPEAKERS);
    const letters = groups.map(([l]) => l);
    expect(letters).toEqual([...letters].sort());
    const total = groups.reduce((n, [, sp]) => n + sp.length, 0);
    expect(total).toBe(SPEAKERS.length);
  });
});
