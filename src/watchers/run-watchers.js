/* eslint-disable no-console */
const { execute } = require('@notify-watcher/core');

// Keep track of which watchers are running,
// use name as a key for no auth watchers
// use name+username as a key for auth watchers
const MOCK_REDIS = {};

const Users = [
  {
    name: 'mock user',
    subscriptions: {
      'github-notifications': {
        auth: {
          token: process.env.GITHUB_NOTIFICATIONS_TOKEN,
        },
        notificationTypes: {
          subscribed: ['clientIdd'],
        },
        snapshot: {},
      },
    },
  },
  {
    name: 'other user',
    subscriptions: {},
  },
];

function isRunning(id) {
  return MOCK_REDIS[id];
}

function startRunning(id) {
  MOCK_REDIS[id] = true;
}

function stopRunning(id) {
  MOCK_REDIS[id] = false;
}

function runWatchersAuth(watchers) {
  watchers.forEach(async watcher => {
    const { name: watcherName, watch } = watcher;
    const users = Users.filter(user => user.subscriptions[watcherName]);
    users.forEach(async user => {
      const id = `${watcherName}:${user.name}`;
      if (isRunning(id)) return;

      startRunning(id);
      const subscription = user.subscriptions[watcherName];
      const options = {
        auth: subscription.auth,
        snapshot: subscription.snapshot,
      };
      const { notifications, error, snapshot } = await execute(watch, options);
      subscription.snapshot = snapshot;
      stopRunning(id);

      console.table({
        watcher: watcherName,
        previousSnapshot: options.snapshot,
        newSnapshot: snapshot,
        notifications: notifications
          .map(notification => `${notification.key} ${notification.message}`)
          .join(' - '),
        error,
      });

      if (error)
        console.warn(
          `ERR: Found error for watcher ${watcherName} for user ${user.name} ${error}`,
        );

      // TODO: Send notifications
    });
  });
}

function runWatchersNoAuth(watchers) {
  watchers.forEach(async watcher => {
    const { name } = watcher.name;
    // eslint-disable-next-line no-useless-return
    if (isRunning(name)) return;
    // TODO: Run
  });
}

module.exports = {
  runWatchersAuth,
  runWatchersNoAuth,
};
