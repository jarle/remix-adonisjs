import { vitePlugin as remix } from '@remix-run/dev'
import { defineConfig } from 'vite'
import tailwindcss from 'tailwindcss'
import autoprefixer from 'autoprefixer'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig(({ isSsrBuild }) => ({
  base: '/assets/',
  plugins: [
    remix({
      appDirectory: 'resources/remix_app',
      buildDirectory: 'build/remix',
      serverBuildFile: 'server.js',
    }),
    tsconfigPaths(),
  ],
  optimizeDeps: {
    esbuildOptions: isSsrBuild
      ? {
          target: 'ES2022',
        }
      : {},
  },
  css: {
    postcss: {
      plugins: [tailwindcss(), autoprefixer()],
    },
  },
}))
