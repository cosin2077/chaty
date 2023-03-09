import { registerCommand } from './prepare/command'
import { chatyDebug } from './prepare/debug'
import { checkVersion } from './prepare/version'

async function main () {
  await checkVersion()
  await registerCommand()
}

main().catch((err) => {
  chatyDebug((err as Error).message)
})
