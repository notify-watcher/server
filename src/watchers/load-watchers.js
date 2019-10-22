const fs = require('fs-extra');
const path = require('path');
const {
  constants: { TIMEFRAMES },
  validators: { validateAuth, validateLibs, validateTimeframe },
} = require('@notify-watcher/core');
const { WATCHERS_PATH } = require('../config');
const executor = require('./executor');

function loadWatchersNames(watchersPath) {
  if (!fs.existsSync(watchersPath)) return [];
  return fs
    .readdirSync(watchersPath, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .filter(({ name }) => name[0] !== '.')
    .map(({ name }) => name);
}

function loadWatchers(watchersPath) {
  const watchers = loadWatchersNames(watchersPath)
    .map(name => {
      const watcherPath = path.join(WATCHERS_PATH, name);
      // eslint-disable-next-line global-require, import/no-dynamic-require
      const { config: watcherConfig, checkAuth, watch } = require(watcherPath);
      return {
        config: watcherConfig,
        checkAuth,
        watch,
        name,
        path: watcherPath,
      };
    })
    .filter(({ config, name }) =>
      validateAuth(config.auth, name, { verbose: true }),
    )
    .filter(({ config, name }) =>
      validateLibs(executor, config.libs, name, { verbose: true }),
    )
    .filter(({ config, name }) =>
      validateTimeframe(config.timeframe, name, { verbose: true }),
    );

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
