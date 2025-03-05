import { reactRouter } from '@react-router/dev/vite'
import autoprefixer from 'autoprefixer'
import tailwindcss from 'tailwindcss'
import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig(({ isSsrBuild }) => ({
  base: '/assets/',
  plugins: [
    reactRouter(),
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
