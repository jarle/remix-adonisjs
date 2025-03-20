import { useLoaderData } from 'react-router'
import type { Route } from './+types/echo.js'

export const loader = ({ request }: Route.LoaderArgs) => {
  const params = new URL(request.url).searchParams

  return {
    message: params.get('message'),
  }
}

export default function Page() {
  const { message } = useLoaderData<typeof loader>()
  return (
    <>
      <h1>Echo</h1>
      <p id="message">{message}</p>
    </>
  )
}
