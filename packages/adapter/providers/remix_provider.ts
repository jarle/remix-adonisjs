import path from 'node:path'
import { RequestHandler, createRequestHandler } from '../src/remix_adapter.js'

import { HttpContext } from '@adonisjs/core/http'
import { ApplicationService } from '@adonisjs/core/types'
import { pathToFileURL } from 'node:url'
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
  private remixBundle = pathToFileURL(
    path.join(process.cwd(), 'build/remix/server/server.js')
  ).toString()

  constructor(protected app: ApplicationService) {}

  async boot() {
    const vite = await this.app.container.make('vite')
    // @ts-ignore
    const devServer = vite.getDevServer()
    const build = devServer
      ? () => devServer?.ssrLoadModule('virtual:remix/server-build')
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
