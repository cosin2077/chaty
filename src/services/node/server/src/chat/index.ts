import { chatWithGPT, messageManager } from "../utils";

export async function resetMessage(user: string) {
  messageManager.clearMessage(user);
}
export async function sendMessage(message: string, user: string) {
  try {
    messageManager.sendMessage(message, user);
    const messages = messageManager.getMessages(user);
    const completion = await chatWithGPT(messages!);
    const answer = completion.choices[0].message.content;
    messageManager.concatAnswer(answer, user);
    return answer;
  } catch (err) {
    console.log((err as Error).message);
    messageManager.popMessage(user);
    let append = "";
    try {
      let errorBody = (err as Error & { response: any })?.response?.data;
      console.log(errorBody);
      append = 'oops, something wrong, please try again later or refresh the page!'
    } catch (_) {}
    return append ? append : (err as Error).message;
  }
}
