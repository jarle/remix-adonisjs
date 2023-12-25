import type { HandlerContext } from '../remix_adapter.js'

declare module '@adonisjs/core/http' {
  export interface HttpContext {
    remix: () => Promise<void>
  }
}

declare module '@remix-run/node' {
  export interface AppLoadContext extends HandlerContext {}
}
