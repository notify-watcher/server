/* eslint-disable no-console */
const util = require('util');
const {
  constants: { CLIENT_KINDS, DEFAULT_CLIENT_IDS },
} = require('@notify-watcher/core');
const { env } = require('../config');
const emailNotificationsHandler = require('./email');
const telegramNotificationsHandler = require('./telegram');

// TODO: delete this when connecting to the db
// https://github.com/notify-watcher/server/issues/22
const MOCK_CLIENTS = {
  user1TelegramChatId1: {
    kind: CLIENT_KINDS.telegram,
    chatId: 'user1TelegramChatId1',
  },
  user2TelegramChatId1: {
    kind: CLIENT_KINDS.telegram,
    chatId: 'user2TelegramChatId1',
  },
  user2TelegramChatId2: {
    kind: CLIENT_KINDS.telegram,
    chatId: 'user2TelegramChatId2',
  },
};

const LOCAL_ENV = {
  usersNotifications: false,
  clientsNotifications: false,
};

const CLIENT_HANDLERS = {
  [CLIENT_KINDS.telegram]: telegramNotificationsHandler,
  [CLIENT_KINDS.email]: emailNotificationsHandler,
};

const DEFAULT_CLIENT_FOR_USER = {
  [DEFAULT_CLIENT_IDS.email]: user => ({
    kind: CLIENT_KINDS.email,
    email: user.email,
  }),
};

function defaultClientForUser(user, clientId) {
  return DEFAULT_CLIENT_FOR_USER[clientId](user);
}

function clientForUser(user, clientId) {
  return MOCK_CLIENTS[clientId];
}

function userClientForClientId(user, clientId) {
  return DEFAULT_CLIENT_IDS[clientId]
    ? defaultClientForUser(user, clientId)
    : clientForUser(user, clientId);
}

/**
 * Receives an array of user-notifications objects and sends the
 * notifications to those users using the configured clients
 * @param {{user: Object, notifications: Object[]}[]} usersNotifications
 */
function sendWatcherNotifications(watcherName, usersNotifications) {
  if (env.isDev && LOCAL_ENV.usersNotifications)
    console.log(
      'usersNotifications\n',
      util.inspect(usersNotifications, { showHidden: false, depth: 2 }),
    );

  const clientKindsNotifications = Object.keys(CLIENT_KINDS).reduce(
    (object, key) => ({ ...object, [key]: [] }),
    {},
  );

  usersNotifications.forEach(({ user, notifications: userNotifications }) => {
    // { clientId: { client, notifications } }
    const userClientNotifications = {};
    const { notificationTypes } = user.subscriptions[watcherName];

    userNotifications.forEach(notification => {
      const clientIds = notificationTypes[notification.key];
      if (!clientIds || clientIds.length === 0) return;

      clientIds.forEach(clientId => {
        if (!userClientNotifications[clientId]) {
          const client = userClientForClientId(user, clientId);
          if (!client) return;

          userClientNotifications[clientId] = { client, notifications: [] };
        }
        userClientNotifications[clientId].notifications.push(notification);
      });
    });

    Object.keys(userClientNotifications).forEach(clientId => {
      const { client, notifications } = userClientNotifications[clientId];
      clientKindsNotifications[client.kind].push({ client, notifications });
    });
  });

  if (env.isDev && LOCAL_ENV.clientsNotifications)
    console.log(
      'clientsNotifications\n',
      util.inspect(clientKindsNotifications, { showHidden: false, depth: 3 }),
    );

  Object.keys(clientKindsNotifications).forEach(clientKind => {
    const clientHandler = CLIENT_HANDLERS[clientKind];
    if (!clientHandler) {
      console.warn(`WARN: No clientHandler for clientKind ${clientKind}`);
      return;
    }

    const clientKindNotifications = clientKindsNotifications[clientKind];
    clientHandler(watcherName, clientKindNotifications);
  });
}

module.exports = { sendWatcherNotifications };
