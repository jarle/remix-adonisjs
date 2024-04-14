# remix-adonisjs

**remix-adonisjs** includes all the amazing features you love from Remix, plus support for production-grade:
- Database ORM and migrations
- Authentication
- Router middleware
- Mailer
- Dependency injection

...and much, much more from the AdonisJS 6 ecosystem. Read [the about section](#about) if you want to learn more.

## Setup

Here are instructions for:
- [First time setup](#quickstart)
- [Porting an existing Remix application](#moving-an-existing-remix-application)
- [Setting up an existing AdonisJS 6 project](#adding-remix-to-an-existing-adonisjs-6-project)

### Quickstart

Create a fresh remix-adonisjs project using the [Remix starter template](https://github.com/jarle/remix-starter-kit):

```
npm init adonisjs -- -K="github:jarle/remix-starter-kit"
```

You should now be able to start building.
Just jump into your new folder and start the dev server with `npm run dev`.


### Moving an existing Remix application

> **HELP WANTED**: Simplify the migration process for Remix project with better project interop.

Moving an existing Remix application currently takes some manual work.
This is very dependent on how your existing application is set up, and might be a major migration if you have a big Remix project.
For that reason, only high-level instructions are provided here.

- Set up a fresh project using the instructions in [the quickstart section](#quickstart)
- Replace the contents of the `resources/remix_app/` folder with the contents of your Remix `app` folder
- Port over your `package.json`
- Fix any build/linting issues that arises

Please let me know about any issues you encounter when migrating so they can be documented here.

### Adding Remix to an existing AdonisJS 6 project

Requirements:
- AdonisJS 6
- [@adonisjs/static](https://github.com/adonisjs/static) middleware

Install remix-adonisjs:
``` bash
npm install @matstack/remix-adonisjs
node ace configure @matstack/remix-adonisjs
```

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

Update your `package.json` scripts to run the remix dev server:
``` json
  "scripts": {
    "build": "remix build && node ace build",
    "dev": "PORT=3000 remix dev --manual -c \"node ace serve --watch\"",
    [...]
  }
```

Add a route handler to `start/routes.ts` that invokes the Remix request handler for all HTTP verbs:
``` typescript
router.any('*', async ({ remixHandler }) => {
  return remixHandler()
})

```

## Documentation

Please refer to the documentation for the two frameworks for now:
- [Remix documentation](https://remix.run/docs/)
- [AdonisJS documentation](https://docs.adonisjs.com/)

## About

#### What is remix-adonisjs?

This is a batteries-included meta-framework for building typesafe full-stack applications with Remix on node.js.

#### How does it work?
It works by integrating your Remix application into your AdonisJS web server, providing a simple API to interact with in your server-side Remix actions and loaders.
This gives you full runtime access to the powerful AdonisJS IoC container and HTTP context, unlocking all the features of the AdonisJS framework.

Here is a simple loader accessing the authenticated user and sending them an email from a remix loader using [@adonisjs/mail](https://github.com/adonisjs/mail/):
``` typescript
// Note that we use the _context_ object in the loader.
export const loader = async ({ context }: LoaderFunctionArgs) => {
    const { http, make } = context
    // Get reference to mail service from container
    const mail = await make('mail')
    // Get authenticated user from session
    const user = http.auth.user

    await mail.sendLater((message) => {
        message
            .from(env.get('SUPPORT_EMAIL'))
            .to(http.user.email)
            .htmlView('emails/welcome', { user })
            .subject('Hello from remix-adonisjs!')
    })

    [...]
})

```

#### Why?
Remix is incredibly powerful for building React applications, but is not opinionated about how to build the backend for your application.
This means you have to pull in several external dependencies that may or may not work well togheter. 

AdonisJS is an opinionated framework similar to Laravel and Ruby on Rails that has been around since 2016.
It has a mature and integrated ecosystem of modules for common application concerns, including documentation for how to use them in the framework.

By combining these frameworks we get the best of both worlds in a single integrated package: Innovative React features for accessible and snappy UI, and a solid backend framework with all the necessary components for building scalabe and secure applications.

## Contributing

Contributions are _very_ welcome ❤️

You can hack on the project by using the [reference application](./packages/reference-app/README.md) and its associated integrations tests.

A good start is to check out issues marked with [help wanted](https://github.com/jarle/remix-adonisjs/labels/help%20wanted) and see if you can contribute either with code or your opinion/experience.

Some other ideas for improvements:
- Documentation
- Ease of setup
- Project structure
