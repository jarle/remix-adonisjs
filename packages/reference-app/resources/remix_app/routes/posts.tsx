import { Await, useLoaderData } from 'react-router'
import { Suspense } from 'react'

export const loader = async () => {
  // simulate a slow loader
  return {
    lazyPosts: new Promise<string[]>((resolve) => {
      setTimeout(() => {
        resolve(['Post 1', 'Post 2'])
      }, 100)
    }),
  }
}

export default function Page() {
  const { lazyPosts } = useLoaderData<typeof loader>()
  return (
    <>
      <h1>Posts</h1>
      <Suspense
        fallback={
          <div id="loader" role="alert" aria-live="assertive" aria-busy="true">
            Loading...
          </div>
        }
      >
        <Await resolve={lazyPosts}>
          {(posts) =>
            posts.map((p) => (
              <div className="post" key={p}>
                {p}
              </div>
            ))
          }
        </Await>
      </Suspense>
    </>
  )
}
