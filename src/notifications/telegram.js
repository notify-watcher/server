/* eslint-disable no-console */
const util = require('util');
const config = require('../config');
const axios = require('./axios');

const clientKind = 'telegram';
const clientRequiredKeys = ['chatId'];
const { url } = config.clients[clientKind];

const LOCAL_ENV = {
  clientHandler: false,
};

function clientHandler(watcherName, clientsNotifications) {
  if (config.env.isDev && LOCAL_ENV.clientHandler)
    console.log(
      `telegram notifications for ${watcherName} watcher\n`,
      util.inspect(clientsNotifications, { showHidden: false, depth: 2 }),
    );

  const chatIdsNotifications = clientsNotifications.map(
    ({ client: { data }, notifications }) => ({
      ...data,
      notifications,
      watcherName: config.WATCHERS.watchers[watcherName].displayName,
    }),
  );
  return axios.post(`${url}/notifications`, chatIdsNotifications);
}

module.exports = {
  clientHandler,
  clientKind,
  clientRequiredKeys,
};
