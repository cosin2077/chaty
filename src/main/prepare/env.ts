import { runtimeParams, supportLangList } from './../../constants/index'
import dotenv from 'dotenv'
import path from 'path'
import { appConfigPath } from '../../constants/index'
dotenv.config({ path: path.resolve(appConfigPath, '.env') })

const { CHATY_LANG } = process.env
if (
  (CHATY_LANG !== undefined && CHATY_LANG !== null && CHATY_LANG !== '') &&
  supportLangList.includes(CHATY_LANG)
) {
  runtimeParams.setVar('CHATY_LANG', process.env.CHATY_LANG)
}
/**
 * OPEN_AI_KEY
 * CHATY_LANG
 * ENGINE(MODEL)
 * LAST_VERSION_CHECK_TIME
 * ...
 */
