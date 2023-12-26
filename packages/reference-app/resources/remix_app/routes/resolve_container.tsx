import { LoaderFunctionArgs, json } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'

export const loader = async ({ context }: LoaderFunctionArgs) => {
  const app = await context.make('app')
  return json({
    env: app.getEnvironment(),
  })
}

export default function Page() {
  const { env } = useLoaderData<typeof loader>()
  return <p>{env}</p>
}
