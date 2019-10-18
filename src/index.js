const mongoose = require('../lib/mongoose');
const config = require('./config');
const setUpWatchers = require('./watchers');
const app = require('./app');

async function startup() {
  await mongoose.dbConnect(config.DATABASE_URL);
  const { watchers } = await setUpWatchers();
  config.WATCHERS = watchers;
  app.listen(config.PORT);
}

startup();
