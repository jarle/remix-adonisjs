import type { HandlerContext } from '../remix_adapter.js'

declare module '@remix-run/node' {
  export interface AppLoadContext extends HandlerContext {}
}
