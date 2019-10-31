/* eslint-disable no-console */
const util = require('util');
const { clientHandlers, clientKinds } = require('./clients');
const { env } = require('../config');

const LOCAL_ENV = {
  usersNotifications: true,
  clientsNotifications: true,
  clientKindsNotifications: true,
};

function userClientForClientId(user, clientId) {
  return {};
  // return MOCK_CLIENTS[clientId];
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
  if (env.isDev && LOCAL_ENV.usersNotifications)
    console.log(
      `usersNotifications ${watcherName}\n`,
      util.inspect(usersNotifications, { showHidden: false, depth: 2 }),
    );

  const clientsNotifications = groupUsersNotifications(
    usersNotifications,
    watcherName,
  );

  if (env.isDev && LOCAL_ENV.clientsNotifications)
    console.log(
      `clientsNotifications ${watcherName}\n`,
      util.inspect(clientsNotifications, { showHidden: false, depth: 2 }),
    );

  const clientKindsNotifications = groupClientsNotifications(
    clientsNotifications,
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
