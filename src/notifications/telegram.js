/* eslint-disable no-console */
const util = require('util');
const { env, clients } = require('../config');
const axios = require('./axios');

const clientKind = 'telegram';
const clientRequiredKeys = ['chatId'];
const { url } = clients[clientKind];

const LOCAL_ENV = {
  clientHandler: false,
};

function clientHandler(watcherName, clientsNotifications) {
  if (env.isDev && LOCAL_ENV.clientHandler)
    console.log(
      `telegram notifications for ${watcherName} watcher\n`,
      util.inspect(clientsNotifications, { showHidden: false, depth: 2 }),
    );

  const chatIdsNotifications = clientsNotifications.map(
    ({ client: { data }, notifications }) => ({ ...data, notifications }),
  );
  return axios.post(`${url}/notifications`, chatIdsNotifications);
}

module.exports = {
  clientHandler,
  clientKind,
  clientRequiredKeys,
};
