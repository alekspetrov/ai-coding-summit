import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { FavoriteStar } from '@/components/session/FavoriteStar';

describe('FavoriteStar', () => {
  it('exposes a "Favorite" label and aria-pressed=false when off', () => {
    render(<FavoriteStar on={false} />);
    const btn = screen.getByRole('button', { name: 'Favorite' });
    expect(btn).toHaveAttribute('aria-pressed', 'false');
  });

  it('exposes an "Unfavorite" label and aria-pressed=true when on', () => {
    render(<FavoriteStar on />);
    const btn = screen.getByRole('button', { name: 'Unfavorite' });
    expect(btn).toHaveAttribute('aria-pressed', 'true');
  });

  it('calls onToggle when clicked', () => {
    const onToggle = vi.fn();
    render(<FavoriteStar on={false} onToggle={onToggle} />);
    fireEvent.click(screen.getByRole('button'));
    expect(onToggle).toHaveBeenCalledOnce();
  });

  it('honors a custom accessible label', () => {
    render(<FavoriteStar on={false} label="Save talk" />);
    expect(screen.getByRole('button', { name: 'Save talk' })).toBeInTheDocument();
  });
});
