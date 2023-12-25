import type { HttpContext } from '@adonisjs/core/http'
import app from '@adonisjs/core/services/app'
import type { NextFn } from '@adonisjs/core/types/http'

export default class RemixMiddleware {
  async handle(ctx: HttpContext, next: NextFn) {
    ctx.remix = async () => {
      const remixHandler = await app.container.make('remix')
      return remixHandler({
        http: ctx,
        container: app.container,
      })
    }
    return next()
  }
}
