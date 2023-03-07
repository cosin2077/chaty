import path from 'path';
import Koa from 'koa';
import cors from '@koa/cors';
import serve from 'koa-static'
import Router from 'koa-router';
import { koaBody } from 'koa-body'
import logger from 'koa-logger';
import dotenv from 'dotenv';
import { resetMessage, sendMessage } from './chat';
import { responseTime } from './middlewares/responseTime';
dotenv.config();
let PORT = process.env.S_WEB_PORT || process.env.WEB_PORT;
console.log(`process.env.S_WEB_PORT:`, process.env.S_WEB_PORT)

const app = new Koa();
const router = new Router();

app.use(responseTime);
app.use(cors());
app.use(logger());
app.use(koaBody());

app.use(serve(path.resolve(__dirname, '..', 'client')));

router.get('/', async (ctx, next) => {
  ctx.body = 'ok';
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
      console.log(`WEB_PORT: ${(PORT as unknown as number)++} is in use. try another...`)
      server.close();
      setTimeout(listen, 200)
  } else {
      console.log(err)
  }
  })
}
listen();
