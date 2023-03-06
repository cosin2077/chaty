
import createDebug from 'debug'
import pkg from '../../../package.json'
import { argv } from './arg'

export const chatyDebug = createDebug('chaty')
export let isDebug = false

if (argv.d || argv.debug || process.env.DEBUG) {
  isDebug = true
  chatyDebug.enabled = true
}
chatyDebug(`starting ${pkg.name} with arguments:`, argv)
