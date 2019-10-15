const Koa = require('koa');
const logger = require('koa-logger');
const bodyParser = require('koa-bodyparser');
const router = require('./routes');
const config = require('./config');
const { errorsMiddleware } = require('./middleware');

const app = new Koa();
if (config.env.isDev || config.env.isProd) {
  app.use(logger());
}
app.use(errorsMiddleware);
app.use(bodyParser());
app.use(router.routes());
app.use(router.allowedMethods());

module.exports = app;
