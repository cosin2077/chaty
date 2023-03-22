import { chatyDebug } from '../prepare/debug'
import colors from 'colors'
import path from 'path'
import os from 'os'
import { appConfigPath } from '../../constants/index'
import { writeHomeEnv } from '../../utils'

export const setSystem = (system: string) => {
  if (!system) {
    console.log(colors.red('[Error]: please input system role!\n'))
    process.exit(1)
  }

  const destEnvPath = path.resolve(appConfigPath, '.env')
  const content = `${os.EOL}CHATY_SYSTEM_ROLE=${system}${os.EOL}`
  writeHomeEnv('CHATY_SYSTEM_ROLE', `"${system}"`)
  chatyDebug(`write ${content} to ${destEnvPath}`)
  console.log(colors.green('set system succeed!\n'))
  process.exit(0)
}
