import os from 'os'
import path from 'path'

export const appName = 'chaty'
export const appConfigDirName = '.chaty'
export const appConfigLog = 'logs'
export const appConfigPath = path.resolve(os.homedir(), appConfigDirName)
export const appLogPath = path.resolve(appConfigPath, appConfigLog)

export const runtimeParams = (() => {
  const obj = {
    CHATY_LANG: 'en',
    ENGINE: 'gpt-3.5-turbo'
  }
  return {
    getVar (prop: keyof typeof obj) {
      return obj[prop]
    },
    setVar (prop: keyof typeof obj, value: any) {
      obj[prop] = value
    }
  }
})()

export const supportLangList = ['en', 'zh']
