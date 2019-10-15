const config = require('../../config');
const { DOWNLOADED_DIR_PATH } = require('./config');
const validateAuth = require('./validate-auth');
const validateLibs = require('./validate-libs');
const { TIMEFRAMES, validateTimeframe } = require('./validate-timeframe');

function loadWatchersList() {
  const watchers = config.WATCHERS.map(name => {
    const path = `${DOWNLOADED_DIR_PATH}/${name}`;
    // eslint-disable-next-line global-require, import/no-dynamic-require
    const { config: watcherConfig, checkAuth, watch } = require(path);
    return {
      config: watcherConfig,
      checkAuth,
      watch,
      name,
      path,
    };
  })
    .filter(validateAuth)
    .filter(validateLibs)
    .filter(validateTimeframe);

  const minuteWatchers = watchers.filter(
    watcher => watcher.config.timeframe.type === TIMEFRAMES.minute,
  );
  const hourWatchers = watchers.filter(
    watcher =>
      watcher.config.timeframe.type === TIMEFRAMES.hour ||
      watcher.config.timeframe.type === TIMEFRAMES.day,
  );
  return { minuteWatchers, hourWatchers };
}

module.exports = loadWatchersList;
