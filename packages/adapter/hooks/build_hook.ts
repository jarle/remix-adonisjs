import type { AssemblerHookHandler } from '@adonisjs/core/types/app'
import { cli } from '@remix-run/dev'
import fs from 'node:fs'

/**
 *
 * The hook is responsible for launching the remix vite:build command when the application is built
 */
export default async function remixBuildHook({ logger }: Parameters<AssemblerHookHandler>[0]) {
  logger.info('building remix app with vite')
  await cli.run(['vite:build'])
  fs.mkdirSync('build/public/assets', { recursive: true })
  fs.renameSync('build/remix/client', 'build/public/assets')
}
