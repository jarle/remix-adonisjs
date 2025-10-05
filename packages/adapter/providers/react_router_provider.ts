/// <reference types="@adonisjs/vite/vite_provider" />

import type { RequestHandler } from '../src/react_router_adapter.js'

import { HttpContext } from '@adonisjs/core/http'
import type { ApplicationService } from '@adonisjs/core/types'
import { RouterContextProvider } from 'react-router'
import { adonisContext } from '../src/context.js'
import '../src/types/main.js'

declare module '@adonisjs/core/types' {
  interface ContainerBindings {
    reactRouter: Promise<RequestHandler>
  }
}

declare module '@adonisjs/core/http' {
  interface HttpContext {
    reactRouterHandler: () => Promise<void>
  }
}

export default class ReactRouterProvider {
  static needsApplication = true
  private reactRouterBundle: string

  constructor(protected app: ApplicationService) {
    this.reactRouterBundle = app.makeURL('react-router/server/server.js').href
  }

  async boot() {
    const { createRequestHandler } = await import('../src/react_router_adapter.js')
    const env = this.app.getEnvironment()
    if (env !== 'web' && env !== 'test') {
      return
    }

    const vite = await this.app.container.make('vite')
    const devServer = vite.getDevServer()
    const build =
      (this.app.inDev || this.app.inTest) && devServer
        ? () => devServer.ssrLoadModule('virtual:react-router/server-build')
        : await import(this.reactRouterBundle)

    const requestHandler = createRequestHandler({
      build,
      getLoadContext: (context) => {
        const ctx = new RouterContextProvider()
        // avoid breaking changes by using the migration strategy from https://reactrouter.com/how-to/middleware#migration-from-apploadcontext
        Object.assign(ctx, {
          http: context.http,
          make: context.container.make.bind(context.container),
        })
        ctx.set(adonisContext, {
          http: context.http,
          make: context.container.make.bind(context.container),
        })
        return ctx
      },
    })
    const app = this.app
    HttpContext.getter(
      'reactRouterHandler',
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
