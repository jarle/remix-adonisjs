import { RequestFactory, ResponseFactory } from '@adonisjs/core/factories/http'
import { test } from '@japa/runner'
import { RequestOptions, ResponseOptions, createRequest, createResponse } from 'node-mocks-http'
import { IncomingMessage, ServerResponse } from 'node:http'
import supertest from 'supertest'
import { createRemixRequest } from '../src/remix_adapter.js'
import { httpServer } from './http_server.js'

test.group('createRemixRequest Adapter Tests', () => {
  test('creates a valid Remix Request for GET method', async ({ assert }) => {
    const { url } = await httpServer.create((req, res) => {
      const remixRequest = createRemixRequest(mergeReqNode(req), mergeResNode(res))
      assert.equal(remixRequest.method, 'GET')
      res.end()
    })

    await supertest(url).get('/')
  })

  test('correctly handles non-GET/HEAD requests', async ({ assert }) => {
    const { url } = await httpServer.create((req, res) => {
      const remixRequest = createRemixRequest(mergeReqNode(req), mergeResNode(res))
      assert.equal(remixRequest.method, 'POST')
      assert.equal(remixRequest.headers.get('content-type'), 'application/json')
      res.end()
    })

    await supertest(url).post('/').send({ test: 'data' }).set('Content-Type', 'application/json')
  })

  test('aborts the request when the response is closed', async (_params, done) => {
    const { url } = await httpServer.create((req, res) => {
      const remixRequest = createRemixRequest(mergeReqNode(req), mergeResNode(res))

      remixRequest.signal.addEventListener('abort', () => {
        done()
      })

      // Handle the request to ensure it's fully established before closing the response
      req.on('data', () => {}) // Necessary to consume the request stream
      req.on('end', () => {
        // Close the response after the request is fully received
        res.destroy()
      })
    })

    await supertest(url).post('/').send({ test: 'data' }).expect(200) // Expecting 200 OK, but the server will close the connection
  }).waitForDone()

  test('handles cloned readable stream without memory leaks', async ({ assert }) => {
    const { url } = await httpServer.create((req, res) => {
      const remixRequest = createRemixRequest(mergeReqNode(req), mergeResNode(res))

      const reader = remixRequest.body!.getReader()
      let chunks = []
      reader.read().then(function processText({ done, value }): Promise<void> {
        if (done) {
          assert.isTrue(chunks.length > 0)
          res.end()
          return Promise.resolve()
        }

        chunks.push(value)
        return reader.read().then(processText)
      })
    })

    await supertest(url)
      .post('/')
      .send({ data: 'streaming data' })
      .set('Content-Type', 'application/json')
  })

  test('ensures URL is correctly formed', async ({ assert }) => {
    const { url } = await httpServer.create((req, res) => {
      const remixRequest = createRemixRequest(mergeReqNode(req), mergeResNode(res))
      assert.equal(remixRequest.url, `http://${req.headers.host}${req.url}`)
      res.end()
    })

    await supertest(url).get('/')
  })
})

test.group('Remix Adapter Tests', () => {
  test('creates a request with the correct headers', async ({ assert }) => {
    const request = testRequest({
      url: '/foo/bar',
      method: 'GET',
      protocol: 'http',
      hostname: 'localhost',
      headers: {
        'Cache-Control': 'max-age=300, s-maxage=3600',
        'Host': 'localhost:3000',
      },
    })

    const response = testResponse()
    const remixRequest = createRemixRequest(request, response)

    assert.equal(remixRequest.method, 'GET')
    assert.equal(remixRequest.headers.get('cache-control'), 'max-age=300, s-maxage=3600')
    assert.equal(remixRequest.headers.get('host'), 'localhost:3000')
  })
})

function mergeReqNode(req: IncomingMessage) {
  return new RequestFactory().merge({ req }).create()
}
function mergeResNode(res: ServerResponse) {
  return new ResponseFactory().merge({ res }).create()
}

function mergeRequest(request: IncomingMessage) {
  return new RequestFactory().merge({ req: request }).create()
}

function testRequest(options?: RequestOptions | undefined) {
  return mergeRequest(createRequest(options))
}

function testResponse(options?: ResponseOptions | undefined) {
  const res = createResponse<ServerResponse>(options)
  return new ResponseFactory().merge({ res }).create()
}
