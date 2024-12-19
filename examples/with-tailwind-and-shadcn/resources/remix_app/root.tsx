import { ActionFunctionArgs, LoaderFunctionArgs, json } from 'react-router'
import { Form, Links, Meta, Outlet, Scripts, ScrollRestoration, useLoaderData } from 'react-router'
import { cn } from './lib/utils'

import vine from '@vinejs/vine'
import '~/styles/tailwind.css'

export async function loader({ context }: LoaderFunctionArgs) {
  const { http } = context
  const prefersDarkMode = http.session.get('prefersDarkMode') || false
  return json({ prefersDarkMode })
}

// See the docs for more complex intent validation:
// https://matstack.dev/remix-adonisjs/recipes/validate-action-intent
const actionValidator = vine.compile(
  vine.object({
    intent: vine.enum(['toggleColorScheme']),
  })
)

export async function action({ context }: ActionFunctionArgs) {
  const { http } = context
  const { intent } = await http.request.validateUsing(actionValidator)

  if (intent === 'toggleColorScheme') {
    http.session.put('prefersDarkMode', Boolean(!http.session.get('prefersDarkMode')))
  }
  return null
}

export default function Page({ children }: { children: React.ReactNode }) {
  const { prefersDarkMode } = useLoaderData<typeof loader>()
  return (
    <html lang="en" className={cn(prefersDarkMode && 'dark')}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="w-full max-w-2xl mx-auto pt-8">
        {children}
        <Form method="post">
          <input type="hidden" name="intent" value="toggleColorScheme" />
          <button className="underline" type="submit">
            {prefersDarkMode ? 'Light' : 'Dark'} mode
          </button>
        </Form>
        <ScrollRestoration />
        <Outlet />
        <Scripts />
      </body>
    </html>
  )
}
