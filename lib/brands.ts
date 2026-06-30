// Per-event brand definitions. Ported from the prototype's `BRANDS` (app.jsx).
// A brand supplies the accent color system; light/dark surface tokens live in
// theme.css. `accentLight`/`accentDark` are the legible-on-surface variants.

export type BrandId = 'reactsummit' | 'jsnation' | 'nodecongress';

export interface Brand {
  id: BrandId;
  label: string;
  primary: string; // --brand
  onPrimary: string; // --brand-on-brand (text/icon on a brand-filled surface)
  accentLight: string; // --brand-on-surface in light mode
  accentDark: string; // --brand-on-surface in dark mode
  soft: string; // base color for --brand-soft
  softA: number; // alpha applied to `soft`
  confName: string;
  confEdition: string;
}

export const BRANDS: Record<BrandId, Brand> = {
  reactsummit: {
    id: 'reactsummit',
    label: 'React Summit',
    primary: '#61DAFB',
    onPrimary: '#0F141E',
    accentLight: '#0091B5',
    accentDark: '#61DAFB',
    soft: '#61DAFB',
    softA: 0.15,
    confName: 'React Summit',
    confEdition: 'Amsterdam 2026',
  },
  jsnation: {
    id: 'jsnation',
    label: 'JSNation',
    primary: '#FBCB0A',
    onPrimary: '#0F141E',
    accentLight: '#9C7A00',
    accentDark: '#FBCB0A',
    soft: '#FBCB0A',
    softA: 0.18,
    confName: 'JSNation',
    confEdition: 'Amsterdam 2026',
  },
  nodecongress: {
    id: 'nodecongress',
    label: 'Node Congress',
    primary: '#5FA04E',
    onPrimary: '#FFFFFF',
    accentLight: '#3F7330',
    accentDark: '#7BC368',
    soft: '#5FA04E',
    softA: 0.15,
    confName: 'Node Congress',
    confEdition: 'Berlin 2026',
  },
};

export const DEFAULT_BRAND_ID: BrandId = 'reactsummit';

export function isBrandId(value: string): value is BrandId {
  return value === 'reactsummit' || value === 'jsnation' || value === 'nodecongress';
}
