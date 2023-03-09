import commander from 'commander'
import colors from 'colors'
import pkg from '../../../package.json'
import { runWebService } from '../commands/web'
import { runWechatService } from '../commands/wechat'
import { runNodeService } from '../commands/node'
import { runCommandLineService } from '../commands/commandLine'
import { runLogin } from './login'
import { setLang } from '../commands/lang'
import { setProxy } from '../commands/proxy'
import { checkKey } from './checkKey'
import { chatyDebug } from './debug'

const program = new commander.Command()

export async function registerCommand () {
  program
    .name(Object.keys(pkg.bin)[0])
    .usage('<command> [options]')
    .version(pkg.version)
    .description(
      `
Chaty supports various services such as:
    chaty run command (command-line chatbot)
    chaty run web (private ChatGPT website services)
    chaty run wechat (WeChat chatbot)
    chaty run node (NodeJS Api service)
    stay tune! more services are under construction...
To get started, just run "chaty login <openAIKey>" and enter your openAIKey. Once login is successful, you can begin exploring.`
    )
    .option('-d, --debug', 'debug mode', false)

  program
    .command('run [service]')
    .description('run [web/command/node/wechat/etc] service')
    .option('-p, --port <port>', 'specify web/node service port')
    .action(async (name: string, options, command) => {
      checkKey('OPEN_AI_KEY')
      chatyDebug('run:', name, options)
      switch (name) {
        case name?.match(/web/im)?.input:
          await runWebService(options)
          break
        case name?.match(/command/im)?.input:
          await runCommandLineService()
          break
        case name?.match(/node(js)?|api/im)?.input:
          await runNodeService(options)
          break
        case name?.match(/wechat/im)?.input:
          await runWechatService()
          break
        default:
          console.log(colors.red(`[Error]: unknown service ${name}!\n`))
          console.log(
            colors.green('Only support: web command node wechat telegram')
          )
          process.exit(1)
      }
    })

  program
    .command('login [openAIKey]')
    .description(
      'login with openAIKey. You can find your API key at https://platform.openai.com/account/api-keys.'
    )
    .action((key, options, command) => {
      chatyDebug('login:', key, options)
      runLogin(key)
    })

  program
    .command('lang [language]')
    .description(
      'set display language, English and Chinese are supported at present'
    )
    .action((key, options, command) => {
      chatyDebug('lang:', key, options)
      setLang(key)
    })

  program
    .command('proxy [proxyUrl]')
    .description(
      'set proxy for openai request!'
    )
    .action((key, options, command) => {
      chatyDebug('proxy:', key, options)
      setProxy(key)
    })

  program.on('option:debug', () => {
    if (program.opts().debug) {
      process.env.LOG_LEVEL = 'verbose'
    } else {
      process.env.LOG_LEVEL = 'info'
    }
  })
  program.on('command:*', (obj: string[]) => {
    const availableCommands = program.commands.map((command) => command.name())
    if (!availableCommands.includes(obj[0])) {
      console.log(colors.red(`[Error]Unknown command: ${obj[0]}`))
      console.log()
      console.log(
        colors.green(`Available commands: ${availableCommands.join(',')}`)
      )
      process.exit(1)
    }
  })
  program.parse(process.argv)
  if (program.args.length < 1) {
    program.outputHelp()
    console.log()
  }
}
