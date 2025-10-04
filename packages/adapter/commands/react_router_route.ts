import { BaseCommand, args, flags } from '@adonisjs/core/ace'
import { stubsRoot } from '../index.js'

export default class MakeReactRouterRoute extends BaseCommand {
  static commandName = 'react:route'
  static description = 'Create a React Router route module'

  @args.string({ description: 'The name of the route, without prefix' })
  declare name: string

  @flags.boolean({
    description: 'Include a loader function. Provides data to the route when rendering.',
    default: true,
    alias: 'l',
  })
  declare loader: boolean

  @flags.boolean({
    description: 'Include a client loader function. Data loader that executes on the client.',
  })
  declare clientLoader: boolean

  @flags.boolean({
    description:
      'Include an action function. A route action is a server only function to handle data mutations and other actions.',
    alias: 'a',
  })
  declare action: boolean

  @flags.boolean({
    description:
      'Include a client action function. Action function that will execute on the client.',
    alias: 'ca',
  })
  declare clientAction: boolean

  @flags.boolean({
    description:
      'Include a meta function. The meta export allows you to add metadata HTML tags for every route in your app.',
    alias: 'm',
  })
  declare meta: boolean

  @flags.boolean({
    description:
      'Include a links function. Defines which <link> elements to add to the page when the user visits a route.',
    alias: 'n',
  })
  declare links: boolean

  @flags.boolean({
    description:
      'Include an Error Boundary. When there is an error in your route component, the ErrorBoundary will be rendered in its place.',
    alias: 'e',
  })
  declare errorBoundary: boolean

  @flags.boolean({
    description:
      'Include a header function. Each route can define its own HTTP headers (such as cache-control) with this function.',
    alias: 'h',
  })
  declare headers: boolean

  protected stubPath: string = 'make/route.tsx.stub'

  private getImports() {
    const localType = new Set()
    const router = new Set()

    if (this.action) {
      localType.add('Route')
      router.add('useActionData')
    }
    if (this.clientAction) {
      localType.add('Route')
    }
    if (this.loader) {
      localType.add('Route')
      router.add('useLoaderData')
    }
    if (this.clientLoader) {
      localType.add('Route')
    }
    if (this.meta) {
      router.add('MetaFunction')
    }
    if (this.errorBoundary) {
      router.add('isRouteErrorResponse')
      router.add('useRouteError')
    }
    if (this.headers) {
      localType.add('Route')
    }
    return {
      router,
      localType,
    }
  }

  async run() {
    const imports = this.getImports()
    const codemods = await this.createCodemods()
    await codemods.makeUsingStub(stubsRoot, this.stubPath, {
      flags: this.parsed.flags,
      name: this.name,
      imports: {
        localType: [...imports.localType].join(', '),
        router: [...imports.router].join(', '),
      },
    })
  }
}
