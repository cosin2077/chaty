import { confirmReadline } from '../../utils'
import { resetMessage, sendMessage } from '../../utils/useChatAPI'

export const runCommandLineService = async () => {
  console.log('run command-line bot service...')
  let stop = false
  const user = 'user'
  while (!stop) {
    const { answer, close } = await confirmReadline(
      'please input your question: ',
      /ye/gim
    )
    if (answer.trim() === '') {
      console.clear()
      continue
    }
    if (/exit|quit|退出/gim.test(answer)) {
      stop = true
      close()
      console.log('quitting now...')
      setTimeout(() => {
        process.exit(0)
      }, 200)

      break
    }
    if (/reset|重置/gim.test(answer)) {
      await resetMessage(user)
      continue
    }
    console.log('\x1b[36m%s\x1b[0m', answer)
    const res = await sendMessage(answer, user)
    console.log('\x1b[33m%s\x1b[0m', res)
  }
}
