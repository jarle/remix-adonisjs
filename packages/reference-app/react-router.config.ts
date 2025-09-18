import type { Config } from '@react-router/dev/config'
export default {
  ssr: true,
  appDirectory: 'resources/remix_app',
  buildDirectory: 'build/remix',
  serverBuildFile: 'server.js',
  future: {
    v8_middleware: true,
  }
} satisfies Config
