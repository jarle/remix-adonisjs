import { Links, Meta, Outlet, Scripts, ScrollRestoration } from 'react-router'

export default function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/@picocss/pico@1/css/pico.min.css"
        />
        <link rel="icon" type="image/png" href="/favicon.png" />
        <Links />
      </head>
      <body>
        <main>
          <div className="container">
            <Outlet />
          </div>
        </main>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  )
}
