import { Route } from '../../../.react-router/types/resources/remix_app/routes/+types/webhooks.payment.js'

export const action = async ({ request, context }: Route.ActionArgs) => {
  const body = await request.text()
  const { http } = context
  http.logger.info('webhook body', body)
  return Response.json({
    status: 'ok',
  })
}
