/* eslint-disable no-console */
const util = require('util');
const {
  constants: { CLIENT_KINDS, DEFAULT_CLIENT_IDS },
} = require('@notify-watcher/core');
const { env } = require('../config');
const { sendWatcherNotifications: emailHandler } = require('./email');
const { sendWatcherNotifications: telegramHandler } = require('./telegram');

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
  clientKindsNotifications: false,
};

const CLIENT_KIND_HANDLERS = {
  [CLIENT_KINDS.telegram]: telegramHandler,
  [CLIENT_KINDS.email]: emailHandler,
};

const DEFAULT_CLIENT_FOR_USER_HANDLERS = {
  [DEFAULT_CLIENT_IDS.email]: user => ({
    kind: CLIENT_KINDS.email,
    email: user.email,
  }),
};

function userClientForClientId(user, clientId) {
  return DEFAULT_CLIENT_IDS[clientId]
    ? DEFAULT_CLIENT_FOR_USER_HANDLERS[clientId](user)
    : MOCK_CLIENTS[clientId];
}

function groupUserNotifications({ user, notifications, watcherName }) {
  // { clientId: { client, notifications } }
  const userClientNotifications = {};
  const { notificationTypes } = user.subscriptions[watcherName];

  notifications.forEach(notification => {
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

  return Object.values(userClientNotifications);
}

function groupUsersNotifications(usersNotifications, watcherName) {
  return usersNotifications
    .map(({ user, notifications }) =>
      groupUserNotifications({ user, notifications, watcherName }),
    )
    .flat();
}

function groupClientsNotifications(clientsNotifications) {
  return Object.keys(CLIENT_KINDS).reduce(
    (clientKindsNotifications, clientKind) => ({
      ...clientKindsNotifications,
      [clientKind]: clientsNotifications.filter(
        ({ client }) => client.kind === clientKind,
      ),
    }),
    {},
  );
}

function sendClientKindsNotifications(clientKindsNotifications, watcherName) {
  Object.keys(clientKindsNotifications).forEach(clientKind => {
    const clientHandler = CLIENT_KIND_HANDLERS[clientKind];
    if (!clientHandler) {
      console.warn(`WARN: No clientHandler for clientKind ${clientKind}`);
      return;
    }

    const clientKindNotifications = clientKindsNotifications[clientKind];
    clientHandler(watcherName, clientKindNotifications);
  });
}

/**
 * Receives an array of user-notifications objects and sends the
 * notifications to those users using the configured clients
 * @param {{user: Object, notifications: Object[]}[]} usersNotifications
 */
function sendWatcherNotifications(watcherName, usersNotifications) {
  const clientsNotifications = groupUsersNotifications(
    usersNotifications,
    watcherName,
  );
  const clientKindsNotifications = groupClientsNotifications(
    clientsNotifications,
  );
  sendClientKindsNotifications(clientKindsNotifications, watcherName);

  if (env.isDev && LOCAL_ENV.usersNotifications)
    console.log(
      'usersNotifications\n',
      util.inspect(usersNotifications, { showHidden: false, depth: 2 }),
    );
  if (env.isDev && LOCAL_ENV.clientsNotifications)
    console.log(
      `clientsNotifications ${watcherName}\n`,
      util.inspect(clientsNotifications, { showHidden: false, depth: 2 }),
    );
  if (env.isDev && LOCAL_ENV.clientKindsNotifications)
    console.log(
      `clientKindsNotifications ${watcherName}\n`,
      util.inspect(clientKindsNotifications, { showHidden: false, depth: 2 }),
    );
}

module.exports = {
  CLIENT_KIND_HANDLERS,
  DEFAULT_CLIENT_FOR_USER_HANDLERS,
  sendWatcherNotifications,
};
