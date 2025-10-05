import { Route } from './+types/profile.js'

export const loader = () => {
  return {
    userName: 'John Doe',
    email: 'john.doe@example.com',
  }
}

export default function Page({ loaderData }: Route.ComponentProps) {
  const { userName, email } = loaderData
  return (
    <div>
      <h1>Profile</h1>
      <p id="name">{userName}</p>
      <p id="email">{email}</p>
    </div>
  )
}
