import { vitePlugin as remix } from '@remix-run/dev';
import { defineConfig } from 'vite';

export default defineConfig(({ isSsrBuild }) => ({
  plugins: [
    remix({
      future: {
        unstable_singleFetch: true
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
    unstable_singleFetch: true;
  }
}
