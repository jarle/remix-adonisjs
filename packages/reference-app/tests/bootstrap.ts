import app from '@adonisjs/core/services/app'
import server from '@adonisjs/core/services/server'
import testUtils from '@adonisjs/core/services/test_utils'
import { sessionBrowserClient } from '@adonisjs/session/plugins/browser_client'
import { apiClient } from '@japa/api-client'
import { assert } from '@japa/assert'
import { browserClient } from '@japa/browser-client'
import { pluginAdonisJS } from '@japa/plugin-adonisjs'
import type { Config } from '@japa/runner/types'

/**
 * This file is imported by the "bin/test.ts" entrypoint file
 */

/**
 * Configure Japa plugins in the plugins array.
 * Learn more - https://japa.dev/docs/runner-config#plugins-optional
 */
export const plugins: Config['plugins'] = [
  assert(),
  pluginAdonisJS(app),
  apiClient(),
  browserClient({
    contextOptions: {
      baseURL: 'http://localhost:3333',
    },
    runInSuites: ['browser'],
  }),
  sessionBrowserClient(app),
]

/**
 * Configure lifecycle function to run before and after all the
 * tests.
 *
 * The setup functions are executed before all the tests
 * The teardown functions are executer after all the tests
 */
export const runnerHooks: Required<Pick<Config, 'setup' | 'teardown'>> = {
  setup: [],
  teardown: [],
}

/**
 * Configure suites by tapping into the test suite instance.
 * Learn more - https://japa.dev/docs/test-suites#lifecycle-hooks
 */
export const configureSuite: Config['configureSuite'] = (suite) => {
  if (['browser', 'functional', 'e2e'].includes(suite.name)) {
    return suite.setup(() => {
      const testServer = testUtils.httpServer()
      server.use([
        () => import('@adonisjs/static/static_middleware'),
        () => import('@adonisjs/vite/vite_middleware'),
      ])

      return testServer.start()
    })
  }
}
