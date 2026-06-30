import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import './theme.css';
import { getEventConfig } from '@/lib/config';
import { brandVars } from '@/lib/color';

const { brand, dark } = getEventConfig();

export const metadata: Metadata = {
  applicationName: 'Conference Companion',
  title: {
    default: `${brand.confName} Companion`,
    template: `%s · ${brand.confName}`,
  },
  description: 'A pocket map for the people in the loud room.',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: dark ? '#0b0f14' : '#f5f6f8',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      data-theme={dark ? 'dark' : 'light'}
      data-brand={brand.id}
      style={brandVars(brand, dark)}
    >
      <body>{children}</body>
    </html>
  );
}
