import type { Route } from "./+types/adonis_redirect.js"

export const loader = async ({ context }: Route.LoaderArgs) => {
  const { http } = context

  http.response.redirect('/login')

  return {
    message: 'Hello, world!',
  }
}

export default function Page() {
  return <div>This should not be visible</div>
}
