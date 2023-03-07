## ✨✨✨Chaty – Making Your ChatGPT Imagination a Reality!

Read this in other languages: English | [简体中文](./README.zh-CN.md)

With Chaty, your imagination about ChatGPT will come to life! Chaty allows you to:

- Use it as a command-line assistant;
- Deploy a private ChatGPT web service;
- Deploy your NodeJS API for ChatGPT;
- Deploy your WeChat ChatGPT bot;
- Deploy your Telegram ChatGPT bot;  
- More services are under coding!

Let Chaty take you beyond expectations and into the exciting world of ChatGPT.

## ⚙️Installation

Chaty is a application based on Node.js, and can be installed with the following command:  
If you have not installed NodeJS, [click here](https://nodejs.org/)
```
npm i -g ichaty
```

## 🔑Login

Login with your openAI key.You can find your API key at https://platform.openai.com/account/api-keys.  
Then you can start your journey
```
chaty login <your-openAI-key>
```

## 🚀Services

Chaty provides multiple service options, and you can choose the most suitable one according to your needs.
```
-[x] command line Service📁   
-[x] private Web Service🚀  
-[x] weChat Robot Service💬   
-[x] nodeJS API Service💻 
-[] telegram Bot Service🤖  
```

### 📁command line Service   
```
chaty run command
```
![](./assets/images/command.jpg)
### 🌍Private Web Service

Chaty can deploy a private web service, and you can access the Chaty service you created anytime by visiting http://localhost:9522.  
you can specify port with <code>chaty run web --port \<your-port\></code>  
```
chaty run web --port 9555
```
![](./assets/images/web.jpg)

### 💬WeChat Robot Service

Chaty can also deploy a WeChat robot service, allowing you to chat with Chaty through a WeChat account.  
```
chaty run wechat
```


### 🤖Telegram Bot Service

Chaty can also deploy Telegram Bot service, enabling your users to chat with Chaty in Telegram. Simply send a message to '@your-bot' to initiate the chatbot service.


## Usage

Chaty is easy to integrate into your application, and provides reliable human-machine interaction service. Before using Chaty, make sure you have prepared the required packages for Chaty and other applications. Then, you can create a Chaty instance:

```javascript
chaty // command-line interaction  
chaty --web // provide web api
chaty --api // provide js api
chaty --wechat // provide wechat api
chaty --telegram // provide telegram api
```

Then, you can start interacting with Supo！
## Additional Features

In addition to the basic functions mentioned above, Chaty also provides some additional features, such as replying to historical messages, and enabling or disabling commands. You can refer to our API documentation for more information.

Thank you for choosing Chaty! If you have any questions or suggestions, please feel free to contact us!