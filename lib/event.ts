import 'server-only';
import { cache } from 'react';
import fs from 'fs';
import path from 'path';
import { Event } from './schema';
import type { Day, Session, Speaker } from './schema';
import { getEventConfig } from './config';

const loadEvent = cache((): Event => {
  const config = getEventConfig();
  const filePath = path.join(process.cwd(), config.dataFile);
  const raw: unknown = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  return Event.parse(raw);
});

export function getEvent(): Event {
  return loadEvent();
}

export function getDays(): Day[] {
  return loadEvent().days;
}

export function getSession(id: string): Session | null {
  return loadEvent().sessions.find((s) => s.id === id) ?? null;
}

export function getSpeaker(id: string): Speaker | null {
  return loadEvent().speakers.find((s) => s.id === id) ?? null;
}
