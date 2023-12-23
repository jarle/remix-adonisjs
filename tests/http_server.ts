import { RequestFactory, ResponseFactory } from '@adonisjs/http-server/factories'
import { getActiveTest } from '@japa/runner'
import getPort from 'get-port'
import { IncomingMessage, Server, ServerResponse, createServer } from 'node:http'
import { createRemixRequest } from '../src/remix_adapter.js'

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

export const remixHandler = createServer((req, res) => {
  const request = new RequestFactory().merge({ req, res }).create()
  const response = new ResponseFactory().merge({ req, res }).create()
  return createRemixRequest(request, response)
})
