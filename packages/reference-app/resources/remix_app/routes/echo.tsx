import { LoaderFunctionArgs, json } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'

export const loader = ({ request }: LoaderFunctionArgs) => {
  const params = new URL(request.url).searchParams

  return json({
    message: params.get('message'),
  })
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
