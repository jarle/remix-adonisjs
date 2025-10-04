import type { Config } from '@react-router/dev/config'
export default {
  ssr: true,
  appDirectory: 'resources/remix_app',
  buildDirectory: 'build/react-router',
  serverBuildFile: 'server.js',
} satisfies Config
