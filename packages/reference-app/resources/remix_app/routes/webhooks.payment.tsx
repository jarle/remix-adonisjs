import { ActionFunctionArgs, json } from '@remix-run/node'

export const action = async ({ request, context }: ActionFunctionArgs) => {
  const body = await request.text()
  const { http } = context
  http.logger.info('webhook body', body)
  return json({
    status: 'ok',
  })
}
