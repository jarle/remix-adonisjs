import { ErrorBoundaryComponent } from '../components/error_boundary.js'

export const loader = () => {
  throw new Response('This is a test thrown response', { status: 400 })
}

export const ErrorBoundary = () => <ErrorBoundaryComponent />

export default function page() {
  return null
}
