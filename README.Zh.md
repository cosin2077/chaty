👋 欢迎！
Supo是一个开源项目，可以通过“npm i -g supo”进行安装，旨在提供多种服务选项，包括私人Web服务、Telegram Bot服务、NodeJS API服务和微信机器人服务。

Supo由gpt-3.5-turbo（OpenAI提供的最新优秀API）提供支持。

## 安装🤖

Supo是一个基于Node.js的应用程序，可以使用以下命令进行安装：

```
npm i -g chaty
```

## 服务

Chaty 提供多种不同的服务选项，您可根据自己需求选择合适的服务。  
```
-[x] 私有化web服务  
-[x] NodeJS API服务  
-[x] Telegram Bot 服务  
-[x] 微信机器人服务  
```
### 私有化 web 服务

Chaty 可以同时提供私有化的 web 服务，您可以随时通过访问 http://localhost:3000 访问您创建的 Chaty 服务。

### Telegram Bot 服务

Chaty 还可以提供 Telegram Bot 服务，您的用户可以在 Telegram 中与 Chaty 进行聊天。只需向“@chatgpt_bot”发送消息即可开启聊天机器人服务。

### 微信机器人服务

Chaty 也可以提供微信机器人服务，通过微信公众号与 Chaty 进行聊天。 

## 使用

Chaty 很容易就可以接入您的应用程序，并提供可靠的人机交互服务。在使用 Chaty 之前，请确保您已经准备好了 Chaty 等应用程序所需包。然后，您可以创建一个 Chaty 实例：

```javascript
chaty --web // provide web api
chaty --api // provide js api
chaty --wechat // provide wechat api
chaty --telegram // provide telegram api
```


然后，您就可以开始与 Chaty 进行互动了！

## 额外功能

除了上述基本功能外，Supo 还提供了一些额外的功能，例如回复历史消息或启用允许或禁止指令等。可以参阅我们的 API 文档以了解更多信息。

感谢您选择 Supo！如果您有任何问题或建议，请随时联系我们！# chaty
