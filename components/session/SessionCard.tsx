import Link from 'next/link';
import type { Room, Session, Speaker, Track } from '@/lib/schema';
import { TZ, fmtRange, parseISO, type SessionStatus } from '@/lib/time';
import { cx } from '@/lib/cx';
import { Avatar } from '@/components/common/Avatar';
import { KindChip } from '@/components/common/KindChip';
import { TrackChip } from '@/components/common/TrackChip';
import { LiveDot } from '@/components/common/LiveDot';
import { BreakIcon, PinIcon } from '@/components/icons/icons';
import { FavoriteStar } from '@/components/session/FavoriteStar';

// The schedule's session card. Five kind variants; breaks render in a compact,
// de-emphasized form. Ported from the prototype SessionCard (components.jsx),
// retheme'd onto CSS-var tokens. Presentational: time `status` and favorite
// state are passed in (computed in TASK-05); navigation via `href` (TASK-06).
export type SessionCardProps = {
  session: Session;
  href: string;
  track?: Track;
  room?: Room;
  speakers?: Speaker[];
  isFav?: boolean;
  onToggleFav?: () => void;
  status?: SessionStatus;
  showDay?: boolean;
};

function weekdayShort(iso: string): string {
  return new Intl.DateTimeFormat('en-GB', { weekday: 'short', timeZone: TZ }).format(parseISO(iso));
}

export function SessionCard({
  session,
  href,
  track,
  room,
  speakers,
  isFav = false,
  onToggleFav,
  status = 'before',
  showDay = false,
}: SessionCardProps) {
  // Break: compact dashed row, scanned past rather than read.
  if (session.kind === 'break') {
    return (
      <div className="mx-3 flex items-center gap-3 border-y-[0.5px] border-dashed border-line px-4 py-2.5 text-break">
        <span className="min-w-[90px] font-mono text-[12px] font-medium tracking-[-0.2px]">
          {fmtRange(session.startsAt, session.endsAt)}
        </span>
        <BreakIcon breakType={session.breakType} />
        <span className="flex-1 text-[13px] font-medium">{session.title}</span>
        {room ? <span className="text-[11.5px] text-faint">{room.name}</span> : null}
      </div>
    );
  }

  const isKeynote = session.kind === 'keynote';

  return (
    <article
      data-status={status}
      className="relative mx-3 flex overflow-hidden rounded-card border-[0.5px] border-line bg-surface shadow-[0_1px_2px_rgba(15,20,30,0.04)] data-[status=after]:opacity-50"
    >
      {/* Stretched nav link — covers the whole card; interactive leaves layer above it. */}
      <Link href={href} aria-label={session.title} className="absolute inset-0" />

      {/* Track stripe */}
      <div className="w-[3px] shrink-0" style={{ background: track?.color ?? 'var(--border-2)' }} />

      <div className="min-w-0 flex-1 p-3">
        {/* Top row: time · live · day · kind · star */}
        <div className="mb-1.5 flex items-center gap-2">
          <span className="font-mono text-[12.5px] font-semibold tracking-[-0.2px] text-ink">
            {fmtRange(session.startsAt, session.endsAt)}
          </span>
          {status === 'live' && <LiveDot />}
          {showDay && (
            <span className="text-[11px] font-medium text-faint">· {weekdayShort(session.startsAt)}</span>
          )}
          <div className="flex-1" />
          <KindChip kind={session.kind} />
          <span className="relative z-10">
            <FavoriteStar on={isFav} onToggle={onToggleFav} size={22} />
          </span>
        </div>

        {/* Title */}
        <div
          className={cx(
            'mb-2 text-pretty leading-[1.25] tracking-[-0.3px] text-ink',
            isKeynote ? 'text-[17px] font-bold' : 'text-[16px] font-semibold',
          )}
        >
          {session.title}
        </div>

        {/* Speakers */}
        {speakers && speakers.length > 0 && (
          <div className="mb-1.5 flex items-center gap-2">
            <div className="flex">
              {speakers.map((sp, i) => (
                <div key={sp.id} style={{ marginLeft: i === 0 ? 0 : -8 }}>
                  <Avatar initials={sp.initials} tint={sp.tint} size={22} />
                </div>
              ))}
            </div>
            <span className="text-[13px] font-medium text-muted">
              {speakers.map((s) => s.name).join(', ')}
            </span>
          </div>
        )}

        {/* Bottom: track · room · capacity */}
        <div className="flex flex-wrap items-center gap-2">
          {track && <TrackChip name={track.name} color={track.color} />}
          <span className="inline-flex items-center gap-1 text-[12px] font-medium text-muted">
            <PinIcon className="text-faint" /> {room?.name}
          </span>
          {session.kind === 'workshop' && session.capacity ? (
            <span className="text-[11.5px] font-medium text-faint">· {session.capacity} seats</span>
          ) : null}
        </div>
      </div>
    </article>
  );
}
