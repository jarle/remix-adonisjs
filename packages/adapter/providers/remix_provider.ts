/// <reference types="@adonisjs/vite/vite_provider" />

import type { RequestHandler } from '../src/remix_adapter.js'

import { HttpContext } from '@adonisjs/core/http'
import type { ApplicationService } from '@adonisjs/core/types'
import { RouterContextProvider } from 'react-router'
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
  private remixBundle: string

  constructor(protected app: ApplicationService) {
    this.remixBundle = app.makeURL('remix/server/server.js').href
  }

  async boot() {
    const { createRequestHandler } = await import('../src/remix_adapter.js')
    const env = this.app.getEnvironment()
    if (env !== 'web' && env !== 'test') {
      return
    }

    const vite = await this.app.container.make('vite')
    const devServer = vite.getDevServer()
    const build =
      (this.app.inDev || this.app.inTest) && devServer
        ? () => devServer.ssrLoadModule('virtual:react-router/server-build')
        : await import(this.remixBundle)

    const requestHandler = createRequestHandler({
      build,
      getLoadContext: (context) => {
        const ctx = new RouterContextProvider()
        Object.assign(ctx, {
          http: context.http,
          make: context.container.make.bind(context.container),
        })
        return ctx
      },
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
