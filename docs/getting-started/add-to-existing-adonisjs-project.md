# Adding Remix to an existing AdonisJS 6 project

Requirements:
- AdonisJS 6
- The [@adonisjs/vite](https://github.com/adonisjs/vite) plugin

Install and configure `@adonisjs/vite` using the [official documentation](https://docs.adonisjs.com/guides/experimental-vite#installation)

Install remix-adonisjs:
``` bash
npm install @matstack/remix-adonisjs
node ace configure @matstack/remix-adonisjs
```

::: info
Make sure that the `vite_provider` is placed above the `remix_provider` in `adonisrc.ts`
:::

Update your `tsconfig.json` compiler options to include these lines:
``` json
  "compilerOptions": {
    "outDir": "./build/",
    "module": "ES2022",
    "moduleResolution": "bundler",
    "lib": ["ES2019", "DOM", "DOM.Iterable"],
    "jsx": "react-jsx",
    [...]
  }
```

Add a route handler to `start/routes.ts` that invokes the Remix request handler for all HTTP verbs:
``` typescript
router.any('*', async ({ remixHandler }) => {
  return remixHandler()
})

```

You should now have a working remix-adonisjs application!
