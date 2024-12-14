import { ActionFunctionArgs } from 'react-router'

export const action = async ({ request, context }: ActionFunctionArgs) => {
  const body = await request.text()
  const { http } = context
  http.logger.info('webhook body', body)
  return {
    status: 'ok',
  }
}
