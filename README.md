# remix-adonisjs

**remix-adonisjs** includes all the amazing features you love from Remix, plus support for production-grade:

- Database ORM and migrations
- Authentication
- Router middleware
- Mailer
- Dependency injection

...and much, much more from the AdonisJS 6 ecosystem. Read [the about section](https://matstack.dev/remix-adonisjs/about) if you want to learn more.

## Quickstart

Create a fresh remix-adonisjs project using the [Remix starter template](https://github.com/jarle/remix-starter-kit)

Classic Remix:
```
npm init adonisjs@latest -- -K="github:jarle/remix-starter-kit"
```

New React Router 7 support (still in beta):
```
npm init adonisjs@latest -- -K="github:jarle/remix-starter-kit#support-rr7"
```

You should now be able to start building.
Just jump into your new folder and start the dev server with `npm run dev`.

You can create new Remix routes with the command:

```
node ace remix:route my-route
```

There are flags for including Remix-specific functionality in the route.
Example for adding a server action:

```
node ace remix:route --action my-route
```

Ready to build?
Check out the guide on [how to set up a login flow](https://matstack.dev/remix-adonisjs/hands-on/building-a-login-flow) to get familiar with remix-adonisjs.

## Documentation

Guides for remix-adonisjs can be found in the [official documentation](https://matstack.dev/remix-adonisjs/)

For implementation details/reference, refer to the official documentation for the two frameworks:

- [Remix documentation](https://remix.run/docs/)
- [AdonisJS documentation](https://docs.adonisjs.com/)

## Contributing

Contributions are _very_ welcome ❤️

You can hack on the project by using the [reference application](./packages/reference-app/README.md) and its associated integrations tests.

A good start is to check out issues marked with [help wanted](https://github.com/jarle/remix-adonisjs/labels/help%20wanted) and see if you can contribute either with code or your opinion/experience.

Some other ideas for improvements:

- [Documentation](https://github.com/jarle/remix-adonisjs-docs)
- Ease of setup
- Project structure
