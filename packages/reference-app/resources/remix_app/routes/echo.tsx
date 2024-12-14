import { LoaderFunctionArgs } from 'react-router'
import { useLoaderData } from 'react-router'

export const loader = ({ request }: LoaderFunctionArgs) => {
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
