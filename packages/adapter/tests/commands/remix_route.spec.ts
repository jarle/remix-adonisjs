import { AceFactory } from '@adonisjs/core/factories'
import { test } from '@japa/runner'

import MakeRemixRoute from '../../commands/remix_route.js'

test.group('Create remix route from stub', (group) => {
  group.each.teardown(async () => {
    delete process.env.ADONIS_ACE_CWD
  })

  test('make a basic route', async ({ fs, assert }) => {
    const ace = await new AceFactory().make(fs.baseUrl, { importer: () => {} })
    await ace.app.init()
    ace.ui.switchMode('raw')

    const command = await ace.create(MakeRemixRoute, ['login'])
    await command.exec()

    command.assertLog('green(DONE:)    create resources/remix_app/routes/login.tsx')
    await assert.fileContains(
      'resources/remix_app/routes/login.tsx',
      'export default function Page() {'
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
        codeMatch: 'export const loader = ({ context }: LoaderFunctionArgs) => {',
      },
      {
        flag: 'client-loader',
        codeMatch:
          'export const clientLoader = async ({ request, params, serverLoader }: ClientLoaderFunctionArgs) => {',
      },
      {
        flag: 'action',
        codeMatch: 'export const action = ({ context }: ActionFunctionArgs) => {',
      },
      {
        flag: 'client-action',
        codeMatch:
          'export const clientAction = async ({ request, params, serverAction }: ClientActionFunctionArgs) => {',
      },
      {
        flag: 'meta',
        codeMatch: 'export const meta: MetaFunction = () => {',
      },
      {
        flag: 'headers',
        codeMatch: 'export const headers: HeadersFunction = ({',
      },

      {
        flag: 'error-boundary',
        codeMatch: 'export function ErrorBoundary() {',
      },
    ]

    // positive test
    flagRoutes.forEach(async (route) => {
      const routeName = `positive-${route.flag}`
      const command = await ace.create(MakeRemixRoute, [routeName, `--${route.flag}`])
      await command.exec()

      command.assertLog(`green(DONE:)    create resources/remix_app/routes/${routeName}.tsx`)
      await assert.fileContains(`resources/remix_app/routes/${routeName}.tsx`, route.codeMatch)
    })

    // negative test
    flagRoutes.forEach(async (route) => {
      const routeName = `negative-${route.flag}`
      const command = await ace.create(MakeRemixRoute, [routeName, `--${route.flag}=false`])
      await command.exec()

      command.assertLog(`green(DONE:)    create resources/remix_app/routes/${routeName}.tsx`)
      await assert.fileNotContains(`resources/remix_app/routes/${routeName}.tsx`, route.codeMatch)
    })
  }).tags(['@active'])
})
