import type Configure from '@adonisjs/core/commands/configure'
import { joinToURL } from '@poppinss/utils'

const STUBS_ROOT = joinToURL(import.meta.url, './stubs')

export async function configure(command: Configure) {
  const codemods = await command.createCodemods()

  const dependencies = [
    '@remix-run/css-bundle',
    '@remix-run/node',
    '@remix-run/react',
    '@remix-run/serve',
    'react',
    'react-dom',
  ]

  const devDependencies = ['@remix-run/dev', '@types/react', '@types/react-dom']

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
  await codemods.makeUsingStub(STUBS_ROOT, 'remix.config.js.stub', {})
  await codemods.makeUsingStub(STUBS_ROOT, 'env.d.ts.stub', {})

  await codemods.updateRcFile((rcFile) => {
    rcFile.addProvider('@matstack/remix-adonisjs/remix_provider')
  })
}
