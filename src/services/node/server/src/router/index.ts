import Router from 'koa-router';
import { resetMessage, sendMessage } from '../chat';
const router = new Router();


router.get('/', async (ctx, next) => {
  ctx.body = `post http://127.0.0.1:${process.env.NODE_PORT}/chat/message to interact with chatGPT api!`;
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

export default router;