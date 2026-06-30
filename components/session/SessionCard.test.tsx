import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SessionCard } from '@/components/session/SessionCard';
import type { Room, Session, Track } from '@/lib/schema';

const track: Track = { id: 't-react', name: 'React Core', color: '#61DAFB' };
const room: Room = { id: 'r-main', name: 'Main Hall', capacity: 800 };

const talk: Session = {
  kind: 'talk',
  id: 's-1',
  title: 'Concurrent React in Practice',
  startsAt: '2026-06-13T10:00:00+02:00',
  endsAt: '2026-06-13T10:30:00+02:00',
  dayId: 'd1',
  roomId: 'r-main',
  abstract: 'A deep dive.',
  trackId: 't-react',
  speakerIds: ['sp-1'],
};

const brk: Session = {
  kind: 'break',
  id: 'b-1',
  title: 'Coffee Break',
  startsAt: '2026-06-13T11:00:00+02:00',
  endsAt: '2026-06-13T11:30:00+02:00',
  dayId: 'd1',
  roomId: 'r-main',
  breakType: 'coffee',
};

describe('SessionCard (content)', () => {
  it('renders title, conference-time range, kind, track, room and a nav link', () => {
    render(<SessionCard session={talk} href="/sessions/s-1" track={track} room={room} />);
    expect(screen.getByText('Concurrent React in Practice')).toBeInTheDocument();
    expect(screen.getByText(/10:00.*10:30/)).toBeInTheDocument();
    expect(screen.getByText('Talk')).toBeInTheDocument();
    expect(screen.getByText('React Core')).toBeInTheDocument();
    expect(screen.getByText('Main Hall')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Concurrent React in Practice' })).toHaveAttribute(
      'href',
      '/sessions/s-1',
    );
  });

  it('exposes a favorite button and reflects the favorited state', () => {
    render(<SessionCard session={talk} href="/sessions/s-1" isFav />);
    expect(screen.getByRole('button', { name: 'Unfavorite' })).toBeInTheDocument();
  });

  it('shows the live beacon when status is live and dims when past', () => {
    const { container, rerender } = render(
      <SessionCard session={talk} href="/sessions/s-1" status="live" />,
    );
    expect(container.querySelector('.animate-beacon')).not.toBeNull();
    rerender(<SessionCard session={talk} href="/sessions/s-1" status="after" />);
    expect(container.querySelector('[data-status="after"]')).not.toBeNull();
  });
});

describe('SessionCard (break)', () => {
  it('renders a compact break row with no nav link or favorite', () => {
    render(<SessionCard session={brk} href="/sessions/b-1" room={room} />);
    expect(screen.getByText('Coffee Break')).toBeInTheDocument();
    expect(screen.queryByRole('link')).toBeNull();
    expect(screen.queryByRole('button')).toBeNull();
  });
});
