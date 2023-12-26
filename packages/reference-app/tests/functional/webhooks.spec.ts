import { test } from '@japa/runner'

test('can read body from POST requests', async ({ client }) => {
  const response = await client
    .post('/webhooks/payment')
    .json({
      amount: 10000,
    })
    .send()

  response.assertStatus(200)
  response.assertBody({ status: 'ok' })
})
