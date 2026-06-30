'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';
import { useFavorites } from '@/context/FavoritesProvider';
import { ScheduleIcon, SearchIcon, StarIcon, UsersIcon } from '@/components/icons/icons';
import { cx } from '@/lib/cx';

// Fixed bottom tab bar. The Saved tab carries a favorites-count badge; because
// favorites use an empty server snapshot, the count is 0 on SSR/first paint
// (badge hidden) and only appears after hydration — no mismatch. Ported from
// the prototype BottomNav; routes are wired in TASK-06.
type Tab = {
  href: string;
  label: string;
  isActive: (path: string) => boolean;
  icon: (active: boolean) => ReactNode;
  badge?: boolean;
};

const TABS: Tab[] = [
  {
    href: '/',
    label: 'Schedule',
    isActive: (p) => p === '/' || p.startsWith('/sessions'),
    icon: () => <ScheduleIcon />,
  },
  {
    href: '/search',
    label: 'Search',
    isActive: (p) => p.startsWith('/search'),
    icon: () => <SearchIcon />,
  },
  {
    href: '/saved',
    label: 'Saved',
    isActive: (p) => p.startsWith('/saved'),
    icon: (active) => <StarIcon filled={active} />,
    badge: true,
  },
  {
    href: '/speakers',
    label: 'Speakers',
    isActive: (p) => p.startsWith('/speakers'),
    icon: () => <UsersIcon />,
  },
];

export function BottomNav() {
  const pathname = usePathname();
  const { count } = useFavorites();

  return (
    <nav
      aria-label="Primary"
      className="fixed inset-x-0 bottom-0 z-30 flex justify-around border-t-[0.5px] border-line bg-surface/85 backdrop-blur-xl backdrop-saturate-150"
      style={{ paddingTop: 6, paddingBottom: 'calc(env(safe-area-inset-bottom) + 8px)' }}
    >
      {TABS.map((tab) => {
        const active = tab.isActive(pathname);
        return (
          <Link
            key={tab.href}
            href={tab.href}
            aria-current={active ? 'page' : undefined}
            className={cx(
              'relative flex flex-1 flex-col items-center gap-[3px] px-3.5 pb-1 pt-1.5',
              active ? 'text-on-surface' : 'text-muted',
            )}
          >
            <span className="relative flex">
              {tab.icon(active)}
              {tab.badge && count > 0 && (
                <span className="absolute -right-2 -top-1 flex h-4 min-w-4 items-center justify-center rounded-pill bg-on-surface px-1 text-[10px] font-bold leading-none text-canvas">
                  {count}
                </span>
              )}
            </span>
            <span className={cx('text-[10.5px] tracking-[0.1px]', active ? 'font-bold' : 'font-medium')}>
              {tab.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
