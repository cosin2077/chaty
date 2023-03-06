import { chatyDebug } from './debug'
import colors from 'colors'
import { existsSync, readFileSync } from 'fs-extra'
import path from 'path'
import dotenv from 'dotenv'
import { appConfigPath } from '../../constants/index'
import { writeHomeEnv } from '../../utils'
function trimUndef (str: string | undefined) {
  return str === undefined || str === null || str === 'undefined' ? '' : str
}

export const runLogin = (key: string | undefined) => {
  const destEnvPath = path.resolve(appConfigPath, '.env')
  const currentEnvPath = path.resolve(process.cwd(), '.env')
  let keyInCurrent: dotenv.DotenvParseOutput = {}
  chatyDebug(destEnvPath, currentEnvPath)
  if (existsSync(currentEnvPath)) {
    keyInCurrent = dotenv.parse(readFileSync(currentEnvPath, 'utf-8'))
  }
  const writeInKey =
    trimUndef(key) ||
    trimUndef(keyInCurrent.OPEN_AI_KEY) ||
    trimUndef(process.env.OPEN_AI_KEY)

  if (writeInKey) {
    writeHomeEnv('OPEN_AI_KEY', writeInKey)
    console.log(colors.green('login succeed!\n'))
    console.log(
      colors.green('now you can try chaty run web/node/command/etc...')
    )
    process.exit(0)
  } else {
    console.log(
      colors.red(
        '[Error]: login need key! or OPEN_AI_KEY is in current directory .env file!\nYou can find your API key at https://platform.openai.com/account/api-keys.'
      )
    )
    process.exit(1)
  }
}
