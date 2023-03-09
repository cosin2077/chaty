import os from 'os'
import path from 'path'

export const appName = 'chaty'
export const appEnvName = '.env'
export const appConfigDirName = '.chaty'
export const appConfigLog = 'logs'
export const appConfigPath = path.resolve(os.homedir(), appConfigDirName)
export const appEnvConfigPath = path.resolve(appConfigPath, appEnvName)
export const appLogPath = path.resolve(appConfigPath, appConfigLog)

function getProperty<T, K extends keyof T> (obj: T, key: K): T[K] {
  return obj[key]
}
function setProperty<T, K extends keyof T> (obj: T, key: K, value: T[K]): void {
  obj[key] = value
}
export const runtimeParams = (() => {
  const obj = {
    CHATY_LANG: 'en',
    ENGINE: 'gpt-3.5-turbo'
  }
  return {
    getVar (prop: keyof typeof obj) {
      return getProperty(obj, prop)
    },
    setVar (prop: keyof typeof obj, value: string) {
      setProperty(obj, prop, value)
    }
  }
})()

export const supportLangList = ['en', 'zh']
