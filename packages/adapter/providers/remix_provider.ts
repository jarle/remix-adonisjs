import path from 'node:path'
import { RequestHandler, createRequestHandler } from '../src/remix_adapter.js'

import { HttpContext } from '@adonisjs/core/http'
import { ApplicationService } from '@adonisjs/core/types'
import { ViteDevServer } from 'vite'
import '../src/types/main.js'

declare module '@adonisjs/core/types' {
  interface ContainerBindings {
    remix: Promise<RequestHandler>
  }
}

declare module '@adonisjs/core/http' {
  interface HttpContext {
    remixHandler: () => Promise<void>
  }
}

export default class RemixProvider {
  static needsApplication = true
  private remixBundle = path.join(process.cwd(), 'build/remix/server/server.js')
  private viteDevServer?: ViteDevServer

  constructor(protected app: ApplicationService) {}

  async ready() {
    if (this.app.inDev && this.app.getEnvironment() === 'web') {
      this.viteDevServer = await import('vite').then((vite) =>
        vite.createServer({
          server: { middlewareMode: true },
        })
      )
    }
  }

  async boot() {
    const build = this.viteDevServer
      ? () => this.viteDevServer?.ssrLoadModule('virtual:remix/server-build')
      : await import(this.remixBundle)
    const requestHandler = createRequestHandler({
      build,
      getLoadContext: (context) => ({
        http: context.http,
        make: context.container.make.bind(context.container),
      }),
    })
    const app = this.app
    HttpContext.getter(
      'remixHandler',
      function (this: HttpContext) {
        return () =>
          requestHandler({
            http: this,
            container: app.container,
          })
      },
      false
    )
  }
}
