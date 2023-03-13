import { confirmReadline } from '../../utils'
import { resetMessage, sendMessage, messageManager } from '../../utils/useChatAPI'

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
    if (/^(usage|额度|用量)/gim.test(answer)) {
      const res = await messageManager.getUsage(user);
      if (Array.isArray(res)) {
        console.log(res[res.length - 1])
      }
      continue
    }
    console.log('\x1b[36m%s\x1b[0m', answer)
    const res = await sendMessage(answer, user)
    console.log('\x1b[33m%s\x1b[0m', res)
  }
}
