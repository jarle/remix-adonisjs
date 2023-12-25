import { test } from '@japa/runner'

test.group('Data mutations', () => {
  test('basic form with action', async ({ visit, assert }) => {
    const page = await visit('/feedback')

    await page.fill('input[name="name"]', 'John Doe')
    await page.fill('input[name="email"]', 'john.doe@example.com')
    await page.fill('textarea[name="message"]', 'This is a great reference app!')

    await page.getByRole('button', { name: 'Submit' }).click()

    await page.waitForSelector('.alert')
    assert.equal(await page.textContent('.alert'), 'Thank you for your feedback!')

    await page.screenshot({ path: 'tests/screenshots/feedback.png' })
  })
})
