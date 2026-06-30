'use client';

import { useState } from 'react';

// The save/unsave star. Purely presentational + a brief press-scale animation;
// the favorites store wiring (which supplies `on` / `onToggle`) lands in
// TASK-05. Ported from the prototype FavoriteStar (components.jsx).
//
// Colors come from the --star-on / --star-off theme tokens. The press transition
// is neutralized under prefers-reduced-motion by the global rule in theme.css.
export type FavoriteStarProps = {
  on: boolean;
  onToggle?: () => void;
  size?: number;
  label?: string;
};

export function FavoriteStar({ on, onToggle, size = 26, label }: FavoriteStarProps) {
  const [pressed, setPressed] = useState(false);

  const handle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setPressed(true);
    window.setTimeout(() => setPressed(false), 180);
    onToggle?.();
  };

  return (
    <button
      type="button"
      onClick={handle}
      aria-pressed={on}
      aria-label={label ?? (on ? 'Unfavorite' : 'Favorite')}
      className="-m-[6px] inline-flex cursor-pointer appearance-none items-center justify-center border-0 bg-transparent p-[6px] transition-transform duration-150 ease-[cubic-bezier(.4,1.4,.6,1)]"
      style={{ transform: pressed ? 'scale(0.82)' : 'scale(1)' }}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden
        className="transition-[fill] duration-150"
      >
        <path
          d="M12 3.5l2.7 5.6 6.1.9-4.4 4.3 1.04 6.1L12 17.6l-5.45 2.85L7.6 14.35 3.2 10l6.1-.9z"
          fill={on ? 'var(--star-on)' : 'none'}
          stroke={on ? 'var(--star-on)' : 'var(--star-off)'}
          strokeWidth={1.6}
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}
