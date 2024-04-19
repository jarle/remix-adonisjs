import { ActionFunctionArgs, redirect } from '@remix-run/node'
import { Form } from '@remix-run/react'

export const action = async ({ context }: ActionFunctionArgs) => {
  const { http } = context

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
