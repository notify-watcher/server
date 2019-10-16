const fs = require('fs-extra');
const { WATCHERS_PATH } = require('../../config');
const validateAuth = require('./validate-auth');
const validateLibs = require('./validate-libs');
const { TIMEFRAMES, validateTimeframe } = require('./validate-timeframe');

function loadWatchersNames(path) {
  return fs
    .readdirSync(path, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .filter(({ name }) => name[0] !== '.')
    .map(({ name }) => name);
}

function loadWatchers(watchersPath) {
  const watchers = loadWatchersNames(watchersPath)
    .map(name => {
      const path = `${WATCHERS_PATH}/${name}`;
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
  return {
    watchers,
    minuteWatchersAuth: minuteWatchers.filter(({ config: c }) => c.auth),
    minuteWatchersNoAuth: minuteWatchers.filter(({ config: c }) => !c.auth),
    hourWatchersAuth: hourWatchers.filter(({ config: c }) => c.auth),
    hourWatchersNoAuth: hourWatchers.filter(({ config: c }) => !c.auth),
  };
}

module.exports = { loadWatchers, loadWatchersNames };
