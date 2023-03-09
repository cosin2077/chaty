import path from 'path'
import { parse as dotenvParse } from 'dotenv'
import { existsSync, readFileSync, writeFileSync } from 'fs'
import { appConfigPath } from '../../constants/index'
import { projectInstall } from 'pkg-install'
import { logger } from '../../logger'
import { runChildPromise, spinnerStart } from '../../utils'
import { chatyDebug } from '../prepare/debug'
const name = 'node-service'
let cmd = 'npm'
if (/win32|win64/.test(process.platform)) {
  cmd = 'npm.cmd'
} else {
  cmd = 'npm'
}
async function getWebServiceDir () {
  const webPath = path.resolve(
    __dirname,
    '..',
    '..',
    'services',
    'node',
    'server'
  )
  return webPath
}

const exposeEnv = ['OPEN_AI_KEY', 'NODE_PORT']
async function copyEnv (from: string, to: string) {
  const fromEnv = path.resolve(from, '.env')
  const toEnv = path.resolve(to, '.env')
  const checkFrom = existsSync(fromEnv)
  chatyDebug(`copy from ${fromEnv} to ${toEnv}`)
  if (!checkFrom) {
    chatyDebug(`[Error]: cannot find .env file in ${from}!`)
    logger.fatal(` .env not exists!${fromEnv}`)
    return
  }
  const content = readFileSync(fromEnv, 'utf-8')
  const parsed = dotenvParse(content)
  let newContent = ''
  for (const prop in parsed) {
    if (exposeEnv.includes(prop)) {
      newContent += `${prop}=${parsed[prop]}\n`
    }
  }
  writeFileSync(toEnv, newContent, 'utf-8')
}

export async function runNodeService (opts: Record<string, string>) {
  console.log('runNodeService...')

  const webDir = await getWebServiceDir()
  await copyEnv(appConfigPath, webDir)

  const buildArgs: string[] = ['run', 'build']
  const startArgs: string[] = ['run', 'start']
  const options: Record<string, any> = {
    cwd: webDir,
    env: { ...process.env }
  }
  if (opts.port) {
    options.env.S_WEB_PORT = opts.port
  }
  const installSpin = spinnerStart('starting to install pkgs for NodeJS API service...')
  chatyDebug('starting to install pkgs for NodeJS API service...')
  await projectInstall({
    cwd: webDir
  })
  installSpin.succeed('install pkgs for NodeJS API service succeed!')
  const buildSpin = spinnerStart('starting to build for NodeJS API service...')

  chatyDebug('starting to build for NodeJS API service...')
  await runChildPromise(name, cmd, buildArgs, options)
  buildSpin.succeed('build for NodeJS API service succeed!')

  chatyDebug('starting to run start for web service...')
  await runChildPromise(name, cmd, startArgs, options)
}
