import { LoaderFunctionArgs } from 'react-router'
import { useLoaderData } from 'react-router'

export const loader = async ({ context }: LoaderFunctionArgs) => {
  const app = await context.make('app')
  return {
    env: app.getEnvironment(),
  }
}

export default function Page() {
  const { env } = useLoaderData<typeof loader>()
  return <p>{env}</p>
}
