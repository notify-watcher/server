const config = require('./config');
const setUpWatchers = require('./src/watchers');
const app = require('./src/app');

async function startup() {
  await mongoose.connect(config.DATABASE_URL);
  const { watchers } = await setUpWatchers();
  config.WATCHERS = watchers;
  app.listen(config.PORT);
}

startup();
