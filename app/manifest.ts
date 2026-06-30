import type { MetadataRoute } from 'next';
import { getEventConfig } from '@/lib/config';

// Web app manifest (served at /manifest.webmanifest; Next auto-injects the
// <link rel="manifest">). Brand-aware: name/short_name/colors follow the event
// selected at build time via NEXT_PUBLIC_EVENT. Colors match the <html> theme
// in app/layout.tsx so the splash/address bar are seamless.
export default function manifest(): MetadataRoute.Manifest {
  const { brand, dark } = getEventConfig();
  const bg = dark ? '#0b0f14' : '#f5f6f8';

  return {
    name: `${brand.confName} Companion`,
    short_name: brand.label,
    description: 'A pocket map for the people in the loud room.',
    id: '/',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    orientation: 'portrait',
    background_color: bg,
    theme_color: bg,
    categories: ['events', 'productivity'],
    icons: [
      { src: '/icons/icon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any' },
      { src: '/icons/icon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'maskable' },
    ],
  };
}
