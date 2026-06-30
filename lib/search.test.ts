import { describe, it, expect } from 'vitest';
import { searchEvent } from './search';
import { SESSIONS, SPEAKERS, TRACKS } from './fixtures/time-states';

const EVENT = { SESSIONS, SPEAKERS, TRACKS };

describe('searchEvent', () => {
  it('returns null for empty query', () => {
    expect(searchEvent(EVENT, '')).toBeNull();
  });

  it('returns null for whitespace-only query', () => {
    expect(searchEvent(EVENT, '   ')).toBeNull();
  });

  it('matches session by title (case-insensitive)', () => {
    const r = searchEvent(EVENT, 'CSS');
    expect(r).not.toBeNull();
    expect(r!.sessions.some(s => s.id === 's-d1-2')).toBe(true);
  });

  it('matches session by title lowercased', () => {
    const r = searchEvent(EVENT, 'css');
    expect(r!.sessions.some(s => s.id === 's-d1-2')).toBe(true);
  });

  it('matches session by partial title', () => {
    const r = searchEvent(EVENT, 'road ahead');
    expect(r!.sessions.some(s => s.id === 's-d1-1')).toBe(true);
  });

  it('excludes break sessions from results', () => {
    // Search for "coffee" which appears in break titles but should not appear
    const r = searchEvent(EVENT, 'coffee');
    expect(r!.sessions).toHaveLength(0);
  });

  it('matches speaker by name', () => {
    const r = searchEvent(EVENT, 'Abramov');
    expect(r!.speakers.some(sp => sp.id === 'sp-dan')).toBe(true);
  });

  it('matches speaker by name case-insensitively', () => {
    const r = searchEvent(EVENT, 'abramov');
    expect(r!.speakers.some(sp => sp.id === 'sp-dan')).toBe(true);
  });

  it('matches speaker by tagline', () => {
    const r = searchEvent(EVENT, 'svelte creator');
    expect(r!.speakers.some(sp => sp.id === 'sp-rich')).toBe(true);
  });

  it('matches speaker by company', () => {
    const r = searchEvent(EVENT, 'Vercel');
    expect(r!.speakers.some(sp => sp.id === 'sp-rich')).toBe(true);
  });

  it('matches track by name', () => {
    const r = searchEvent(EVENT, 'Performance');
    expect(r!.tracks.some(tr => tr.id === 't-perf')).toBe(true);
  });

  it('matches track by name case-insensitively', () => {
    const r = searchEvent(EVENT, 'performance');
    expect(r!.tracks.some(tr => tr.id === 't-perf')).toBe(true);
  });

  it('returns empty arrays for query with no matches', () => {
    const r = searchEvent(EVENT, 'xyzzy-no-match');
    expect(r!.sessions).toHaveLength(0);
    expect(r!.speakers).toHaveLength(0);
    expect(r!.tracks).toHaveLength(0);
  });

  it('can match across all three categories at once', () => {
    // "react" appears in session titles, speaker taglines, and track names
    const r = searchEvent(EVENT, 'react');
    expect(r!.sessions.length).toBeGreaterThan(0);
    expect(r!.speakers.length).toBeGreaterThan(0);
    expect(r!.tracks.some(tr => tr.id === 't-react')).toBe(true);
  });

  it('trims whitespace from query before matching', () => {
    const r1 = searchEvent(EVENT, 'CSS');
    const r2 = searchEvent(EVENT, '  CSS  ');
    expect(r2!.sessions).toEqual(r1!.sessions);
  });
});
