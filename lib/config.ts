import { BRANDS, type Brand, type BrandId } from '@/lib/brands';

// Single-deploy, one-event-per-deploy. The active event is chosen at build time
// via NEXT_PUBLIC_EVENT (inlined into both server and client bundles). The id
// resolves to a brand, default theme, and the bundled data file (loaded in
// lib/event.ts). Adding an event = add a JSON file + an entry here.

export interface EventConfig {
  eventId: string;
  brand: Brand;
  /** Default theme for this event (matches the prototype's per-brand default). */
  dark: boolean;
  /** Filename under /data, loaded + validated server-side. */
  dataFile: string;
}

interface EventEntry {
  brandId: BrandId;
  dark: boolean;
  dataFile: string;
}

const EVENTS: Record<string, EventEntry> = {
  'react-summit-amsterdam-2026': {
    brandId: 'reactsummit',
    dark: false,
    dataFile: 'react-summit-amsterdam-2026.json',
  },
  'jsnation-amsterdam-2026': {
    brandId: 'jsnation',
    dark: false,
    dataFile: 'jsnation-amsterdam-2026.json',
  },
  'node-congress-berlin-2026': {
    brandId: 'nodecongress',
    dark: false,
    dataFile: 'node-congress-berlin-2026.json',
  },
};

export const DEFAULT_EVENT_ID = 'react-summit-amsterdam-2026';

export function getEventConfig(): EventConfig {
  const id = process.env.NEXT_PUBLIC_EVENT ?? DEFAULT_EVENT_ID;
  const fallback = EVENTS[DEFAULT_EVENT_ID]!;
  const entry = EVENTS[id] ?? fallback;
  const eventId = entry === fallback && !(id in EVENTS) ? DEFAULT_EVENT_ID : id;
  return {
    eventId,
    brand: BRANDS[entry.brandId],
    dark: entry.dark,
    dataFile: entry.dataFile,
  };
}
