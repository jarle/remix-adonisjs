import type { Config } from '@react-router/dev/config'
export default {
  ssr: true,
  appDirectory: 'resources/react_app',
  buildDirectory: 'build/react-router',
  serverBuildFile: 'server.js',
} satisfies Config
