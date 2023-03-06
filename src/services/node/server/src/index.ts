import Koa from 'koa';
import cors from '@koa/cors';
import { koaBody } from 'koa-body'
import dotenv from 'dotenv'
import router from './router';
import { responseTime } from './middlewares/responseTime';
dotenv.config();
export let PORT = process.env.WEB_PORT;

const app = new Koa();

app.use(responseTime);
app.use(cors());
app.use(koaBody());


app.use(router.routes()).use(router.allowedMethods());

const listen = () => {
  const { NODE_PORT } = process.env
  const server = app.listen(NODE_PORT, () => {
    console.log(`api is running at: http://127.0.0.1:${NODE_PORT}`);
  });
  server.on('error', (err) => {
    if ((err as any).code === "EADDRINUSE") {
      console.log(`NODE_PORT: ${NODE_PORT} is in use. try another...`)
      process.env.NODE_PORT = Number(NODE_PORT!) + 1 + ''
      server.close();
      setTimeout(listen, 200)
  } else {
      console.log(err)
  }
  })
}
listen();
