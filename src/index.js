const config = require('./config');
const setUpWatchers = require('./watchers');
const app = require('./app');

async function startup() {
  await mongoose.connect(config.DATABASE_URL);
  const { watchers } = await setUpWatchers();
  config.WATCHERS = watchers;
  app.listen(config.PORT);
}

startup();
