import { adonisContext } from '@matstack/remix-adonisjs';
import { Links, Meta, Outlet, Scripts, ScrollRestoration } from 'react-router';
import { Route } from './+types/root.js';

const serverLogger: Route.unstable_MiddlewareFunction = async (
  { request, context },
  next
) => {
  const { http } = context.get(adonisContext)
  let start = performance.now();

  let res = await next();

  let duration = performance.now() - start;
  http.logger.info(`Navigated to ${request.url} (${duration}ms)`);

  return res;
};
export const unstable_middleware = [serverLogger]

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
