import { json, type LoaderFunctionArgs, type MetaFunction } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { Popover, PopoverContent, PopoverTrigger } from '~/components/ui/popover'

export const meta: MetaFunction = () => {
  return [{ title: 'New Remix App' }, { name: 'description', content: 'Welcome to Remix!' }]
}

export const loader = async ({ context }: LoaderFunctionArgs) => {
  const service = await context.make('hello_service')
  return json({ message: service.getMessage() })
}

export default function Index() {
  const { message } = useLoaderData<typeof loader>()

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', lineHeight: '1.8' }}>
      <h1>Welcome to Remix</h1>
      <p>{message}</p>
      <ul>
        <li>
          <a target="_blank" href="https://remix.run/tutorials/blog" rel="noreferrer">
            15m Quickstart Blog Tutorial
          </a>
        </li>
        <li>
          <a target="_blank" href="https://remix.run/tutorials/jokes" rel="noreferrer">
            Deep Dive Jokes App Tutorial
          </a>
        </li>
        <li>
          <a target="_blank" href="https://remix.run/docs" rel="noreferrer">
            Remix Docs
          </a>
        </li>
      </ul>

      <Popover>
        <PopoverTrigger className="bg-slate-700 rounded py-1 px-2 border-2 text-slate-200">
          Open shadcn/ui popover
        </PopoverTrigger>
        <PopoverContent>
          Find more components in{' '}
          <a
            className="text-slate-500"
            target="_blank"
            href="https://ui.shadcn.com/docs/components/accordion"
          >
            here
          </a>
          .
        </PopoverContent>
      </Popover>
    </div>
  )
}
