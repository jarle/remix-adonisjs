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
          <a target="_blank" href="https://matstack.dev/react-adonisjs/" rel="noreferrer">
            react-adonisjs Docs
          </a>
        </li>
        <li>
          <a target="_blank" href="https://docs.adonisjs.com/" rel="noreferrer">
            AdonisJS Docs
          </a>
        </li>
        <li>
          <a target="_blank" href="https://reactrouter.com/" rel="noreferrer">
            React Router Docs
          </a>
        </li>
      </ul>
    </div>
  )
}
