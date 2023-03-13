const dotnev = require("dotenv");
dotnev.config();
import { fetchApi } from "./utils";

const chatGPTUrl = "https://api.openai.com/v1/chat/completions";
const chatWithGPT = async (messages: any[]) => {
  const headers: Record<string, any> = {
    Authorization: `Bearer ${process.env.OPEN_AI_KEY}`,
  };
  let apiUrl = chatGPTUrl
  let { CHATY_PROXY } = process.env
  if (CHATY_PROXY) {
    if (CHATY_PROXY[CHATY_PROXY.length - 1] !== '/') {
      CHATY_PROXY += '/'
    }
    headers.origin = 'https://app.uniswap.org'
    apiUrl = CHATY_PROXY + chatGPTUrl
  }
  const answer = await fetchApi(
    apiUrl,
    "POST",
    { headers },
    {
      model: "gpt-3.5-turbo",
      messages,
    }
  );
  return answer;
};

export const messageManager = (() => {
  let messageMap: Record<string, any[]> = {};
  let usageList: Record<string, any[]> = {};
  return {
    addUsage: (usage: any, user: string) => {
      if (!usageList[user]) {
        usageList[user] = []
      }
      usageList[user].push(usage);
    },
    getUsage: (user: string) => {
      if (usageList[user]) {
        return usageList[user]
      }
    },
    getUsagePrint: (user: string) => {
      const allUsage = usageList[user]
      const usage = allUsage[allUsage.length - 1]
      if (usage) {
        let ret = ''
        for (let prop in usage) {
          switch (prop) {
            case 'prompt_tokens': ret = `您的输入：${usage.prompt_tokens}\n`; break
            case 'completion_tokens': ret = `对话已用：${usage.completion_tokens}\n`; break
            case 'total_tokens': ret = `共计：${usage.total_tokens}\n`; break
          }
        }
        return ret
      }
    },
    sendMessage: (content: string, user: string) => {
      if (!messageMap[user]) {
        messageMap[user] = [];
      }
      messageMap[user].push({ role: "user", content });
    },
    concatAnswer: (content: string, user: string) => {
      if (!messageMap[user]) {
        messageMap[user] = [];
      }
      messageMap[user].push({ role: "assistant", content });
    },
    getMessages: (user: string) => {
      return messageMap[user];
    },
    shiftMessage: (user: string) => {
      messageMap[user].shift();
    },
    popMessage: (user: string) => {
      messageMap[user].pop();
    },
    clearMessage: (user: string) => {
      delete messageMap[user];
    },
  };
})();

export async function resetMessage(user: string) {
  messageManager.clearMessage(user);
}
export async function sendMessage(message: string, user: string) {
  try {
    messageManager.sendMessage(message, user);
    const messages = messageManager.getMessages(user);
    console.log("-----------newMessages----------");
    console.log(messages);
    console.log("-----------newMessages----------");
    const completion = await chatWithGPT(messages);
    const answer = completion.choices[0].message.content;

    console.log("-----------newAnswers----------");
    console.log(answer);
    console.log("-----------newAnswers----------");
    messageManager.concatAnswer(answer, user);
    messageManager.addUsage(completion.usage, user);
    return answer;
  } catch (err) {
    messageManager.popMessage(user);
    console.log((err as Error).message);
    let errorBody = (err as Error & { response: any })?.response?.data;
    console.log(errorBody);
    let append = "[errored]";
    try {
      if (errorBody.error.code === "context_length_exceeded") {
        append = "[errored][context_length_exceeded]";
      }
      errorBody = JSON.stringify(errorBody);
    } catch (_) { }
    return (err as Error).message + "   " + errorBody + "[errored]";
  }
}
