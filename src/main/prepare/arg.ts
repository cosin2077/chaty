import minimist from 'minimist'
import createDebug from 'debug'
export const debug = createDebug('chaty')

export const argv = minimist(process.argv.slice(2))
