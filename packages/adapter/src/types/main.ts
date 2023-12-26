import type { LoaderContext } from '../remix_adapter.js'

declare module '@remix-run/node' {
  export interface AppLoadContext extends LoaderContext {}
}
