import { chatyDebug } from '../prepare/debug'
import colors from 'colors'
import path from 'path'
import os from 'os'
import { appConfigPath } from '../../constants/index'
import { writeHomeEnv } from '../../utils'
import boxen from 'boxen'

const completionModel = [
  'babbage',
  'davinci',
  'text-davinci-001',
  'ada',
  'curie-instruct-beta',
  'code-cushman-001',
  'text-ada-001',
  'text-davinci-003',
  'text-curie-001',
  'davinci-instruct-beta',
  'code-davinci-002',
  'text-davinci-002',
  'text-babbage-001',
  'curie'
]
const chatCompletionModel = [
  'gpt-3.5-turbo'
]
const supportModelList: string[] = [...chatCompletionModel, ...completionModel]
function findModelByName (name: string) {
  const find = supportModelList.find((n: string) => n === name)
  return find
}

export const listModel = () => {
  console.log(colors.green('use chaty model <modelName> to specify your model!\nsupport models:\n'))
  console.log(boxen(supportModelList.join('\n'), { padding: 1 }))
  process.exit(0)
}

export const setModel = (modelName: string) => {
  const model = findModelByName(modelName)

  if (!model) {
    console.log(colors.red('[Error]: invalid model name!\n'))
    listModel()
    process.exit(1)
  }
  const destEnvPath = path.resolve(appConfigPath, '.env')
  const content = `${os.EOL}CHATY_MODEL=${model}${os.EOL}`
  writeHomeEnv('CHATY_MODEL', model)
  chatyDebug(`write ${content} to ${destEnvPath}`)
  console.log(colors.green(`set model ${model} succeed!\n`))
  process.exit(0)
}
