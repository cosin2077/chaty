import Koa from 'koa';
import Router from 'koa-router';

export async function responseTime(ctx: Koa.ParameterizedContext<any, Router.IRouterParamContext<any, {}>, any>, next: Koa.Next) {
  const start = process.hrtime();
  await next();
  const end = process.hrtime(start);
  const diffInMs = (end[0] * 1e9 + end[1]) / 1e6;
  try {
    if (typeof ctx.body === 'object') {
      ctx.body.responseTime = `${diffInMs}ms`;
    } else {
      ctx.set('responseTime', `${diffInMs}ms`)
    }
  } catch (_) {}
}