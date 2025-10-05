import { AceFactory } from '@adonisjs/core/factories'
import { test } from '@japa/runner'

import MakeReactRouterRoute from '../../commands/react_router_route.js'

test.group('Create react-router route from stub', (group) => {
  group.each.teardown(async () => {
    delete process.env.ADONIS_ACE_CWD
  })

  test('make a basic route', async ({ fs, assert }) => {
    const ace = await new AceFactory().make(fs.baseUrl, { importer: () => {} })
    await ace.app.init()
    ace.ui.switchMode('raw')

    const command = await ace.create(MakeReactRouterRoute, ['login'])
    await command.exec()

    command.assertLog('green(DONE:)    create resources/react_app/routes/login.tsx')
    await assert.fileContains(
      'resources/react_app/routes/login.tsx',
      'export default function Page({ }: Route.ComponentProps) {'
    )
  })

  test('Test flags', async ({ fs, assert }) => {
    const ace = await new AceFactory().make(fs.baseUrl, { importer: () => {} })
    await ace.app.init()
    ace.ui.switchMode('raw')

    type FlagRoute = {
      flag: string
      codeMatch: string
    }

    let flagRoutes: FlagRoute[] = [
      {
        flag: 'loader',
        codeMatch: 'export async function loader({ context }: Route.LoaderArgs) {',
      },
      {
        flag: 'client-loader',
        codeMatch: 'export async function clientLoader({ serverLoader }: Route.ClientLoaderArgs) {',
      },
      {
        flag: 'action',
        codeMatch: 'export async function action({ context }: Route.ActionArgs) {',
      },
      {
        flag: 'client-action',
        codeMatch: 'export async function clientAction({ serverAction }: Route.ClientActionArgs) {',
      },
      {
        flag: 'meta',
        codeMatch: 'export function meta({ }: Route.MetaArgs) {',
      },
      {
        flag: 'headers',
        codeMatch: 'export function headers({ }: Route.HeadersArgs) {',
      },

      {
        flag: 'error-boundary',
        codeMatch: 'export function ErrorBoundary() {',
      },
    ]

    // positive test
    flagRoutes.forEach(async (route) => {
      const routeName = `positive-${route.flag}`
      const command = await ace.create(MakeReactRouterRoute, [routeName, `--${route.flag}`])
      await command.exec()

      command.assertLog(`green(DONE:)    create resources/react_app/routes/${routeName}.tsx`)
      await assert.fileContains(`resources/react_app/routes/${routeName}.tsx`, route.codeMatch)
    })

    // negative test
    flagRoutes.forEach(async (route) => {
      const routeName = `negative-${route.flag}`
      const command = await ace.create(MakeReactRouterRoute, [routeName, `--${route.flag}=false`])
      await command.exec()

      command.assertLog(`green(DONE:)    create resources/react_app/routes/${routeName}.tsx`)
      await assert.fileNotContains(`resources/react_app/routes/${routeName}.tsx`, route.codeMatch)
    })
  }).tags(['@active'])
})
