import type Configure from '@adonisjs/core/commands/configure'
import { joinToURL } from '@poppinss/utils'

const STUBS_ROOT = joinToURL(import.meta.url, './stubs')

export async function configure(command: Configure) {
  const codemods = await command.createCodemods()

  const dependencies = [
    '@react-router/node',
    '@react-router/serve',
    'react',
    'react-dom',
    'react-router',
  ]

  const devDependencies = ['@react-router/dev', '@types/react', '@types/react-dom']

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
    rcFile.addCommand('@matstack/remix-adonisjs/commands')
    rcFile.addProvider('@matstack/remix-adonisjs/remix_provider')
  })
}
