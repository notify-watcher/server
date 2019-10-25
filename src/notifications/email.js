/* eslint-disable no-console */
const util = require('util');
const { env } = require('../config');

const clientKind = 'email';
const clientRequiredKeys = ['email'];

const LOCAL_ENV = {
  clientHandler: false,
};

function clientHandler(watcherName, clientsNotifications) {
  if (env.isDev && LOCAL_ENV.clientHandler)
    console.log(
      `email notifications for ${watcherName} watcher\n`,
      util.inspect(clientsNotifications, { showHidden: false, depth: 2 }),
    );
}

module.exports = {
  clientHandler,
  clientKind,
  clientRequiredKeys,
};
