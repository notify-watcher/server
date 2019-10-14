const Koa = require('koa');
const Router = require('koa-router');
const logger = require('koa-logger');
require('./src/watchers')();
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

module.exports = server;
