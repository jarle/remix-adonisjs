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
    <div className='flex flex-col gap-7'>
      <div className='flex flex-col gap-3'>
        <h1 className='text-4xl font-black'>Welcome to Remix</h1>
        <p className='font-thin text-lg'>{message}</p>
      </div>
      <ul className='list-disc'>
        <li>
          <a className='hover:font-semibold'
            target="_blank"
            href="https://remix.run/tutorials/blog"
            rel="noreferrer">
            15m Quickstart Blog Tutorial
          </a>
        </li>
        <li>
          <a className='hover:font-semibold'
            target="_blank"
            href="https://remix.run/tutorials/blog"
            rel="noreferrer">
            Deep Dive Jokes App Tutorial
          </a>
        </li>
        <li>
          <a className='hover:font-semibold'
            target="_blank"
            href="https://remix.run/tutorials/blog"
            rel="noreferrer">
            Remix Docs
          </a>
        </li>
      </ul>

      <div>
        <Popover>
          <PopoverTrigger className="bg-slate-700 hover:bg-slate-800 py-3 px-5 rounded-md hover:shadow-md border-2 text-slate-200">
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
    </div>
  )
}
