/* eslint-disable no-console */
const util = require('util');
const { clientHandlers, clientKinds } = require('./clients');
const { env } = require('../config');

const LOCAL_ENV = {
  usersNotifications: false,
  clientsNotifications: false,
  clientKindsNotifications: false,
};

// TODO: delete this when connecting to the db
// https://github.com/notify-watcher/server/issues/22
const MOCK_CLIENTS = {
  user1TelegramChatId1: {
    kind: clientKinds.telegram,
    chatId: '784232',
  },
  user2TelegramChatId1: {
    kind: clientKinds.telegram,
    chatId: '784232',
  },
  user2TelegramChatId2: {
    kind: clientKinds.telegram,
    chatId: 'user2TelegramChatId2',
  },
  user1Email1: {
    kind: clientKinds.email,
    email: 'user1Email1@example.com',
  },
  user2Email1: {
    kind: clientKinds.email,
    email: 'user2Email1@example.com',
  },
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
  return Object.keys(clientKinds).reduce(
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
      const clientHandler = clientHandlers[clientKind];
      if (!clientHandler) {
        console.warn(`WARN: No clientHandler for client ${clientKind}`);
        return;
      }
      if (typeof clientHandler !== 'function') {
        console.warn(
          `WARN: No clientHandler is not a function for client ${clientKind}`,
        );
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
function sendWatcherNotifications(watcherName, usersNotifications) {
  const clientsNotifications = groupUsersNotifications(
    usersNotifications,
    watcherName,
  );
  const clientKindsNotifications = groupClientsNotifications(
    clientsNotifications,
  );

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

  return sendClientKindsNotifications(clientKindsNotifications, watcherName);
}

module.exports = {
  sendWatcherNotifications,
};
