import { test } from '@japa/runner'

test.group('Session handling', () => {
  test('Store session cookie on redirect', async ({ visit, browserContext, assert }) => {
    const page = await visit('/login')

    await page.fill('input[name="email"]', 'john.doe@example.com')
    await page.fill('input[name="password"]', '123')

    await page.getByRole('button', { name: 'Login' }).click()

    await page.waitForURL('/dashboard')

    const session = await browserContext.getSession()
    // const flash = await browserContext.getFlashMessages()

    assert.equal(session['login'], 'true')
    // assert.equal(flash['status'], 'success')

    await page.screenshot({ path: 'tests/screenshots/dashboard.png' })
  })
})
