import { cli } from '@remix-run/dev'
import fs from 'node:fs'

export default async function myHook() {
  await cli.run(['vite:build'])
  fs.mkdirSync('build/public/assets', { recursive: true })
  fs.renameSync('build/remix/client', 'build/public/assets')
}
