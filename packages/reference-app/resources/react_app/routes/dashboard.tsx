import type { Route } from './+types/dashboard.js'

export const loader = ({ context }: Route.LoaderArgs) => {
  const { http, make } = context

  return http.session.all()
}
export default function Page({ loaderData }: Route.ComponentProps) {
  return (
    <div className="container">
      <h1>dashboard</h1>
      <p>Current session data:</p>
      <pre>{JSON.stringify(loaderData, null, 2)}</pre>
    </div>
  )
}
