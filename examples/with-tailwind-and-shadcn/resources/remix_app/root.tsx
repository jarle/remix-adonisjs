import { ActionFunctionArgs, LoaderFunctionArgs, json, redirect } from '@remix-run/node'
import {
  Form,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from '@remix-run/react'
import { cn } from './lib/utils'
import { userPrefs } from './cookie.server'

import '~/styles/tailwind.css'

export async function loader({ request }: LoaderFunctionArgs) {
  const cookieHeader = request.headers.get('Cookie')
  const cookie = (await userPrefs.parse(cookieHeader)) || {}
  const { prefersDarkMode = false } = cookie
  return json({ prefersDarkMode })
}

export async function action({ request }: ActionFunctionArgs) {
  const cookieHeader = request.headers.get('Cookie')
  const cookie = (await userPrefs.parse(cookieHeader)) || {}
  const data = await request.formData()
  if (data.get('intent') === 'toggleColorScheme') {
    cookie.prefersDarkMode = !cookie.prefersDarkMode
  }
  const freshCookie = await userPrefs.serialize(cookie, { maxAge: 2 ** 32 - 1 })
  return redirect('/', { headers: { 'Set-Cookie': freshCookie } })
}

export function Layout({ children }: { children: React.ReactNode }) {
  const { prefersDarkMode } = useLoaderData<typeof loader>()
  return (
    <html lang="en" className={cn(prefersDarkMode && 'dark')}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <Form method="post">
          <input type="hidden" name="intent" value="toggleColorScheme" />
          <button type="submit">{prefersDarkMode ? 'Light' : 'Dark'} mode</button>
        </Form>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  )
}

export default function App() {
  return <Outlet />
}
