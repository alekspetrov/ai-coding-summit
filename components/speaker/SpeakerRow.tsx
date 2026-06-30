import Link from 'next/link';
import type { Speaker } from '@/lib/schema';
import { Avatar } from '@/components/common/Avatar';
import { ChevronRightIcon } from '@/components/icons/icons';
import { cx } from '@/lib/cx';

// A tappable speaker list row: avatar + name + tagline + chevron. Ported from
// the prototype SpeakerRow (components.jsx). Composite atom — maps a Speaker
// (TASK-02 schema) onto the presentational primitives. Navigation target is
// supplied via `href` (routes wired in TASK-06).
export type SpeakerRowProps = {
  speaker: Speaker;
  href: string;
  isLast?: boolean;
};

export function SpeakerRow({ speaker, href, isLast = false }: SpeakerRowProps) {
  return (
    <Link
      href={href}
      className={cx(
        'flex items-center gap-3 px-4 py-3',
        !isLast && 'border-b-[0.5px] border-line',
      )}
    >
      <Avatar initials={speaker.initials} tint={speaker.tint} size={40} />
      <div className="min-w-0 flex-1">
        <div className="text-[15.5px] font-semibold leading-[1.2] tracking-[-0.2px] text-ink">
          {speaker.name}
        </div>
        <div className="mt-0.5 truncate text-[13px] font-medium text-muted">{speaker.tagline}</div>
      </div>
      <ChevronRightIcon className="text-faint" />
    </Link>
  );
}
