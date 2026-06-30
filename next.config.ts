import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Service worker / PWA (Serwist) is wired in TASK-07.
};

export default nextConfig;
