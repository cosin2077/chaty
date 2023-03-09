import axios, { type AxiosResponse } from 'axios'
import readline from 'readline'
import os from 'os'
import dotenv from 'dotenv'
import child from 'child_process'
import { chatyDebug } from '../main/prepare/debug'
import { appConfigPath } from '../constants'
import path from 'path'
import ora from 'ora'
import { ensureFileSync, readFileSync, writeFileSync } from 'fs-extra'
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

export const confirmReadline = async (
  question: string,
  passReg: RegExp
): Promise<any> => await new Promise((resolve) => {
  rl.question(question, (answer: string) => {
    if (passReg.test(answer) || answer === '' /* enter key */) {
      resolve({ confirm: true, answer, close: () => { rl.close() } }); return
    }
    resolve({ confirm: false, answer, close: () => { rl.close() } })
  })
})
export const asyncSleep = async (number: number) => {
  await new Promise((resolve) => {
    setTimeout(resolve, number)
  })
}
export const defaultUserAgent = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:89.0) Gecko/20100101 Firefox/89.0',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.1 Safari/605.1.15',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36 Edg/91.0.864.59',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.107 Safari/537.36 ',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:89.0) Gecko/20100101 Firefox/89.0',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:89.0) Gecko/20100101 Firefox/89.0',
  'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:89.0) Gecko/20100101 Firefox/89.0',
  'Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:89.0) Gecko/20100101 Firefox/89.0',
  'Mozilla/5.0 (Android 9; Mobile; rv:68.0) Gecko/68.0 Firefox/88.0'
]
export const randomUserAgent = () => defaultUserAgent[Math.trunc(Math.random() * defaultUserAgent.length)]
export const fetchApi = async (
  apiUrl: string,
  method = 'GET',
  params: any,
  body: any
) => {
  let defineHeaders = {}
  let type: any = { 'Content-Type': 'application/json' }
  if (
    (params?.type && params.type !== 'json') ||
    (body?.type && body.type !== 'json')
  ) {
    type = {}
  }
  if (params?.headers) {
    defineHeaders = { ...defineHeaders, ...params.headers }
    delete params.headers
  }
  if (body?.headers) {
    defineHeaders = { ...defineHeaders, ...body.headers }
    delete body.headers
  }
  if (params) delete params.type
  if (body) delete body.type
  const headers = {
    ...type,
    ...defineHeaders,
    'User-Agent': randomUserAgent()
  }
  const options = {
    method,
    headers,
    params,
    signal: params.signal,
    data: body
  }
  return await axios(apiUrl, options).then((res: AxiosResponse) => res.data)
}

export const fetchApiWithTimeout = async (
  apiUrl: string,
  method = 'GET',
  params: any,
  body: any,
  timeout: string | number
) => await new Promise((resolve, reject) => {
  try {
    const start = ora('starting to check chaty version...').start()
    const controller = new AbortController()
    if (params) {
      params.signal = controller.signal
    }
    const timer = setTimeout(() => {
      controller.abort()
      resolve('timeout')
      start.fail('check chaty version timeout')
    }, Number(timeout))
    fetchApi(apiUrl, method, params, body)
      .then((res) => {
        resolve(res)
        start.succeed('check chaty version succeed')
        clearTimeout(timer)
      })
      .catch(reject)
  } catch (err) {
    chatyDebug((err as Error).message)
    reject(err)
  }
})

export const runChildProcess = (
  name: string,
  execPath: string,
  args: string[],
  options: any
) => {
  const childProcess = child.spawn(execPath, args, options)
  chatyDebug(`runChildProcess: ${name}, pid: ${String(childProcess.pid)}`)
  childProcess.stdout.on('data', (data) => {
    console.log(data.toString())
  })
  childProcess.stderr.on('data', (data) => {
    console.log(data.toString())
  })
  childProcess.on('exit', (code) => {
    chatyDebug(`childProcess.on('exit'): ${name}, data: ${String(code)}`)
  })
  return childProcess
}
export const runChildPromise = async (
  name: string,
  execPath: string,
  args: string[],
  options: any
) => await new Promise((resolve, reject) => {
  const childProcess = child.spawn(execPath, args, options)
  chatyDebug(`runChildProcess: ${name}, pid: ${String(childProcess.pid)}`, execPath, args)
  let output = ''
  childProcess.stdout.on('data', (data) => {
    output += data.toString() as string
    console.log(data.toString() as string)
  })
  let errorOut = ''
  childProcess.stderr.on('data', (data) => {
    errorOut += data.toString() as string
  })
  childProcess.on('exit', (code) => {
    chatyDebug(`childProcess.on('exit'): ${name}, data: ${String(code)}`)
    chatyDebug('output', output)
    if (code !== 0) {
      chatyDebug('errorOut', errorOut)
    }
    resolve(output)
  })
  childProcess.on('error', (err) => {
    chatyDebug(`childProcess.on('error'): ${name},`, err)
    reject(err)
  })
  return childProcess
})
export const runChildProcessSync = (execStr: string, options: any) => {
  try {
    const res = child.execSync(execStr, options)
    chatyDebug(res.toString())
  } catch (err) {
    console.log(err)
  }
}
export const writeHomeEnv = function (prop: string, value: string) {
  const destEnvPath = path.resolve(appConfigPath, '.env')
  ensureFileSync(destEnvPath)
  const destKey = dotenv.parse(readFileSync(destEnvPath, 'utf-8'))
  destKey[prop] = value
  let newContent = ''
  for (const line in destKey) {
    const content = `${os.EOL}${line}=${destKey[line]}${os.EOL}`
    newContent += content
  }
  writeFileSync(destEnvPath, newContent, 'utf-8')
}

export function spinnerStart (loadingMsg = 'loading') {
  const spinner = ora({
    text: `${loadingMsg}...`,
    spinner: {
      interval: 80,
      frames: '|/-\\'.split('')
    }
  }).start()
  return spinner
}
export const isValidUrl = (urlStr: string) => {
  try {
    return Boolean(new URL(urlStr))
  } catch (e) {
    return false
  }
}
export const readEnvInFile = (prop: string, envPath: string) => {
  if (!prop || !envPath) throw new Error('prop and envPath are needed!')
  const envConfig = dotenv.parse(readFileSync(envPath, 'utf-8'))
  return envConfig[prop]
}
