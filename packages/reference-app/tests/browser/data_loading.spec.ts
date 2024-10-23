import { test } from '@japa/runner'

test('basic page with no loader', async ({ visit }) => {
  const page = await visit('/')

  await page.screenshot({ path: 'tests/screenshots/root.png' })
})

test('adonisjs redirect', async ({ visit }) => {
  const page = await visit('/adonis_redirect')

  await page.waitForURL('/login')
})

test('basic page with loader', async ({ visit, assert }) => {
  const page = await visit('/profile')

  await page.screenshot({ path: 'tests/screenshots/profile.png' })
  const name = await page.textContent('#name')
  assert.equal(name, 'John Doe')

  const email = await page.textContent('#email')
  assert.equal(email, 'john.doe@example.com')
})

test('suspense page with loader', async ({ visit, assert }) => {
  const page = await visit('/posts')
  await page.screenshot({ path: 'tests/screenshots/posts.png' })
  // find two posts
  await page.waitForSelector('.post')
  const posts = await page.$$('.post')
  assert.lengthOf(posts, 2)
})
