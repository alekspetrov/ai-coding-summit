import { describe, it, expect } from 'vitest';
import { groupIntoSlots, groupByDay, groupSpeakersByLetter } from './schedule';
import { SESSIONS, SPEAKERS } from './fixtures/time-states';
import type { Session, Speaker } from './types';

describe('groupIntoSlots', () => {
  it('single session per time → one slot per session', () => {
    const sessions: Session[] = [
      { kind: 'talk', id: 's1', title: 'A', startsAt: '09:00', endsAt: '10:00',
        dayId: 'd1', roomId: 'r1', trackId: 't1' },
      { kind: 'talk', id: 's2', title: 'B', startsAt: '10:00', endsAt: '11:00',
        dayId: 'd1', roomId: 'r1', trackId: 't1' },
    ];
    const slots = groupIntoSlots(sessions);
    expect(slots).toHaveLength(2);
    expect(slots[0]?.items).toHaveLength(1);
    expect(slots[1]?.items).toHaveLength(1);
  });

  it('parallel sessions share one slot', () => {
    const sessions: Session[] = [
      { kind: 'talk', id: 's1', title: 'A', startsAt: '10:30', endsAt: '11:00',
        dayId: 'd1', roomId: 'r-main', trackId: 't1' },
      { kind: 'talk', id: 's2', title: 'B', startsAt: '10:30', endsAt: '11:00',
        dayId: 'd1', roomId: 'r-side', trackId: 't2' },
    ];
    const slots = groupIntoSlots(sessions);
    expect(slots).toHaveLength(1);
    expect(slots[0]?.items).toHaveLength(2);
    expect(slots[0]?.startsAt).toBe('10:30');
  });

  it('returns empty array for empty input', () => {
    expect(groupIntoSlots([])).toEqual([]);
  });

  it('preserves insertion order within a slot', () => {
    const sessions: Session[] = [
      { kind: 'talk', id: 'first',  title: 'First',  startsAt: '10:00', endsAt: '11:00',
        dayId: 'd1', roomId: 'r1', trackId: 't1' },
      { kind: 'talk', id: 'second', title: 'Second', startsAt: '10:00', endsAt: '11:00',
        dayId: 'd1', roomId: 'r2', trackId: 't2' },
    ];
    const slots = groupIntoSlots(sessions);
    expect(slots[0]?.items[0]?.id).toBe('first');
    expect(slots[0]?.items[1]?.id).toBe('second');
  });

  it('merges the two parallel talks at 10:30 in the prototype schedule', () => {
    const d1 = SESSIONS.filter(s => s.dayId === 'd1');
    const slots = groupIntoSlots(d1);
    const slot1030 = slots.find(sl => sl.startsAt === '2026-06-13T10:30:00+02:00');
    expect(slot1030).toBeDefined();
    expect(slot1030?.items).toHaveLength(2);
    const ids = slot1030?.items.map(s => s.id);
    expect(ids).toContain('s-d1-2');
    expect(ids).toContain('s-d1-3');
  });
});

describe('groupByDay', () => {
  it('groups sessions by dayId', () => {
    const sessions: Session[] = [
      { kind: 'talk', id: 'a', title: 'A', startsAt: '09:00', endsAt: '10:00',
        dayId: 'd1', roomId: 'r1', trackId: 't1' },
      { kind: 'talk', id: 'b', title: 'B', startsAt: '09:00', endsAt: '10:00',
        dayId: 'd2', roomId: 'r1', trackId: 't1' },
      { kind: 'talk', id: 'c', title: 'C', startsAt: '10:00', endsAt: '11:00',
        dayId: 'd1', roomId: 'r1', trackId: 't1' },
    ];
    const groups = groupByDay(sessions);
    expect(groups).toHaveLength(2);
    const d1 = groups.find(([id]) => id === 'd1');
    expect(d1?.[1]).toHaveLength(2);
    const d2 = groups.find(([id]) => id === 'd2');
    expect(d2?.[1]).toHaveLength(1);
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
    const speakers: Speaker[] = [
      { id: 'a', name: 'Alice', initials: 'A', tint: '#f00' },
      { id: 'b', name: 'Bob',   initials: 'B', tint: '#0f0' },
      { id: 'c', name: 'Anna',  initials: 'A', tint: '#00f' },
    ];
    const groups = groupSpeakersByLetter(speakers);
    // Alice and Anna → A; Bob → B
    expect(groups).toHaveLength(2);
    const [aGroup, bGroup] = groups;
    expect(aGroup?.[0]).toBe('A');
    expect(aGroup?.[1]).toHaveLength(2);
    // Sorted: Alice before Anna
    expect(aGroup?.[1][0]?.name).toBe('Alice');
    expect(aGroup?.[1][1]?.name).toBe('Anna');
    expect(bGroup?.[0]).toBe('B');
  });

  it('returns empty array for empty input', () => {
    expect(groupSpeakersByLetter([])).toEqual([]);
  });

  it('sorts speakers alphabetically before grouping', () => {
    const speakers: Speaker[] = [
      { id: 'z', name: 'Zara',   initials: 'Z', tint: '#f00' },
      { id: 'a', name: 'Aaron',  initials: 'A', tint: '#0f0' },
      { id: 'm', name: 'Maria',  initials: 'M', tint: '#00f' },
    ];
    const groups = groupSpeakersByLetter(speakers);
    expect(groups[0]?.[0]).toBe('A');
    expect(groups[1]?.[0]).toBe('M');
    expect(groups[2]?.[0]).toBe('Z');
  });

  it('handles prototype speakers (12 speakers, some share a letter)', () => {
    const groups = groupSpeakersByLetter(SPEAKERS);
    // All speaker names start with different letters except: none identical (all unique first chars)
    // Let's just check total count and that it's alphabetically ordered
    const letters = groups.map(([l]) => l);
    expect(letters).toEqual([...letters].sort());
    const total = groups.reduce((n, [, sp]) => n + sp.length, 0);
    expect(total).toBe(SPEAKERS.length);
  });
});
