# About

## What is remix-adonisjs?

This is a batteries-included meta-framework for building typesafe full-stack applications with Remix and AdonisJS on node.js.

## How does it work?
It works by embedding your Remix application into your AdonisJS web server, supercharging your Remix loaders and actions.
This gives you full runtime access to the powerful AdonisJS IoC container and HTTP context, unlocking all the features of the AdonisJS framework with deeply integrated authentication- and authorization controls.

Here is a simple loader accessing the authenticated user and sending them an email from a remix loader using [@adonisjs/mail](https://docs.adonisjs.com/guides/mail):
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

## Why does it exist?
Remix is incredibly powerful for building React applications, but is not opinionated about how to build the backend for your application.
This means you have to pull in several external dependencies that may or may not work well togheter. 

AdonisJS is an opinionated framework similar to Laravel and Ruby on Rails that has been around since 2016.
It has a mature and integrated ecosystem of modules for common application concerns, including documentation for how to use them in the framework.

By combining these frameworks we get the best of both worlds in a single integrated package: Innovative React features for accessible and snappy UI, and a solid backend framework with all the necessary components for building scalabe and secure applications.