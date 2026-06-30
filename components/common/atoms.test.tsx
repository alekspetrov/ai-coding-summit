import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Avatar } from '@/components/common/Avatar';
import { TrackChip } from '@/components/common/TrackChip';
import { KindChip, type SessionKind } from '@/components/common/KindChip';
import { LiveDot } from '@/components/common/LiveDot';
import { EmptyState } from '@/components/common/EmptyState';
import { SkeletonCard } from '@/components/common/SkeletonCard';

describe('Avatar', () => {
  it('renders initials and applies the requested size', () => {
    render(<Avatar initials="AP" size={40} />);
    const el = screen.getByText('AP');
    expect(el).toHaveStyle({ width: '40px', height: '40px' });
  });
});

describe('TrackChip', () => {
  it('renders the track name', () => {
    render(<TrackChip name="React Core" color="#61DAFB" />);
    expect(screen.getByText('React Core')).toBeInTheDocument();
  });
});

describe('KindChip', () => {
  it('labels all five kinds', () => {
    const cases: Array<[SessionKind, string]> = [
      ['keynote', 'Keynote'],
      ['talk', 'Talk'],
      ['lightning', 'Lightning'],
      ['workshop', 'Workshop'],
      ['break', 'Break'],
    ];
    for (const [kind, label] of cases) {
      const { unmount } = render(<KindChip kind={kind} />);
      expect(screen.getByText(label)).toBeInTheDocument();
      unmount();
    }
  });

  it('renders solid kinds inverted and others as an outline', () => {
    const { unmount } = render(<KindChip kind="keynote" />);
    expect(screen.getByText('Keynote').className).toContain('bg-ink');
    unmount();
    render(<KindChip kind="talk" />);
    expect(screen.getByText('Talk').className).toContain('border-line-2');
  });
});

describe('LiveDot', () => {
  it('shows the label when provided and pulses with the beacon ring', () => {
    const { container } = render(<LiveDot label="Live" />);
    expect(screen.getByText('Live')).toBeInTheDocument();
    expect(container.querySelector('.animate-beacon')).not.toBeNull();
  });

  it('renders without a label', () => {
    render(<LiveDot />);
    expect(screen.queryByText('Live')).toBeNull();
  });
});

describe('EmptyState', () => {
  it('renders title, body and icon', () => {
    render(<EmptyState icon={<svg data-testid="ic" />} title="Nothing saved" body="Tap the star." />);
    expect(screen.getByText('Nothing saved')).toBeInTheDocument();
    expect(screen.getByText('Tap the star.')).toBeInTheDocument();
    expect(screen.getByTestId('ic')).toBeInTheDocument();
  });
});

describe('SkeletonCard', () => {
  it('renders the framed loading bars', () => {
    const { container } = render(<SkeletonCard />);
    expect(container.querySelector('.bg-line-2')).not.toBeNull();
    expect(container.querySelectorAll('.bg-chip')).toHaveLength(3);
  });
});
