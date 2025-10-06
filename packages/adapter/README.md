# react-adonisjs

Sponsored by [SummYT.app](https://summyt.app)

**react-adonisjs** (previously remix-adonisjs) includes all the amazing features you love from React Router, plus support for production-grade:

- Database ORM and migrations
- Authentication
- Router middleware
- Mailer
- Dependency injection

...and much, much more from the AdonisJS 6 ecosystem. Read [the about section](https://matstack.dev/react-adonisjs/about) if you want to learn more.

## Quickstart

Create a fresh react-adonisjs project using the [React Router 7 starter template](https://github.com/jarle/remix-starter-kit)

```
npm init adonisjs@latest -- -K="github:jarle/remix-starter-kit"
```

You should now be able to start building.
Just jump into your new folder and start the dev server with `npm run dev`.

You can create new React Router routes with the command:

```
node ace react:route my-route
```

There are flags for including React Router-specific functionality in the route.
Example for adding a server action:

```
node ace react:route --action my-route
```

Ready to build?
Check out the guide on [how to set up a login flow](https://matstack.dev/react-adonisjs/hands-on/building-a-login-flow) to get familiar with react-adonisjs.

## Documentation

Guides for react-adonisjs can be found in the [official documentation](https://matstack.dev/react-adonisjs/)

For implementation details/reference, refer to the official documentation for the two frameworks:

- [React Router documentation](https://reactrouter.com/home)
- [AdonisJS documentation](https://docs.adonisjs.com/)

## Discussion

The recommended place to discuss react-adonisjs is on [GitHub Discussions](https://github.com/jarle/react-adonisjs/discussions).

## Contributing

Contributions are _very_ welcome ❤️

You can hack on the project by using the [reference application](./packages/reference-app/README.md) and its associated integrations tests.

A good start is to check out issues marked with [help wanted](https://github.com/jarle/react-adonisjs/labels/help%20wanted) and see if you can contribute either with code or your opinion/experience.

Some other ideas for improvements:

- [Documentation](https://github.com/jarle/react-adonisjs-docs)
- Ease of setup
- Project structure
