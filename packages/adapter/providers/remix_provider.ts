import path from 'node:path'
import { RequestHandler, createRequestHandler } from '../src/remix_adapter.js'

import { BriskRoute, HttpContext, Route } from '@adonisjs/core/http'
import { ApplicationService } from '@adonisjs/core/types'
import { broadcastDevReady } from '@remix-run/node'
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

  interface BriskRoute {
    remix(): Route
  }
}

export default class RemixProvider {
  static needsApplication = true
  private remixBundle = path.join(process.cwd(), 'build/remix/server.js')

  constructor(protected app: ApplicationService) {}

  async ready() {
    if (this.app.inDev && this.app.getEnvironment() === 'web') {
      broadcastDevReady(await import(this.remixBundle)).catch(console.error)
    }
  }

  async boot() {
    const build = await import(this.remixBundle)
    const requrestHandler = createRequestHandler({
      build,
      getLoadContext: (context) => context,
    })
    const app = this.app

    HttpContext.getter(
      'remixHandler',
      function (this: HttpContext) {
        return () =>
          requrestHandler({
            http: this,
            container: app.container,
          })
      },
      true
    )

    BriskRoute.macro('remix', function (this: BriskRoute) {
      return this.setHandler(({ remixHandler }) => {
        return remixHandler()
      })
    })
  }

  async register() {
    const build = await import(this.remixBundle)
    this.app.container.bind('remix', async () => {
      return createRequestHandler({
        build,
        getLoadContext: (context) => context,
      })
    })
  }
}
