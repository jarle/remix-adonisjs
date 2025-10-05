import type { Route } from './+types/resolve_container.js'

export const loader = async ({ context }: Route.LoaderArgs) => {
  const app = await context.make('app')
  return {
    env: app.getEnvironment(),
  }
}

export default function Page({ loaderData }: Route.ComponentProps) {
  return <p>{loaderData.env}</p>
}
