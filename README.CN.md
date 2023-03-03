
👋 欢迎您的关注！
Supo 是一个开源项目。这是一个可供 npm i -g supo 安装的 AI 聊天机器人服务，旨在提供多种服务选项，包括私有化 web 服务、NodeJS API服务、Telegram Bot 服务和微信机器人服务等。

Supo 使用了 GPT（Generative Pre-trained Transformer）技术，基于 Transformer 模型。通过自然语言处理技术，Supo 可以与用户实现高度纯化的互动界面，从而实现更好的聊天体验。

## 安装

Supo 是一个基于 Node.js 中间件的应用程序，可以通过以下命令进行安装：

```
npm i -g supo
```

## 服务

Supo 提供多种不同的服务选项，您可根据自己需求选择合适的服务。  
```
-[x] 私有化web服务  
-[x] NodeJS API服务  
-[x] Telegram Bot 服务  
-[x] 微信机器人服务  
```
### 私有化 web 服务

Supo 可以同时提供私有化的 web 服务，您可以随时通过访问 http://localhost:3000 访问您创建的 Supo 服务。

### Telegram Bot 服务

Supo 还可以提供 Telegram Bot 服务，您的用户可以在 Telegram 中与 Supo 进行聊天。只需向“@chatgpt_bot”发送消息即可开启聊天机器人服务。

### 微信机器人服务

Supo 也可以提供微信机器人服务，通过微信公众号与 Supo 进行聊天。 

## 使用

Supo 很容易就可以接入您的应用程序，并提供可靠的人机交互服务。在使用 Supo 之前，请确保您已经准备好了 Supo 等应用程序所需包。然后，您可以创建一个 Supo 实例：

```javascript
supo --web // provide web api
supo --api // provide js api
supo --wechat // provide wechat api
supo --telegram // provide telegram api
```


然后，您就可以开始与 Supo 进行互动了！

## 额外功能

除了上述基本功能外，Supo 还提供了一些额外的功能，例如回复历史消息或启用允许或禁止指令等。可以参阅我们的 API 文档以了解更多信息。

感谢您选择 Supo！如果您有任何问题或建议，请随时联系我们！# supo
