import { chatyDebug } from './../prepare/debug'
import colors from 'colors'
import path from 'path'
import os from 'os'
import { appConfigPath } from '../../constants/index'
import { writeHomeEnv } from '../../utils'

export const setProxy = (proxyUrl: string) => {
  if (!proxyUrl) {
    console.log(colors.red('[Error]: please input proxy url!\n'))
    process.exit(1)
  }
  if (proxyUrl === 'default') {
    proxyUrl = 'https://cors-anywhere-drxp.onrender.com'
  }
  const destEnvPath = path.resolve(appConfigPath, '.env')
  const content = `${os.EOL}CHATY_PROXY=${proxyUrl}${os.EOL}`
  writeHomeEnv('CHATY_PROXY', proxyUrl)
  chatyDebug(`write ${content} to ${destEnvPath}`)
  console.log(colors.green('set proxy succeed!\n'))
  process.exit(0)
}
