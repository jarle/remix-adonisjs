import type { MetaFunction } from 'react-router'

export const meta: MetaFunction = () => {
  return [{ title: 'New React Router App' }, { name: 'description', content: 'Welcome to React Router!' }]
}

export default function Index() {
  return (
    <div>
      <h1>Welcome to React Router</h1>
      <h2>...powered by AdonisJS 😎</h2>
      <ul>
        <li>
          <a target="_blank" href="https://react-router.run/tutorials/blog" rel="noreferrer">
            15m Quickstart Blog Tutorial
          </a>
        </li>
        <li>
          <a target="_blank" href="https://react-router.run/tutorials/jokes" rel="noreferrer">
            Deep Dive Jokes App Tutorial
          </a>
        </li>
        <li>
          <a target="_blank" href="https://react-router.run/docs" rel="noreferrer">
            React Router Docs
          </a>
        </li>
      </ul>
    </div>
  )
}
