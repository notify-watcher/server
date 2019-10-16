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

async function isRunning(id) {
  return MOCK_REDIS[id];
}

async function startRunning(id) {
  MOCK_REDIS[id] = true;
}

async function stopRunning(id) {
  MOCK_REDIS[id] = false;
}

async function usersForWatcher(watcherName) {
  return Users.filter(user => user.subscriptions[watcherName]);
}

function snapshotToString(snapshot) {
  return Object.keys(snapshot)
    .map(key => `${key}: ${snapshot[key]}`)
    .join(' - ');
}

async function runWatchersAuth(watchers) {
  watchers.forEach(async watcher => {
    const { name: watcherName, watch } = watcher;
    const users = await usersForWatcher(watcherName);
    users.forEach(async user => {
      const id = `${watcherName}:${user.name}`;
      if (await isRunning(id)) return;

      await startRunning(id);
      const subscription = user.subscriptions[watcherName];
      const options = {
        auth: subscription.auth,
        snapshot: subscription.snapshot,
      };
      const { notifications, error, snapshot } = await execute(watch, options);
      subscription.snapshot = snapshot;
      await stopRunning(id);

      // TODO: change to config.isDev when that's merged
      if (process.env.NODE_ENV !== 'production') {
        console.table({
          watcher: watcherName,
          previousSnapshot: snapshotToString(options.snapshot),
          newSnapshot: snapshotToString(snapshot),
          notifications: notifications
            .map(notification => `${notification.key}: ${notification.message}`)
            .join(' - '),
          error,
        });
      }

      if (error)
        console.warn(
          `ERR: Found error for watcher ${watcherName} for user ${user.name} ${error}`,
        );

      // TODO: Send notifications
    });
  });
}

async function runWatchersNoAuth(watchers) {
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
