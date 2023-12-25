import { test } from '@japa/runner'

test('get external data', async ({ visit }) => {
  const page = await visit('/trigger_error')

  await page.screenshot({ path: 'tests/screenshots/trigger-error.png' })
})
