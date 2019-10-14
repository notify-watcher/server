const Koa = require('koa');
const Router = require('koa-router');
const logger = require('koa-logger');
const setUpWatchers = require('./src/watchers');
const config = require('./config');

const app = new Koa();
const router = new Router();

router.get('/', ctx => {
  ctx.body = 'Hello World!';
});

app.use(logger());
app.use(router.routes());
app.use(router.allowedMethods());

const server = app.listen(config.PORT);

async function startup() {
  await setUpWatchers();
  // eslint-disable-next-line no-console
  console.log(config.WATCHERS);
}

startup();

module.exports = server;
