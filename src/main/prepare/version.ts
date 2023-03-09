import { appEnvConfigPath } from './../../constants/index'
import { fetchApiWithTimeout, readEnvInFile, writeHomeEnv } from '../../utils/index'
import { chatyDebug } from './debug'
import boxen from 'boxen'
import colors from 'colors'
import semver from 'semver'
import os from 'os'
import path from 'path'
import dotenv from 'dotenv'
import fse from 'fs-extra'

import pkg from '../../../package.json'
import { isValidUrl } from '../../utils'

const homedir = os.homedir()
const npmrc = path.resolve(homedir, '.npmrc')
const projectName = 'ichaty'
let npmRegistry = 'https://registry.npmjs.org/'
const LAST_VERSION_CHECK = 'LAST_VERSION_CHECK'
function getRegistry () {
  if (fse.existsSync(npmrc)) {
    const content = fse.readFileSync(npmrc, 'utf8')
    const envConfig = dotenv.parse(content)
    if (isValidUrl(envConfig.registry)) {
      npmRegistry = envConfig.registry
      chatyDebug(`use registry: ${envConfig.registry}`)
    }
  }
}
getRegistry()
function formatTime (timestamp: string | undefined) {
  let t = 0
  if (!timestamp) return t
  try {
    const ti = new Date(Number(timestamp)).toString()
    chatyDebug(`formatTime ${timestamp}, ${ti}`)
    t = Number(timestamp)
  } catch (_) {}
  return t
}
function isNeedCheck (lastTime: number) {
  if (!lastTime) return true
  const now = Date.now()
  if ((now - lastTime) < (1e3 * 60 * 60 * 24 * 7)) {
    chatyDebug('already checked!')
    return false
  }
  return true
}
export async function checkVersion () {
  const lastUpdate = formatTime(readEnvInFile(LAST_VERSION_CHECK, appEnvConfigPath))
  const needCheck = isNeedCheck(lastUpdate)
  if (!needCheck) return
  chatyDebug('checkVersion...')
  const fullUrl = new URL(projectName, npmRegistry).toString()
  const data = await fetchApiWithTimeout(fullUrl, 'GET', {}, {}, 3.5 * 1e3)
  if (data === 'timeout') {
    chatyDebug('fetchApiWithTimeout timeout')
    return
  }
  const { latest } = (data as any)['dist-tags']
  chatyDebug(pkg.version, latest)
  if (semver.valid(latest) && semver.valid(pkg.version)) {
    if (semver.gt(latest, pkg.version)) {
      console.log(colors.green(`chaty latest version: ${latest as string}`))
      console.log(colors.red(`local version: ${pkg.version}`))
      console.log(boxen('please install the latest version with: npm i -g ichaty', { padding: 1 }))
      writeHomeEnv(LAST_VERSION_CHECK, String(Date.now()))
      chatyDebug(`write home .env ${LAST_VERSION_CHECK}, ${Date.now()} succeed!`)
    }
  }
}
