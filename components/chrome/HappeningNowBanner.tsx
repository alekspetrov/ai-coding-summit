'use client';

import Link from 'next/link';
import type { Room, Session } from '@/lib/schema';
import { computeBanner, type ConferenceBounds } from '@/lib/banner';
import { diffMin } from '@/lib/time';
import { useNow } from '@/context/NowProvider';
import { LiveDot } from '@/components/common/LiveDot';
import { ChevronRightIcon } from '@/components/icons/icons';

// Sticky top banner: shows the live session (red beacon + "ends in"), or the
// next session within 6h ("Up next" + "starts in"), or nothing. Ported from the
// prototype HappeningNowBanner. Client-only: renders nothing until `now` is
// known (neutral SSR/first-paint baseline), so there is no hydration mismatch
// and no layout shift beyond the banner appearing once time is resolved.
export type HappeningNowBannerProps = {
  sessions: Session[];
  rooms: Room[];
  conf: ConferenceBounds;
  hrefForSession?: (id: string) => string;
};

function countdown(mins: number): string {
  const m = Math.max(0, mins);
  return m >= 60 ? `${Math.floor(m / 60)}h ${m % 60}m` : `${m}m`;
}

export function HappeningNowBanner({ sessions, rooms, conf, hrefForSession }: HappeningNowBannerProps) {
  const now = useNow();
  if (!now) return null;

  const result = computeBanner(sessions, now.toISOString(), conf);
  if (result.state === 'hidden') return null;

  const { session } = result;
  const isLive = result.state === 'live';
  const room = rooms.find((r) => r.id === session.roomId);
  const mins = diffMin(now.toISOString(), isLive ? session.endsAt : session.startsAt);
  const href = hrefForSession ? hrefForSession(session.id) : `/sessions/${session.id}`;

  return (
    <Link
      href={href}
      className="sticky top-0 z-30 flex w-full items-center gap-2.5 bg-banner px-3.5 text-white"
      style={{ paddingTop: 'calc(env(safe-area-inset-top) + 8px)', paddingBottom: 8 }}
    >
      {isLive ? (
        <LiveDot label="Live" />
      ) : (
        <span className="text-[10.5px] font-extrabold uppercase tracking-[0.8px] text-brand">
          Up next
        </span>
      )}
      <span className="flex min-w-0 flex-1 flex-col leading-[1.2]">
        <span className="truncate text-[13px] font-semibold text-white">{session.title}</span>
        <span className="truncate text-[11.5px] font-medium text-white/60">
          {room?.name} · {isLive ? `ends in ${countdown(mins)}` : `starts in ${countdown(mins)}`}
        </span>
      </span>
      <ChevronRightIcon className="text-white/50" />
    </Link>
  );
}
