import { test } from '@japa/runner'

import { IgnitorFactory } from '@adonisjs/core/factories'
import { HttpContextFactory } from '@adonisjs/http-server/factories'

const BASE_URL = new URL('./tmp/', import.meta.url)

test.group('Bindings | Edge', () => {
  test('render template using router', async ({ assert }) => {
    const ignitor = new IgnitorFactory()
      .merge({
        rcFileContents: {
          providers: [
            'providers/remix_provider.js',
            () => import('@adonisjs/core/providers/app_provider'),
          ],
        },
      })
      .withCoreConfig()
      .create(BASE_URL, {
        importer: (filePath) => {
          return import(new URL(filePath, new URL('../', import.meta.url)).href)
        },
      })

    const app = ignitor.createApp('console')
    await app.init()
    await app.boot()

    const router = await app.container.make('router')
    router.any('/', (ctx) => {
      ctx.remix()
    })
    router.commit()

    const route = router.match('/', 'GET')
    const ctx = new HttpContextFactory().create()

    await route?.route.execute(route.route, app.container.createResolver(), ctx, () => {})
    assert.equal(ctx.response.getBody(), 'Hello virk')
  }).tags(['@active'])
})
