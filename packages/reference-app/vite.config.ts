import { reactRouter } from '@react-router/dev/vite';
import { defineConfig } from 'vite';
import devtoolsJson from 'vite-plugin-devtools-json';

export default defineConfig({
  plugins: [reactRouter(), devtoolsJson()],
})
