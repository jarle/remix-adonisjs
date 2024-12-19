import { reactRouter } from '@react-router/dev/vite'
import { defineConfig } from 'vite'
import tailwindcss from 'tailwindcss'
import autoprefixer from 'autoprefixer'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig(({ isSsrBuild }) => ({
  base: '/assets/',
  plugins: [
    reactRouter({
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
