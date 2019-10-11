const Koa = require('koa');
const Router = require('koa-router');
const logger = require('koa-logger');
const setUpWatchers = require('./src/watchers');
const config = require('./config');

const app = new Koa();

const baseRouter = new Router();
require('./routes/base')({ baseRouter });

const watchersRouter = new Router({ prefix: '/watchers' });
require('./routes/watchers')({ watchersRouter });

const routers = [baseRouter, watchersRouter];

routers.forEach(router => {
  app.use(router.routes());
  app.use(router.allowedMethods());
});

app.use(logger());

const server = app.listen(config.PORT);

async function startup() {
  // TODO: Setup db connection here

  const { watchers } = await setUpWatchers();
  config.WATCHERS = watchers;

  // TODO: Start api here
}

startup();

module.exports = server;
