import { adonisContext } from '@matstack/remix-adonisjs'
import { useLoaderData } from 'react-router'
import type { Route } from './+types/resolve_container.js'

export const loader = async ({ context }: Route.LoaderArgs) => {
  const app = await context.get(adonisContext).make('app')
  return {
    env: app.getEnvironment(),
  }
}

export default function Page() {
  const { env } = useLoaderData<typeof loader>()
  return <p>{env}</p>
}
