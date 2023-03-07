import { chatyDebug } from './../prepare/debug';
import colors from 'colors'
import { appendFileSync } from 'fs-extra'
import path from 'path'
import os from 'os'
import { appConfigPath, supportLangList } from '../../constants/index'
import { writeHomeEnv } from '../../utils';


export const setProxy = (proxyUrl: string) => {
  if (!proxyUrl) {
    console.log(colors.red('[Error]: please input proxy url!\n'))
    process.exit(1)
  }
  const destEnvPath = path.resolve(appConfigPath, '.env')
  const content = `${os.EOL}CHATY_PROXY=${proxyUrl}${os.EOL}`
  writeHomeEnv('CHATY_PROXY', proxyUrl)
  chatyDebug(`write ${content} to ${destEnvPath}`)
  console.log(colors.green('set proxy succeed!\n'))
  process.exit(0)
}
