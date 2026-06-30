import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // PWA / service worker intentionally deferred — see TASK-07. (Serwist's
  // webpack plugin doesn't run under Next 16's Turbopack build; revisit via
  // @serwist/turbopack or configurator mode when PWA is prioritized.)
};

export default nextConfig;
