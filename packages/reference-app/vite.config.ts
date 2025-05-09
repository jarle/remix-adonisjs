import { reactRouter } from '@react-router/dev/vite'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [reactRouter()],
  server: {
    warmup: {
      clientFiles: [
        './resources/remix_app/**/*.tsx',
      ],
    },
  },
  ssr: {
    // Avoid bundling adapter code
    external: ['@matstack/remix-adonisjs']
  }
})
