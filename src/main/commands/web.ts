import { appConfigPath } from './../../constants/index'
import path from 'path'
import { parse as dotenvParse } from 'dotenv'
import { existsSync, readFileSync, writeFileSync } from 'fs'
import { logger } from '../../logger'
import { runChildPromise, spinnerStart } from '../../utils'
import { chatyDebug } from '../prepare/debug'
import { projectInstall } from 'pkg-install'
const name = 'web-service'
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
    'web',
    'client'
  )
  return webPath
}

const exposeEnv = ['OPEN_AI_KEY', 'WEB_PORT']
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

export async function runWebService (opts: Record<string, string>) {
  console.log('runWebService...')

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
  const installSpin = spinnerStart('starting to install pkgs for web-service...')
  chatyDebug('starting to install pkgs for web-service...')
  await projectInstall({ cwd: webDir })
  installSpin.succeed('install pkgs for web-service succeed!')

  const buildSpin = spinnerStart('starting to build for web-service..')
  chatyDebug('starting to build for web-service...')
  await runChildPromise(name, cmd, buildArgs, options)
  buildSpin.succeed('build for web-service succeed!')

  chatyDebug('starting to run start for web service...')
  await runChildPromise(name, cmd, startArgs, options)
}
