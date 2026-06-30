import { describe, expect, it } from 'vitest';
import { render } from '@testing-library/react';
import { BreakIcon, ScheduleIcon, StarIcon } from '@/components/icons/icons';

describe('icons', () => {
  it('renders a decorative (aria-hidden) svg', () => {
    const { container } = render(<ScheduleIcon />);
    const svg = container.querySelector('svg');
    expect(svg).not.toBeNull();
    expect(svg).toHaveAttribute('aria-hidden', 'true');
  });

  it('respects a custom size', () => {
    const { container } = render(<ScheduleIcon size={30} />);
    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('width', '30');
    expect(svg).toHaveAttribute('height', '30');
  });

  it('fills the star path only when filled', () => {
    const { container, rerender } = render(<StarIcon />);
    expect(container.querySelector('path')).toHaveAttribute('fill', 'none');
    rerender(<StarIcon filled />);
    expect(container.querySelector('path')).toHaveAttribute('fill', 'currentColor');
  });

  it('picks the right glyph per break kind', () => {
    // lunch → utensils path; coffee (default) → coffee path. Just assert each
    // renders a distinct path so the switch is exercised.
    const lunch = render(<BreakIcon breakType="lunch" />).container.querySelector('path')?.getAttribute('d');
    const coffee = render(<BreakIcon breakType="coffee" />).container.querySelector('path')?.getAttribute('d');
    expect(lunch).toBeTruthy();
    expect(coffee).toBeTruthy();
    expect(lunch).not.toEqual(coffee);
  });
});
