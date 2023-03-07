import Koa from 'koa';
import cors from '@koa/cors';
import { koaBody } from 'koa-body'
import dotenv from 'dotenv'
import router from './router';
import { responseTime } from './middlewares/responseTime';
dotenv.config();


const app = new Koa();

app.use(responseTime);
app.use(cors());
app.use(koaBody());


app.use(router.routes()).use(router.allowedMethods());
let PORT = process.env.S_NODE_PORT || process.env.NODE_PORT;

const listen = () => {
  const server = app.listen(PORT, () => {
    console.log(`api is running at: http://127.0.0.1:${PORT}`);
  });
  server.on('error', (err) => {
    if ((err as any).code === "EADDRINUSE") {
      console.log(`NODE_PORT: ${(PORT as unknown as number)++} is in use. try another...`)
      server.close();
      setTimeout(listen, 200)
  } else {
      console.log(err)
  }
  })
}
listen();
