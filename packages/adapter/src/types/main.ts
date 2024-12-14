import type { LoaderContext } from '../remix_adapter.js'

declare module 'react-router' {
  export interface AppLoadContext extends LoaderContext {}
}
