import { test } from '@japa/runner'

test.group('Session handling', () => {
  test('Store session cookie on redirect', async ({ visit, browserContext, assert }) => {
    const page = await visit('/login')

    await page.fill('input[name="email"]', 'john.doe@example.com')
    await page.fill('input[name="password"]', '123')

    await page.getByRole('button', { name: 'Login' }).click()

    await page.waitForURL('/dashboard')

    const session = await browserContext.getSession()

    assert.equal(session['login'], 'true')

    await page.screenshot({ path: 'tests/screenshots/dashboard.png' })
  })
  test('Read flash message', async ({ visit, browserContext, assert }) => {
    const page = await visit('/login')

    await page.fill('input[name="email"]', 'john.doe-wrong@example.com')
    await page.fill('input[name="password"]', '4444')

    await page.getByRole('button', { name: 'Login' }).click()

    const flash = await browserContext.getFlashMessages()

    assert.equal(flash['message'], 'Wrong password')
  }).skip()
})
