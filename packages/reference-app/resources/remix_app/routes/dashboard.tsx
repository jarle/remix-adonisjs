import { useLoaderData } from 'react-router'
import { Route } from './+types/dashboard.js'

export const loader = ({ context }: Route.LoaderArgs) => {
  const { http } = context

  return http.session.all()
}
export default function Page() {
  const data = useLoaderData()

  return (
    <div className="container">
      <h1>dashboard</h1>
      <p>Current session data:</p>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  )
}
