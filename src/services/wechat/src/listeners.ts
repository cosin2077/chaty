import {
  ContactInterface,
  ContactSelfInterface,
  FriendshipInterface,
  MessageInterface,
  WechatyInterface,
} from "wechaty/impls";
import { asyncSleep } from "./utils";
import { sendMessage, resetMessage } from "./gptTurboApi";
import { Wechaty } from "wechaty";

function onScan(qrcode: string, status: number) {
  require("qrcode-terminal").generate(qrcode, { small: true }); // 在console端显示二维码
  const qrcodeImageUrl = [
    "https://wechaty.js.org/qrcode/",
    encodeURIComponent(qrcode),
  ].join("");
  console.log(qrcodeImageUrl);
}
async function onLogin(user: ContactSelfInterface) {
  console.log(`User ${user} logged in`);
}
function onLogout(user: ContactSelfInterface) {
  console.log(`${user} 已经登出`);
}
async function onFriendship(
  friendship: FriendshipInterface,
  bot: WechatyInterface
) {
  try {
    console.log(`received friend event.`);
    switch (friendship.type()) {
      case bot.Friendship.Type.Receive:
        await friendship.accept();
        break;
      case bot.Friendship.Type.Confirm:
        console.log(`friend ship confirmed`);
        break;
    }
  } catch (e) {
    console.error(e);
  }
}
let gptUserList: ContactInterface[] = [];
async function onMessage(message: MessageInterface, bot: WechatyInterface) {
  const contact = message.talker();
  const room = message.room();
  let text = message.text();
  if (room) {
    try {
      const topic = await room.topic()
      const selfName = bot.currentUser.name()
      console.log(`room topic is : ${topic}, ${text}`)
      if (text.indexOf(`@${selfName}`) !== -1) {
        const username = `${topic.toString()}-${contact.toString()}`
        let reply = await sendMessage(text, username);
        if (/\[errored\]$/gim.test(reply)) {
          reply = "遇到问题了，请稍后再试！";
        }
        if (/\[context_length_exceeded\]$/gim.test(reply)) {
          reply = "本轮会话长度太长啦，我记不住这么多东西，请重试！";
        }
        console.log(reply);
        room.say(reply, contact)
      }
    } catch (err) {
      console.log((err as Error).message);
    }
    return
  }
  if (message.self()) return;
  text = text.trim();
  console.log(
    `[${new Date().toLocaleString()}] contact: ${contact}, text:${text}, room: ${room}`
  );
  if (/(你|您)好$/gim.test(text) || /hello/gim.test(text)) {
    if (!gptUserList.includes(contact)) {
      message.say(
`
欢迎使用Chaty超级智能机器人~
您可以输入:
开始|start: 进入对话
重置|reset: 重置对话(开始一段新对话)
额度|usage|quota : 显示额度信息
退出|exit : 退出对话
祝您旅途愉快！
`
      );
      return;
    }
  }
  if (/^(开始|start)/gim.test(text)) {
    if (!gptUserList.includes(contact)) {
      gptUserList.push(contact);
      text = "你好";
    }
  }
  if (/^(clear|退出|exit|quit)/gim.test(text)) {
    gptUserList = gptUserList.filter((user) => user !== contact);
    await resetMessage(contact.toString());
    await message.say("退出成功！");
    return;
  }
  if (/^(reset|重置)/gim.test(text)) {
    await resetMessage(contact.toString());
    await message.say("重置对话成功！");
    await asyncSleep(1 * 1e3);
    await message.say("您可以输入新的内容了！");
    return;
  }
  if (gptUserList.includes(contact) && text) {
    console.log(
      `${contact} call gpt api @${new Date().toLocaleString()} with text: ${text}`
    );
    let reply = await sendMessage(text, contact.toString());
    if (/\[errored\]$/gim.test(reply)) {
      reply = "遇到问题了，请稍后再试，或输入 重置 试试！";
      console.log(reply);
    }
    if (/\[context_length_exceeded\]$/gim.test(reply)) {
      reply = "本轮会话长度太长啦，我记不住这么多东西，抱歉！请输入 重置 试试！";
      console.log(reply);
    }
    await message.say(reply);
  }
}

const listeners = [onScan, onLogout, onLogin, onFriendship, onMessage];
export const bindListeners = (bot: WechatyInterface) => {
  return bot
    .on("scan", onScan)
    .on("login", onLogin)
    .on("logout", onLogout)
    .on("message", (message: MessageInterface) => {
      onMessage(message, bot)
    })
    .on("friendship", (friendship: FriendshipInterface) =>
      onFriendship(friendship, bot)
    );
};
