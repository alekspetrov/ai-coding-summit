export interface EventConfig {
  eventId: string;
  brandId: string;
  dataFile: string;
}

const EVENT_TO_BRAND: Record<string, string> = {
  'react-summit-amsterdam-2026': 'react-summit',
  'jsnation-amsterdam-2026': 'jsnation',
  'node-congress-berlin-2026': 'node-congress',
};

export function getEventConfig(): EventConfig {
  const eventId = process.env['NEXT_PUBLIC_EVENT'] ?? 'react-summit-amsterdam-2026';
  const brandId = EVENT_TO_BRAND[eventId] ?? 'react-summit';
  return {
    eventId,
    brandId,
    dataFile: `data/${eventId}.json`,
  };
}
