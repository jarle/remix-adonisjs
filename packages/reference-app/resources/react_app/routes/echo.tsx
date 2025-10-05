import type { Route } from './+types/echo.js'

export const loader = ({ request }: Route.LoaderArgs) => {
  const params = new URL(request.url).searchParams

  return {
    message: params.get('message'),
  }
}

export default function Page({ loaderData }: Route.ComponentProps) {
  return (
    <>
      <h1>Echo</h1>
      <p id="message">{loaderData.message}</p>
    </>
  )
}
