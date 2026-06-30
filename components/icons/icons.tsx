// Icon set — lucide-style single-stroke glyphs, hand-traced from the prototype
// (components.jsx ICONS). Each is a server-renderable SVG that inherits color
// via `currentColor`, so callers set color with a `text-*` utility. Decorative
// by default (aria-hidden); pass `aria-hidden={false}` + `aria-label` to expose.
import type { ReactNode, SVGProps } from 'react';

export type IconProps = Omit<SVGProps<SVGSVGElement>, 'children' | 'strokeWidth'> & {
  size?: number;
};

function Glyph({
  size = 22,
  strokeWidth = 1.8,
  children,
  ...props
}: IconProps & { strokeWidth?: number; children: ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      {...props}
    >
      {children}
    </svg>
  );
}

export function ScheduleIcon(p: IconProps) {
  return (
    <Glyph {...p}>
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M3 9h18M8 3v4M16 3v4" />
    </Glyph>
  );
}

export function SearchIcon(p: IconProps) {
  return (
    <Glyph {...p}>
      <circle cx="11" cy="11" r="7" />
      <path d="M20 20l-4.3-4.3" />
    </Glyph>
  );
}

export function StarIcon({ filled, ...p }: IconProps & { filled?: boolean }) {
  return (
    <Glyph {...p}>
      <path
        d="M12 3.5l2.7 5.6 6.1.9-4.4 4.3 1.04 6.1L12 17.6l-5.45 2.85L7.6 14.35 3.2 10l6.1-.9z"
        fill={filled ? 'currentColor' : 'none'}
      />
    </Glyph>
  );
}

export function UsersIcon(p: IconProps) {
  return (
    <Glyph {...p}>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13A4 4 0 0 1 16 11" />
    </Glyph>
  );
}

export function BackIcon(p: IconProps) {
  return (
    <Glyph size={20} strokeWidth={2} {...p}>
      <path d="M15 18l-6-6 6-6" />
    </Glyph>
  );
}

export function PinIcon(p: IconProps) {
  return (
    <Glyph size={14} strokeWidth={2} {...p}>
      <path d="M12 22s-7-7-7-12a7 7 0 0 1 14 0c0 5-7 12-7 12z" />
      <circle cx="12" cy="10" r="2.5" />
    </Glyph>
  );
}

export function ClockIcon(p: IconProps) {
  return (
    <Glyph size={14} strokeWidth={2} {...p}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </Glyph>
  );
}

export function XIcon(p: IconProps) {
  return (
    <Glyph size={16} strokeWidth={2.2} {...p}>
      <path d="M5 5l14 14M19 5L5 19" />
    </Glyph>
  );
}

export function ChevronRightIcon(p: IconProps) {
  return (
    <Glyph size={14} strokeWidth={2} {...p}>
      <path d="M9 18l6-6-6-6" />
    </Glyph>
  );
}

export function ExternalIcon(p: IconProps) {
  return (
    <Glyph size={14} {...p}>
      <path d="M7 17L17 7M9 7h8v8" />
    </Glyph>
  );
}

export function CoffeeIcon(p: IconProps) {
  return (
    <Glyph size={14} {...p}>
      <path d="M17 8h1a3 3 0 0 1 0 6h-1M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V8zM6 2v3M10 2v3M14 2v3" />
    </Glyph>
  );
}

export function UtensilsIcon(p: IconProps) {
  return (
    <Glyph size={14} {...p}>
      <path d="M3 2v7a3 3 0 0 0 3 3v10M9 2v20M15 12V2a4 4 0 0 0 0 8v12" />
    </Glyph>
  );
}

export function PartyIcon(p: IconProps) {
  return (
    <Glyph size={14} {...p}>
      <path d="M3 21l5-13 8 8-13 5zM11 4l1 2M19 7l2 1M16 12l3-1M14 2l2 5" />
    </Glyph>
  );
}

export type BreakKind = 'coffee' | 'lunch' | 'social';

// Picks the glyph for a break by its kind (lunch → utensils, social → party,
// anything else → coffee).
export function BreakIcon({ breakType, ...p }: IconProps & { breakType?: BreakKind }) {
  if (breakType === 'lunch') return <UtensilsIcon {...p} />;
  if (breakType === 'social') return <PartyIcon {...p} />;
  return <CoffeeIcon {...p} />;
}
