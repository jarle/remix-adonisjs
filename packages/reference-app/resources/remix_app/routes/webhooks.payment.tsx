import { adonisContext } from '@matstack/remix-adonisjs'
import type { Route } from './+types/webhooks.payment.js'

export const action = async ({ request, context }: Route.ActionArgs) => {
  const body = await request.text()
  const { http } = context.get(adonisContext)
  http.logger.info('webhook body', body)
  return Response.json({
    status: 'ok',
  })
}


export function headers({ }: Route.HeadersArgs) {
  return {
    "X-Stretchy-Pants": "its for fun",
    "Cache-Control": "max-age=300, s-maxage=3600",
  };
}