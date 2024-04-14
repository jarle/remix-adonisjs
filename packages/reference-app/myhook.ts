import { spawn } from 'node:child_process'
import fs from 'node:fs'

export default async function myHook() {
  await runCommand('remix vite:build')
  // const cli = await import('@remix-run/dev')
  // await cli.run(['vite:build'])
  fs.mkdirSync('build/public/assets', { recursive: true })
  fs.renameSync('build/remix/client', 'build/public/assets')
}

async function runCommand(command: string, args = []) {
  return new Promise((resolve, reject) => {
    const subprocess = spawn(command, args, { shell: true })
    let stdout = ''
    let stderr = ''

    subprocess.stdout.on('data', (data) => {
      stdout += data.toString()
    })

    subprocess.stderr.on('data', (data) => {
      stderr += data.toString()
    })

    subprocess.on('close', (code) => {
      if (code === 0) {
        resolve(stdout)
      } else {
        reject(new Error(`Command failed with code ${code}: ${stderr}`))
      }
    })

    subprocess.on('error', (err) => {
      reject(new Error(`Failed to start command: ${err.message}`))
    })
  })
}
