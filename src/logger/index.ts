import pino from 'pino'
import stream from 'stream'
import childProcess from 'child_process'
import { appLogPath, appName } from '../constants'

const cwd = process.cwd()
const logPath = appLogPath
const { env } = process

const logThrough = new stream.PassThrough()
export const logger = pino({ name: appName }, logThrough)
const child = childProcess.spawn(
  process.execPath,
  [
    require.resolve('pino-tee'),
    'warn',
    `${logPath}/warn.log`,
    'error',
    `${logPath}/error.log`,
    'fatal',
    `${logPath}/fatal.log`,
    'info',
    `${logPath}/info.log`
  ],
  { cwd, env, stdio: ['pipe', 'inherit', 'inherit'] }
)
logThrough.pipe(child.stdin)
