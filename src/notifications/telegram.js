/* eslint-disable no-console */
const util = require('util');
const { env } = require('../config');

const LOCAL_ENV = {
  clientsNotifications: false,
};

function sendWatcherNotifications(watcherName, clientsNotifications) {
  if (env.isDev && LOCAL_ENV.clientsNotifications)
    console.log(
      `telegram notifications for ${watcherName} watcher\n`,
      util.inspect(clientsNotifications, { showHidden: false, depth: 2 }),
    );
}

module.exports = { sendWatcherNotifications };
