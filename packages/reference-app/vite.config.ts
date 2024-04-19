import adonisjs from '@adonisjs/vite/client'
import { vitePlugin as remix } from '@remix-run/dev'
import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    port: 3000,
  },
  base: '/assets/',
  plugins: [
    remix({
      appDirectory: 'resources/remix_app',
      buildDirectory: 'build/remix',
      serverBuildFile: 'server.js',
    }),
    adonisjs({
      entrypoints: [],
    }),
  ],
  optimizeDeps: {
    esbuildOptions: {
      target: 'ES2022',
    },
  },
})
