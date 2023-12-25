import type Configure from '@adonisjs/core/commands/configure'

export async function configure(command: Configure) {
  const codemods = await command.createCodemods()

  const dependencies = [
    '@remix-run/css-bundle',
    '@remix-run/node',
    '@remix-run/react',
    '@remix-run/serve',
    'isbot',
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

  await command.publishStub('_index.tsx.stub')
  await command.publishStub('root.tsx.stub')
  await command.publishStub('remix.config.js.stub')
  await command.publishStub('remix.env.d.ts.stub')
  await command.publishStub('remix_middleware.ts.stub', {
    entity: command.app.generators.createEntity('remix'),
  })
  await codemods.registerMiddleware('router', [
    {
      name: 'remix',
      path: '#middleware/remix_middleware',
    },
  ])

  // TODO: not sure about this one
  await codemods.updateRcFile((rcFile) => {
    rcFile.addProvider('@matstack/remix-adonisjs/remix_provider')
  })
}
