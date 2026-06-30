import { describe, expect, it, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { FavoritesProvider, useFavorites } from '@/context/FavoritesProvider';
import { RecentsProvider, useRecents } from '@/context/RecentsProvider';
import { NowProvider, useNow } from '@/context/NowProvider';
import { storageKey } from '@/lib/storage';

beforeEach(() => window.localStorage.clear());

function FavHarness() {
  const { isFav, toggle, count } = useFavorites();
  return (
    <div>
      <span data-testid="count">{count}</span>
      <span data-testid="isfav">{isFav('s-1') ? 'yes' : 'no'}</span>
      <button onClick={() => toggle('s-1')}>toggle</button>
    </div>
  );
}

describe('FavoritesProvider', () => {
  it('starts empty, toggles, and persists to the per-brand key', () => {
    render(
      <FavoritesProvider>
        <FavHarness />
      </FavoritesProvider>,
    );
    expect(screen.getByTestId('count').textContent).toBe('0');
    expect(screen.getByTestId('isfav').textContent).toBe('no');

    fireEvent.click(screen.getByText('toggle'));
    expect(screen.getByTestId('count').textContent).toBe('1');
    expect(screen.getByTestId('isfav').textContent).toBe('yes');

    const key = storageKey('reactsummit', 'favs');
    expect(JSON.parse(window.localStorage.getItem(key) ?? '[]')).toEqual(['s-1']);

    fireEvent.click(screen.getByText('toggle'));
    expect(screen.getByTestId('count').textContent).toBe('0');
  });
});

function RecentsHarness() {
  const { queries, push } = useRecents();
  return (
    <div>
      <span data-testid="recents">{queries.join(',')}</span>
      <button onClick={() => push('React')}>r</button>
      <button onClick={() => push('CSS')}>c</button>
    </div>
  );
}

describe('RecentsProvider', () => {
  it('prepends, dedupes (moves to front), most-recent-first', () => {
    render(
      <RecentsProvider>
        <RecentsHarness />
      </RecentsProvider>,
    );
    fireEvent.click(screen.getByText('r'));
    fireEvent.click(screen.getByText('c'));
    expect(screen.getByTestId('recents').textContent).toBe('CSS,React');
    fireEvent.click(screen.getByText('r')); // re-push React → moves to front
    expect(screen.getByTestId('recents').textContent).toBe('React,CSS');
  });
});

function NowHarness() {
  const now = useNow();
  return <span data-testid="now">{now ? 'set' : 'null'}</span>;
}

describe('NowProvider', () => {
  it('resolves a concrete time after mount', () => {
    render(
      <NowProvider>
        <NowHarness />
      </NowProvider>,
    );
    // After render + effects flush, the wall-clock (or override) is set.
    expect(screen.getByTestId('now').textContent).toBe('set');
  });
});
