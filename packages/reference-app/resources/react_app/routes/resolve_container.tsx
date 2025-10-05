import { adonisContext } from '@matstack/react-adonisjs/context'
import type { Route } from './+types/resolve_container.js'

export const loader = async ({ context }: Route.LoaderArgs) => {
  // legacy way of accessing context
  const app = await context.make('app')
  // new way of accessing context
  const app2 = await context.get(adonisContext).make('app')
  return {
    env: app.getEnvironment(),
    env2: app2.getEnvironment(),
  }
}

export default function Page({ loaderData }: Route.ComponentProps) {
  return (
    <div>
      <p>{loaderData.env}</p>
      <p>{loaderData.env2}</p>
    </div>
  )
}
