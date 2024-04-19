import { test } from '@japa/runner'

test.group('Session handling', () => {
  test('Store session cookie on redirect', async ({ visit }) => {
    const page = await visit('/login')

    await page.fill('input[name="email"]', 'john.doe@example.com')
    await page.fill('input[name="password"]', '123')

    await page.getByRole('button', { name: 'Log in' }).click()

    await page.waitForSelector('.alert')
    await page.waitForURL('/dashboard')

    await page.screenshot({ path: 'tests/screenshots/dashboard.png' })
  })
})
