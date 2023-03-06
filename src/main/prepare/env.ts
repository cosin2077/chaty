import { runtimeParams, supportLangList } from './../../constants/index'
import dotenv from 'dotenv'
import path from 'path'
import { appConfigPath } from '../../constants/index'
import { writeHomeEnv } from '../../utils'
dotenv.config({ path: path.resolve(appConfigPath, '.env') })

const { CHATY_LANG, WEB_PORT, NODE_PORT } = process.env
if (!WEB_PORT) {
  writeHomeEnv('WEB_PORT', '9522')
}
if (!NODE_PORT) {
  writeHomeEnv('NODE_PORT', '9523')
}
if (
  (CHATY_LANG !== undefined && CHATY_LANG !== null && CHATY_LANG !== '') &&
  supportLangList.includes(CHATY_LANG)
) {
  runtimeParams.setVar('CHATY_LANG', CHATY_LANG)
}
/**
 * OPEN_AI_KEY
 * CHATY_LANG
 * ENGINE(MODEL)
 * LAST_VERSION_CHECK_TIME
 * ...
 */
