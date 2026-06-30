import type { CSSProperties } from 'react';
import type { Brand } from '@/lib/brands';

// Convert a #rrggbb (or #rgb) hex + alpha into an rgba() string.
// Ported from the prototype's `hexA` (app.jsx).
export function hexA(hex: string, a: number): string {
  const h = hex.replace('#', '');
  const full = h.length === 3 ? h.replace(/./g, (c) => c + c) : h;
  const r = parseInt(full.slice(0, 2), 16);
  const g = parseInt(full.slice(2, 4), 16);
  const b = parseInt(full.slice(4, 6), 16);
  return `rgba(${r},${g},${b},${a})`;
}

// Inline CSS custom properties for the active brand. `--brand-on-surface`
// flips between the light/dark accent so the brand reads against the surface.
// Emitted on <html> from the server so colors are correct in the first byte.
export function brandVars(brand: Brand, dark: boolean): CSSProperties {
  return {
    '--brand': brand.primary,
    '--brand-on-brand': brand.onPrimary,
    '--brand-on-surface': dark ? brand.accentDark : brand.accentLight,
    '--brand-soft': hexA(brand.soft, brand.softA),
  } as CSSProperties;
}
