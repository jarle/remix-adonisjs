import type { Config } from '@react-router/dev/config';

declare module "react-router" {
  interface Future {
    unstable_middleware: true;
  }
}

export default {
  ssr: true,
  appDirectory: 'resources/remix_app',
  buildDirectory: 'build/remix',
  serverBuildFile: 'server.js',
  future: {
    unstable_middleware: true
  }
} satisfies Config
