/* eslint-disable no-console */
const util = require('util');
const {
  constants: { CLIENT_KINDS },
} = require('@notify-watcher/core');
const { env, clients } = require('../config');
const axios = require('./axios');

const { url } = clients[CLIENT_KINDS.telegram];

const LOCAL_ENV = {
  clientsNotifications: false,
};

function sendWatcherNotifications(watcherName, clientsNotifications) {
  if (env.isDev && LOCAL_ENV.clientsNotifications)
    console.log(
      `telegram notifications for ${watcherName} watcher\n`,
      util.inspect(clientsNotifications, { showHidden: false, depth: 2 }),
    );

  const chatIdsNotifications = clientsNotifications.map(
    ({ client: { chatId }, notifications }) => ({ chatId, notifications }),
  );
  return axios.post(`${url}/notifications`, chatIdsNotifications);
}

module.exports = { sendWatcherNotifications };
