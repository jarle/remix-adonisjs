import { ErrorBoundaryComponent } from '../components/error_boundary.js'

export const loader = () => {
  throw new Error('This is a test error')
}

export const ErrorBoundary = () => <ErrorBoundaryComponent />

export default function page() {
  return null
}
