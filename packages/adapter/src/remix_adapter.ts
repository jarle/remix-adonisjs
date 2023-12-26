import { IncomingHttpHeaders } from 'node:http'

import { Container } from '@adonisjs/core/container'
import { HttpContext } from '@adonisjs/core/http'
import { ContainerBindings } from '@adonisjs/core/types'
import type { Request as AdonisRequest, Response as AdonisResponse } from '@adonisjs/http-server'
import {
  AppLoadContext,
  ServerBuild,
  createReadableStreamFromReadable,
  createRequestHandler as createRemixRequestHandler,
} from '@remix-run/node'
import { ReadableWebToNodeStream } from './stream_conversion.js'

export type HandlerContext = {
  http: HttpContext
  container: Container<ContainerBindings>
}

export type GetLoadContextFunction = (context: HandlerContext) => AppLoadContext

export type RequestHandler = (context: HandlerContext) => Promise<void>

/**
 * Returns a request handler for AdonisJS that serves the response using Remix.
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
  let handleRequest = createRemixRequestHandler(build, mode)

  return async (context: HandlerContext) => {
    const request = createRemixRequest(context.http.request, context.http.response)
    const loadContext = getLoadContext(context)

    const response = await handleRequest(request, loadContext)

    sendRemixResponse(context.http.response, response)
  }
}

export function createRemixHeaders(requestHeaders: IncomingHttpHeaders): Headers {
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

export function createRemixRequest(req: AdonisRequest, res: AdonisResponse): Request {
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
    headers: createRemixHeaders(req.headers()),
    signal: controller.signal,
  }

  if (req.method() !== 'GET' && req.method() !== 'HEAD') {
    // In case body has already been consumed by bodyparser
    const raw = req.raw()
    if (raw) {
      console.log('Raw request')
      init.body = Buffer.from(raw, 'utf-8')
    } else {
      console.log('Stream request')
      init.body = createReadableStreamFromReadable(req.request)
      init.duplex = 'half'
    }
  }

  return new Request(url.href, init)
}

export async function sendRemixResponse(res: AdonisResponse, webResponse: Response) {
  res.response.statusMessage = webResponse.statusText
  res.status(webResponse.status)

  webResponse.headers.forEach((value, key) => res.append(key, value))

  if (webResponse.body) {
    res.stream(new ReadableWebToNodeStream(webResponse.body))
  } else {
    res.finish()
  }
}
