import { describe, expect, it } from 'vitest';
import { brandVars, hexA } from '@/lib/color';
import { BRANDS } from '@/lib/brands';

describe('hexA', () => {
  it('expands #rrggbb to rgba()', () => {
    expect(hexA('#61DAFB', 0.15)).toBe('rgba(97,218,251,0.15)');
  });

  it('expands shorthand #rgb to rgba()', () => {
    expect(hexA('#fff', 0.5)).toBe('rgba(255,255,255,0.5)');
  });
});

describe('brandVars', () => {
  it('uses accentLight for --brand-on-surface in light mode', () => {
    const v = brandVars(BRANDS.reactsummit, false) as Record<string, string>;
    expect(v['--brand']).toBe('#61DAFB');
    expect(v['--brand-on-brand']).toBe('#0F141E');
    expect(v['--brand-on-surface']).toBe('#0091B5');
    expect(v['--brand-soft']).toBe('rgba(97,218,251,0.15)');
  });

  it('uses accentDark for --brand-on-surface in dark mode', () => {
    const v = brandVars(BRANDS.nodecongress, true) as Record<string, string>;
    expect(v['--brand-on-surface']).toBe('#7BC368');
    expect(v['--brand-soft']).toBe('rgba(95,160,78,0.15)');
  });
});
