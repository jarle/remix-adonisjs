import { vitePlugin as remix } from '@remix-run/dev';
import { defineConfig } from 'vite';

export default defineConfig(({ isSsrBuild }) => ({
  plugins: [
    remix({
      future: {
        v3_singleFetch: true,
        v3_fetcherPersist: true,
        v3_lazyRouteDiscovery: true,
        v3_relativeSplatPath: true,
        v3_throwAbortReason: true,
      },
      appDirectory: 'resources/remix_app',
      buildDirectory: 'build/remix',
      serverBuildFile: 'server.js',
    }),
  ],
  optimizeDeps: {
    esbuildOptions: isSsrBuild
      ? {
          target: 'ES2022',
        }
      : {},
  },
}))

declare module "@remix-run/node" {
  // https://remix.run/docs/en/main/guides/single-fetch#enable-single-fetch-types
  interface Future {
    v3_singleFetch: true;
  }
}
