import { useLoaderData } from '@remix-run/react'

export const loader = () => {
  return {
    userName: 'John Doe',
    email: 'john.doe@example.com',
  }
}

export default function Page() {
  const { userName, email } = useLoaderData<typeof loader>()
  return (
    <div>
      <h1>Profile</h1>
      <p id="name">{userName}</p>
      <p id="email">{email}</p>
    </div>
  )
}
