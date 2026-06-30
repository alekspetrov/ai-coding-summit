import { describe, expect, it, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { HappeningNowBanner } from '@/components/chrome/HappeningNowBanner';
import type { Room, Session } from '@/lib/schema';

vi.mock('@/context/NowProvider', () => ({ useNow: vi.fn() }));
import { useNow } from '@/context/NowProvider';
const mockNow = vi.mocked(useNow);

const conf = { startsAt: '2026-06-13T09:00:00+02:00', endsAt: '2026-06-13T18:00:00+02:00' };
const rooms: Room[] = [{ id: 'r-main', name: 'Main Hall', capacity: 800 }];
const live: Session = {
  kind: 'talk',
  id: 's-live',
  title: 'Live Right Now',
  startsAt: '2026-06-13T10:00:00+02:00',
  endsAt: '2026-06-13T11:00:00+02:00',
  dayId: 'd1',
  roomId: 'r-main',
  abstract: 'x',
  trackId: 't',
  speakerIds: [],
};

beforeEach(() => mockNow.mockReset());

describe('HappeningNowBanner', () => {
  it('renders nothing until now is known (SSR/first-paint baseline)', () => {
    mockNow.mockReturnValue(null);
    const { container } = render(<HappeningNowBanner sessions={[live]} rooms={rooms} conf={conf} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('shows the live session with a beacon and an "ends in" countdown', () => {
    mockNow.mockReturnValue(new Date('2026-06-13T10:42:00+02:00'));
    render(<HappeningNowBanner sessions={[live]} rooms={rooms} conf={conf} />);
    expect(screen.getByText('Live Right Now')).toBeInTheDocument();
    expect(screen.getByText('Live')).toBeInTheDocument();
    expect(screen.getByText(/ends in 18m/)).toBeInTheDocument();
    expect(screen.getByRole('link')).toHaveAttribute('href', '/sessions/s-live');
  });

  it('hides outside conference hours', () => {
    mockNow.mockReturnValue(new Date('2026-06-15T10:00:00+02:00'));
    const { container } = render(<HappeningNowBanner sessions={[live]} rooms={rooms} conf={conf} />);
    expect(container).toBeEmptyDOMElement();
  });
});
