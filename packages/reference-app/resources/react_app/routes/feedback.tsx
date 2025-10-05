import { Form } from 'react-router'
import { Route } from './+types/feedback.js'

export const action = () => {
  return {
    message: 'Thank you for your feedback!',
  }
}

export default function Page({ actionData }: Route.ComponentProps) {
  return (
    <>
      <h1>Feedback</h1>
      <Form method="post">
        <label>
          Name
          <input type="text" name="name" id="name" required />
        </label>
        <br />
        <label>
          Email
          <input type="email" name="email" id="email" required />
        </label>
        <br />
        <label>
          Message
          <textarea name="message" id="message" />
        </label>
        <br />
        <button type="submit">Submit</button>
      </Form>
      {actionData ? <p className="alert">{actionData.message}</p> : null}
    </>
  )
}
