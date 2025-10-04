import app from '@adonisjs/core/services/app'
import type { AssemblerHookHandler } from '@adonisjs/core/types/app'
import { execa } from 'execa'
import fs from 'node:fs'
import path from 'node:path'

/**
 *
 * The hook is responsible for launching the react-router build command when the application is built
 */
export default async function remixBuildHook({ logger }: Parameters<AssemblerHookHandler>[0]) {
  logger.info('building React Router app with vite')
  await execa('react-router', ['build'], {
    preferLocal: true, // use ./node_modules/.bin/react-router
    stdio: 'inherit',
  })
  const config = await resolveViteConfig()
  // const cli = await import('@remix-run/dev')
  // await cli.run(['vite:build'])
  const assetsDir = config?.build?.assetsDir ?? 'assets'
  const source = app.makePath('build', 'remix', 'client', assetsDir)
  const target = app.makePath('build', 'public', assetsDir, config?.base ?? '/')
  moveDirectorySync(source, target)
}

function moveDirectorySync(source: string, target: string) {
  fs.mkdirSync(target, { recursive: true })

  const entries = fs.readdirSync(source, { withFileTypes: true })

  for (let entry of entries) {
    const sourcePath = path.join(source, entry.name)
    const targetPath = path.join(target, entry.name)

    if (entry.isDirectory()) {
      moveDirectorySync(sourcePath, targetPath)
    } else {
      fs.renameSync(sourcePath, targetPath)
    }
  }
}

export async function resolveViteConfig() {
  let vite = await import('vite')

  let viteConfig = await vite.loadConfigFromFile({
    command: 'build',
    mode: 'production',
  })

  if (typeof viteConfig?.config.build?.manifest === 'string') {
    throw new Error('Custom Vite manifest paths are not supported')
  }

  return viteConfig?.config
}
