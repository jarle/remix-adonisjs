import { useLoaderData } from 'react-router'
import { Route } from './+types/resolve_container.js'

export const loader = async ({ context }: Route.LoaderArgs) => {
  const app = await context.make('app')
  return {
    env: app.getEnvironment(),
  }
}

export default function Page() {
  const { env } = useLoaderData<typeof loader>()
  return <p>{env}</p>
}
