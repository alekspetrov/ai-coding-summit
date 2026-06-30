import { parseISO, diffMin } from './time';
import type { Session } from '@/lib/schema';

export interface ConferenceBounds {
  startsAt: string;
  endsAt: string;
}

export type BannerResult =
  | { state: 'hidden' }
  | { state: 'live'; session: Session }
  | { state: 'upcoming'; session: Session };

// now is always passed in — never reads the wall clock.
// Hidden outside conference hours; live if a non-break session is in progress;
// upcoming if the next non-break starts within 360 minutes; else hidden.
export function computeBanner(
  sessions: Session[],
  now: string,
  conf: ConferenceBounds,
): BannerResult {
  const tNow = parseISO(now);
  const tStart = parseISO(conf.startsAt);
  const tEnd = parseISO(conf.endsAt);

  if (tNow < tStart || tNow > tEnd) return { state: 'hidden' };

  const live = sessions
    .filter(s => s.kind !== 'break')
    .find(s => parseISO(s.startsAt) <= tNow && tNow < parseISO(s.endsAt));
  if (live) return { state: 'live', session: live };

  const upcoming = sessions
    .filter(s => s.kind !== 'break' && parseISO(s.startsAt) > tNow)
    .sort((a, b) => parseISO(a.startsAt).getTime() - parseISO(b.startsAt).getTime())[0];
  if (!upcoming) return { state: 'hidden' };

  const minsAway = diffMin(now, upcoming.startsAt);
  if (minsAway > 360) return { state: 'hidden' };

  return { state: 'upcoming', session: upcoming };
}
