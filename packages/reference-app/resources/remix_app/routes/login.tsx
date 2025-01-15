import { Form, redirect } from 'react-router'
import { Route } from './+types/login.js'

export const action = async ({ context }: Route.ActionArgs) => {
  const { http } = context

  const { password } = http.request.only(['password'])
  if (password !== '123') {
    http.session.flash('message', 'Wrong password')
    return new Response(null, {
      status: 401,
    })
  }

  http.session.put('login', 'true')
  http.session.flash('status', 'success')

  return redirect('/dashboard')
}

export default function Page() {
  return (
    <div className="container">
      <h1>Log in</h1>
      <Form method="post">
        <label>
          Email
          <input type="email" name="email" />
        </label>
        <label>
          Password
          <input type="password" name="password" />
        </label>
        <button type="submit">Login</button>
      </Form>
    </div>
  )
}
