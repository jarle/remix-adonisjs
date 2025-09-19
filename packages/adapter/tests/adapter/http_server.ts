import { EncryptionFactory } from '@adonisjs/core/factories/encryption'
import { CookieClient } from '@adonisjs/http-server'
import {
  HttpContextFactory,
  RequestFactory,
  ResponseFactory,
} from '@adonisjs/http-server/factories'
import { SessionMiddlewareFactory } from '@adonisjs/session/factories'
import { SessionConfig } from '@adonisjs/session/types'
import { getActiveTest } from '@japa/runner'
import getPort from 'get-port'
import { createServer, IncomingMessage, Server, ServerResponse } from 'node:http'
import { RequestHandler, RouterContextProvider } from 'react-router'
import debug from '../../src/debug.js'
import { createRemixRequest, sendRemixResponse } from '../../src/remix_adapter.js'
import { CookieStore } from './cookie.js'

export const httpServer = {
  async create(handler: (req: IncomingMessage, res: ServerResponse) => any | Promise<any>) {
    const server = createServer(handler)
    const test = getActiveTest()
    test?.cleanup(() => {
      server.close()
    })

    const port = await getPort({ port: 3132 })
    return new Promise<{ server: Server; url: string; port: number }>((resolve) => {
      server.listen(port, 'localhost', () => {
        return resolve({ server, port, url: `http://localhost:${port}` })
      })
    })
  },
}

export const encryption = new EncryptionFactory().create()
export const cookieClient = new CookieClient(encryption)
const sessionConfig: SessionConfig = {
  enabled: true,
  age: '2 hours',
  clearWithBrowser: false,
  cookieName: 'adonis_session',
  cookie: {},
}

export const remixHandler = (requestHandler: RequestHandler): Server =>
  createServer(async (req, res) => {
    const request = new RequestFactory().merge({ req, res, encryption }).create()
    const response = new ResponseFactory().merge({ req, res, encryption }).create()
    const ctx = new HttpContextFactory().merge({ request, response }).create()

    const middleware = await new SessionMiddlewareFactory()
      .merge({
        config: Object.assign(
          {
            store: 'cookie',
            stores: {
              cookie: () => new CookieStore(sessionConfig.cookie, ctx),
            },
          },
          sessionConfig
        ),
      })
      .create()

    ctx.containerResolver.bindValue('session', middleware)

    await middleware.handle(ctx, async () => {
      debug('Creating remix request')
      const remixRequest = createRemixRequest(request, response)

      debug('Creating request handler')

      const context = new RouterContextProvider()
      Object.assign(context, {
        http: ctx,
        make: ctx.containerResolver.make,
      })
      const foo = await requestHandler(remixRequest, context)

      ctx.session.commit()

      debug('Sending remix response')
      await sendRemixResponse(ctx, foo)
    })

    debug('Finishing request')
    response.finish()
  })
