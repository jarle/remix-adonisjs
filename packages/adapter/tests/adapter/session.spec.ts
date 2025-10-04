import { test } from '@japa/runner'
import { redirect } from 'react-router'
import setCookieParser from 'set-cookie-parser'
import supertest from 'supertest'
import { cookieClient, reactRouterHandler } from './http_server.js'

test.group('Session', () => {
  test('commit session early for react-router request', async ({ assert }) => {
    let sessionId: string | undefined

    const reactRouterServer = reactRouterHandler(async (_request, context) => {
      const session = context?.http.session
      session?.flash('status', 'Completed')
      session?.put('username', 'jarle')
      sessionId = session?.sessionId
      return redirect('/admin')
    })

    const { headers } = await supertest(reactRouterServer).get('/')

    const cookies = setCookieParser.parse(headers['set-cookie'], { map: true })
    assert.deepEqual(cookieClient.decrypt(sessionId!, cookies[sessionId!].value), {
      username: 'jarle',
      __flash__: {
        status: 'Completed',
      },
    })
  })
})
