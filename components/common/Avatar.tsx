import { cx } from '@/lib/cx';

// Initials on a soft tinted disc — placeholder until real headshots exist.
// Ported from the prototype Avatar (components.jsx). Takes plain props (not a
// Speaker object) so it stays decoupled from the data schema; the composite
// SpeakerRow/SessionCard map domain → props.
export type AvatarProps = {
  initials: string;
  tint?: string;
  size?: number;
  className?: string;
};

export function Avatar({ initials, tint = '#94A3B8', size = 32, className }: AvatarProps) {
  return (
    <div
      className={cx('flex shrink-0 items-center justify-center rounded-pill text-ink', className)}
      style={{
        width: size,
        height: size,
        background: `linear-gradient(135deg, ${tint}33 0%, ${tint}1A 100%)`,
        border: `1px solid ${tint}55`,
        fontSize: size * 0.36,
        fontWeight: 600,
        letterSpacing: -0.2,
      }}
    >
      {initials}
    </div>
  );
}
