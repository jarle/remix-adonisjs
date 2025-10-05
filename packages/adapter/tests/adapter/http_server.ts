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
import {
  createReactRouterRequest,
  sendReactRouterResponse,
} from '../../src/react_router_adapter.js'
import { CookieStore } from './cookie.js'

export const httpServer = {
  async create(handler: (req: IncomingMessage, res: ServerResponse) => any | Promise<any>) {
    const server = createServer(handler)
    const test = getActiveTest()
    test?.cleanup(() => {
      server.close()
    })

    const port = await getPort({ port: 61842 })
    return new Promise<{ server: Server; url: string; port: number }>((resolve, reject) => {
      server.on('error', reject)
      server.listen(port, '127.0.0.1', () => {
        return resolve({ server, port, url: `http://127.0.0.1:${port}` })
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

export const reactRouterHandler = (requestHandler: RequestHandler): Server =>
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
      debug('Creating react-router request')
      const reactRouterRequest = createReactRouterRequest(request, response)

      debug('Creating request handler')

      const context = new RouterContextProvider()
      Object.assign(context, {
        http: ctx,
        make: ctx.containerResolver.make,
      })
      const reactRouterResponse = await requestHandler(reactRouterRequest, context)

      ctx.session.commit()

      debug('Sending react-router response')
      await sendReactRouterResponse(ctx, reactRouterResponse)
    })

    debug('Finishing request')
    response.finish()
  })
