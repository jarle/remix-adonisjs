import { IncomingHttpHeaders } from 'node:http'

import { Container } from '@adonisjs/core/container'
import { HttpContext } from '@adonisjs/core/http'
import { ContainerBindings } from '@adonisjs/core/types'
import type { Request as AdonisRequest, Response as AdonisResponse } from '@adonisjs/http-server'
import {
  AppLoadContext,
  createRequestHandler as createRemixRequestHandler,
  ServerBuild,
} from '@remix-run/node'
import { ReadableStream } from 'node:stream/web'
import { Readable } from 'node:stream'
import { ReadableStreamDefaultReader } from 'stream/web'

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
    let request = createRemixRequest(context.http.request, context.http.response)
    let loadContext = getLoadContext(context)

    let response = await handleRequest(request, loadContext)

    await sendRemixResponse(context.http.response, response)
  }
}

export function createRemixHeaders(requestHeaders: IncomingHttpHeaders): Headers {
  let headers = new Headers()

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
  let url = new URL(req.completeUrl(true))

  // Abort action/loaders once we can no longer write a response
  let controller = new AbortController()
  res.response.on('close', () => controller.abort())

  let init: RequestInit = {
    method: req.method(),
    headers: createRemixHeaders(req.headers()),
    signal: controller.signal,
  }

  if (req.method() !== 'GET' && req.method() !== 'HEAD') {
    // Assume that body stream has already been consumed
    const raw = req.raw()
    if (raw) {
      init.body = Buffer.from(raw, 'utf-8')
    }
  }

  return new Request(url.href, init)
}

export async function sendRemixResponse(
  res: AdonisResponse,
  nodeResponse: Response
): Promise<void> {
  res.response.statusMessage = nodeResponse.statusText
  res.status(nodeResponse.status)

  nodeResponse.headers.forEach((value, key) => res.append(key, value))

  if (nodeResponse.body) {
    res.stream(new ReadableWebToNodeStream(nodeResponse.body))
  }
}

/**
 * Converts a Web-API stream into Node stream.Readable class
 * Node stream readable: https://nodejs.org/api/stream.html#stream_readable_streams
 * Web API readable-stream: https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream
 * Node readable stream: https://nodejs.org/api/stream.html#stream_readable_streams
 */
export class ReadableWebToNodeStream extends Readable {
  public bytesRead: number = 0
  public released = false

  private reader: ReadableStreamDefaultReader<any>
  private pendingRead: Promise<any> | undefined

  constructor(stream: ReadableStream) {
    super()
    this.reader = stream.getReader()
  }

  public async _read() {
    // Should start pushing data into the queue
    // Read data from the underlying Web-API-readable-stream
    if (this.released) {
      this.push(null) // Signal EOF
      return
    }
    this.pendingRead = this.reader.read()
    const data = await this.pendingRead
    delete this.pendingRead
    if (data.done || this.released) {
      this.push(null) // Signal EOF
    } else {
      this.bytesRead += data.value.length
      this.push(data.value)
    }
  }

  public async waitForReadToComplete() {
    if (this.pendingRead) {
      await this.pendingRead
    }
  }

  public async close(): Promise<void> {
    await this.syncAndRelease()
  }

  private async syncAndRelease() {
    this.released = true
    await this.waitForReadToComplete()
    this.reader.releaseLock()
  }
}
