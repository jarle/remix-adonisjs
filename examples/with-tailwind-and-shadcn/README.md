# Minimal Starter Kit for @matstack/remix-adonisjs plus Tailwind CSS and shadcn/ui

## Run in development mode

Once in the example project's root, hit `npm i` to install the dependencies.

Copy the contents of the `.env.example` to `.env` (the easest way to quickly get up to speed).

Then hit `npm run dev`.

Visit your app in the browser of your choice.

## Run in production mode

From this example project's root run `npm run build`.

Copy the contents of the `.env` to `./build/.env` (override the variables to the production ones as (if) needed).

Then `cd` to `build/` and install _only_ those 3rd party packages that you need on production with `npm i --omit="dev"`.

Now that the build is ready, the dependencies and the .env file are there, staying in the `build` directory, hit `NODE_ENV=production node ./bin/server.js`.

If you have already specified `NODE_ENV=production` in the `./build/.env`, you can omit setting this variable again in the aforemention command, i.e. simply run `node ./bin/server.js`.

Visit your app in the browser of your choice.

## Further steps

Some amazing resources:

- AdonisJS [docs](https://adonisjs.com/) and [tutorial](https://adocasts.com/series/lets-learn-adonisjs-6)
- Remix [docs](https://remix.run/docs/en/main)
- AdonisJS + Remix [hands-on guide](https://remix-adonisjs.matstack.dev/hands-on/building-a-login-flow)
- [Tailwind CSS](https://tailwindcss.com/) detailed docs on the utility classes.
- [shadcn/ui](https://ui.shadcn.com/) documentation for the list of available components.
