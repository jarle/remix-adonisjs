import type { LoaderFunctionArgs } from 'react-router'

export const loader = async ({ context }: LoaderFunctionArgs) => {
  const { http } = context

  http.response.redirect('/login')

  return {
    message: 'Hello, world!',
  }
}

export default function Page() {
  return <div>This should not be visible</div>
}
