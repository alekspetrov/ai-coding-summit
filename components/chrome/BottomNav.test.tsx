import { describe, expect, it, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BottomNav } from '@/components/chrome/BottomNav';
import { FavoritesProvider } from '@/context/FavoritesProvider';
import { storageKey } from '@/lib/storage';

vi.mock('next/navigation', () => ({ usePathname: () => '/' }));

beforeEach(() => window.localStorage.clear());

describe('BottomNav', () => {
  it('renders the four tabs and marks the active one', () => {
    render(
      <FavoritesProvider>
        <BottomNav />
      </FavoritesProvider>,
    );
    for (const label of ['Schedule', 'Search', 'Saved', 'Speakers']) {
      expect(screen.getByText(label)).toBeInTheDocument();
    }
    // pathname '/' → Schedule active
    expect(screen.getByRole('link', { name: /Schedule/ })).toHaveAttribute('aria-current', 'page');
  });

  it('shows the favorites count badge when there are saved sessions', () => {
    window.localStorage.setItem(storageKey('reactsummit', 'favs'), JSON.stringify(['a', 'b', 'c']));
    render(
      <FavoritesProvider>
        <BottomNav />
      </FavoritesProvider>,
    );
    expect(screen.getByText('3')).toBeInTheDocument();
  });
});
