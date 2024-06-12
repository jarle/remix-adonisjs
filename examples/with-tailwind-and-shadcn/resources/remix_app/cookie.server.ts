import { createCookie } from '@remix-run/node'

// Ref: https://remix.run/docs/en/main/utils/cookies
export const userPrefs = createCookie('user-prefs', {})
