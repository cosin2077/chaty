import { WechatyBuilder } from "wechaty";
import { bindListeners } from "./src/listeners";

const bot = WechatyBuilder.build({
  name: "chaty-wechat-bot",
});

bindListeners(bot).start();
