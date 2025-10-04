import type Configure from '@adonisjs/core/commands/configure'
import { joinToURL } from '@poppinss/utils'

const STUBS_ROOT = joinToURL(import.meta.url, './stubs')

export async function configure(command: Configure) {
  const codemods = await command.createCodemods()

  const dependencies = [
    '@react-router/node',
    '@react-router/serve',
    'react-router',
    'react',
    'react-dom',
  ]

  const devDependencies = [
    '@react-router/dev',
    '@types/react',
    '@types/react-dom',
    '@react-router/fs-routes',
  ]

  await codemods.installPackages(
    dependencies.map((name) => ({
      name,
      isDevDependency: false,
    }))
  )
  await codemods.installPackages(
    devDependencies.map((name) => ({
      name,
      isDevDependency: true,
    }))
  )

  await codemods.makeUsingStub(STUBS_ROOT, '_index.tsx.stub', {})
  await codemods.makeUsingStub(STUBS_ROOT, 'root.tsx.stub', {})
  await codemods.makeUsingStub(STUBS_ROOT, 'vite.config.ts.stub', {})
  await codemods.makeUsingStub(STUBS_ROOT, 'env.d.ts.stub', {})

  await codemods.updateRcFile((rcFile) => {
    rcFile.addCommand('@matstack/react-adonisjs/commands')
    rcFile.addProvider('@matstack/react-adonisjs/react_router_provider')
  })
}
