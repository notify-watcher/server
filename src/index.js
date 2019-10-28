const mongoose = require('./mongoose');
const config = require('./config');
const setUpWatchers = require('./watchers');
const app = require('./app');

async function startup() {
  await mongoose.connect(config.DATABASE_URL);
  const { watchersList, watchersObject } = await setUpWatchers();
  config.WATCHERS = {
    list: watchersList,
    watchers: watchersObject,
  };
  app.listen(config.api.port);
}

startup();
