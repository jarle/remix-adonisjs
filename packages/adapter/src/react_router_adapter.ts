import type { IncomingHttpHeaders } from 'node:http'

import type { Container } from '@adonisjs/core/container'
import type { HttpContext } from '@adonisjs/core/http'
import type { ContainerBindings } from '@adonisjs/core/types'
import type { Request as AdonisRequest, Response as AdonisResponse } from '@adonisjs/http-server'

import {
  RouterContextProvider,
  ServerBuild,
  createRequestHandler as createReactRouterRequestHandler,
} from 'react-router'

import { createReadableStreamFromReadable } from '@react-router/node'
import { Readable } from 'node:stream'
import debug from './debug.js'

export type HandlerContext = {
  http: HttpContext
  container: Container<ContainerBindings>
}

export type AdonisApplicationContext = {
  http: HttpContext
  make: Container<ContainerBindings>['make']
}

export type GetLoadContextFunction = (context: HandlerContext) => RouterContextProvider

export type RequestHandler = (context: HandlerContext) => Promise<void>

/**
 * Returns a request handler for AdonisJS that serves the response using React Router.
 */
export function createRequestHandler({
  build,
  getLoadContext,
  mode = process.env.NODE_ENV,
}: {
  build: ServerBuild
  getLoadContext: GetLoadContextFunction
  mode?: string
}): RequestHandler {
  let handleRequest = createReactRouterRequestHandler(build, mode)

  return async (context: HandlerContext) => {
    debug(`Creating react-router request for ${context.http.request.parsedUrl}`)
    const request = createReactRouterRequest(context.http.request, context.http.response)
    const loadContext = getLoadContext(context)

    const response = await handleRequest(request, loadContext)

    sendReactRouterResponse(context.http, response)
  }
}

export function createReactRouterHeaders(requestHeaders: IncomingHttpHeaders): Headers {
  const headers = new Headers()

  for (let [key, values] of Object.entries(requestHeaders)) {
    if (values) {
      if (Array.isArray(values)) {
        for (let value of values) {
          headers.append(key, value)
        }
      } else {
        headers.append(key, values)
      }
    }
  }
  return headers
}

export function createReactRouterRequest(req: AdonisRequest, res: AdonisResponse): Request {
  const url = new URL(req.completeUrl(true))

  // Abort action/loaders once we can no longer write a response
  const controller = new AbortController()
  res.response.on('close', () => controller.abort())
  res.response.on('error', (err) => {
    console.error('Error writing response', err)
    controller.abort()
  })

  const init: RequestInit = {
    method: req.method(),
    headers: createReactRouterHeaders(req.headers()),
    signal: controller.signal,
  }

  if (req.method() !== 'GET' && req.method() !== 'HEAD') {
    // In case body has already been consumed by bodyparser
    const raw = req.raw()
    if (raw) {
      init.body = Buffer.from(raw, 'utf-8')
    } else {
      init.body = createReadableStreamFromReadable(req.request)
      init.duplex = 'half'
    }
  }

  return new Request(url.href, init)
}

export async function sendReactRouterResponse(ctx: HttpContext, webResponse: Response) {
  const res = ctx.response
  res.response.statusMessage = webResponse.statusText
  if (res.getStatus() === 200) {
    res.status(webResponse.status)
  }

  debug('Commit session early for react-router response')
  await ctx.session?.commit()
  webResponse.headers.forEach((value, key) => res.append(key, value))

  if (webResponse.body) {
    res.stream(Readable.fromWeb(webResponse.body))
  }
}
