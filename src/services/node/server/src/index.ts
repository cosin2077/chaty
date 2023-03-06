import Koa from 'koa';
import cors from '@koa/cors';
import Router from 'koa-router';
import { koaBody } from 'koa-body'
import dotenv from 'dotenv'
import { resetMessage, sendMessage } from './chat';
import { responseTime } from './middlewares/responseTime';
dotenv.config();
let PORT = process.env.WEB_PORT;

const app = new Koa();
const router = new Router();

app.use(responseTime);
app.use(cors());
app.use(koaBody());


router.get('/', async (ctx, next) => {
  ctx.body = `post http://127.0.0.1:${PORT}/chat/message to interact with chatGPT api!`;
});
router.post('/chat/message', async (ctx, next) => {
  const bodyStr = ctx.request.body;
  try {
    let body = (typeof bodyStr === 'string') ? JSON.parse(bodyStr) : bodyStr
    if (!body?.userId || !body.message) {
      return ctx.body = {
        code: 400,
        message: 'userId and message needed!'
      };
    }
    const data = await sendMessage(body.message,body.userId)
    ctx.body = {
      data,
      code: 200,
      message: 'ok'
    };
  } catch (err) {
    console.log(err)
    ctx.status = 500;
    ctx.body = {
      code: 500,
      message: (err as Error).message
    }
  }
});
router.post('/chat/reset', async (ctx, next) => {
  const bodyStr = ctx.request.body;
  try {
    let body = (typeof bodyStr === 'string') ? JSON.parse(bodyStr) : bodyStr
    if (!body?.userId) {
      return ctx.body = {
        code: 400,
        message: 'userId needed!'
      };
    }
    resetMessage(body.userId)
    ctx.body = {
      code: 200,
      message: 'ok'
    };
  } catch (err) {
    console.log(err)
    ctx.status = 500;
    ctx.body = {
      code: 500,
      message: (err as Error).message
    }
  }
});

app.use(router.routes()).use(router.allowedMethods());

const listen = () => {
  const server = app.listen(PORT, () => {
    console.log(`api is running at: http://127.0.0.1:${PORT}`);
  });
  server.on('error', (err) => {
    if ((err as any).code === "EADDRINUSE") {
      console.log(`PORT: ${PORT} is in use. try another...`)
      PORT = PORT! + 1
      server.close();
      setTimeout(listen, 200)
  } else {
      console.log(err)
  }
  })
}
listen();
