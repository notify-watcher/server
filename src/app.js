const Koa = require('koa');
const logger = require('koa-logger');
const router = require('./routes');

const app = new Koa();
app.use(logger());
app.use(router.routes());
app.use(router.allowedMethods());

module.exports = app;
