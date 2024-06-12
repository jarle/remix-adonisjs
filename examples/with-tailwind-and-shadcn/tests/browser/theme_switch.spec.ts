import { test } from '@japa/runner'

test('remembers user color scheme preference', async ({ visit }) => {
  const page = await visit('/')

  // we can switch to dark mode and ...
  await page.getByRole('button', { name: /dark mode/i }).click()
  await page.waitForLoadState()

  // ... back to light mode
  await page.getByRole('button', { name: /light mode/i }).click()
  await page.waitForLoadState()

  // let's stay with the dark mode
  await page.getByRole('button', { name: /dark mode/i }).click()
  await page.waitForLoadState()

  {
    const page = await visit('/')
    // it remembered our preference and now offers us to switch to light mode
    await page.getByRole('button', { name: /light mode/i }).click()
    await page.waitForLoadState()
  }
})
