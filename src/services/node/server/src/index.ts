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
  const { WEB_PORT } = process.env
  const server = app.listen(WEB_PORT, () => {
    console.log(`api is running at: http://127.0.0.1:${WEB_PORT}`);
  });
  server.on('error', (err) => {
    if ((err as any).code === "EADDRINUSE") {
      console.log(`WEB_PORT: ${WEB_PORT} is in use. try another...`)
      process.env.WEB_PORT = Number(WEB_PORT!) + 1 + ''
      server.close();
      setTimeout(listen, 200)
  } else {
      console.log(err)
  }
  })
}
listen();
