/* eslint-disable no-console */
const util = require('util');
const {
  constants: { CLIENT_KINDS },
} = require('@notify-watcher/core');
const { env } = require('../config');
const { sendWatcherNotifications: emailHandler } = require('./email');
const { sendWatcherNotifications: telegramHandler } = require('./telegram');

// TODO: delete this when connecting to the db
// https://github.com/notify-watcher/server/issues/22
const MOCK_CLIENTS = {
  user1TelegramChatId1: {
    kind: CLIENT_KINDS.telegram,
    chatId: '784232',
  },
  user2TelegramChatId1: {
    kind: CLIENT_KINDS.telegram,
    chatId: '784232',
  },
  user2TelegramChatId2: {
    kind: CLIENT_KINDS.telegram,
    chatId: 'user2TelegramChatId2',
  },
  user1Email1: {
    kind: CLIENT_KINDS.email,
    email: 'user1Email1@example.com',
  },
  user2Email1: {
    kind: CLIENT_KINDS.email,
    email: 'user2Email1@example.com',
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

function userClientForClientId(user, clientId) {
  return MOCK_CLIENTS[clientId];
}

function groupUserNotifications({ user, notifications, watcherName }) {
  // { clientId: { client, notifications } }
  const userClientNotifications = {};
  const { notificationTypes } = user.subscriptions[watcherName];

  notifications.forEach(notification => {
    const clientIds = notificationTypes[notification.type];
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
  const requests = Object.keys(clientKindsNotifications).map(
    async clientKind => {
      const clientHandler = CLIENT_KIND_HANDLERS[clientKind];
      if (!clientHandler) {
        console.warn(`WARN: No clientHandler for clientKind ${clientKind}`);
        return;
      }

      const clientKindNotifications = clientKindsNotifications[clientKind];
      try {
        await clientHandler(watcherName, clientKindNotifications);
      } catch (error) {
        // TODO: Rollbar
        console.error(
          `ERR: Sending notifications to client ${clientKind} from watcher ${watcherName}\n${error}`,
        );
      }
    },
  );
  return Promise.all(requests);
}

/**
 * Receives an array of user-notifications objects and sends the
 * notifications to those users using the configured clients
 * @param {{user: Object, notifications: Object[]}[]} usersNotifications
 */
async function sendWatcherNotifications(watcherName, usersNotifications) {
  const clientsNotifications = groupUsersNotifications(
    usersNotifications,
    watcherName,
  );
  const clientKindsNotifications = groupClientsNotifications(
    clientsNotifications,
  );
  await sendClientKindsNotifications(clientKindsNotifications, watcherName);

  if (env.isDev && LOCAL_ENV.usersNotifications)
    console.log(
      `usersNotifications ${watcherName}\n`,
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
  sendWatcherNotifications,
};
