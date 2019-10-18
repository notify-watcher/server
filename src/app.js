const Koa = require('koa');
const logger = require('koa-logger');
const mongoose = require('mongoose');
const config = require('../config');
const setUpWatchers = require('./watchers');
const router = require('./routes');

mongoose.connect(config.DATABASE_URL);

const app = new Koa();

app.use(router.routes());
app.use(router.allowedMethods());

app.use(logger());

async function startup() {
  // TODO: Setup db connection here

  const { watchers } = await setUpWatchers();
  config.WATCHERS = watchers;

  // TODO: Start api here
}

startup();

module.exports = app;
