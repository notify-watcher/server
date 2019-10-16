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

const Snapshots = [
  {
    watcher: 'gtd',
    snapshot: {},
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

async function updateUserWatcherSnapshot(user, watcherName, snapshot) {
  // eslint-disable-next-line no-param-reassign
  user.subscriptions[watcherName].snapshot = snapshot;
}

async function getSnapshotForWatcher(watcherName) {
  return Snapshots.first(({ watcher }) => watcher === watcherName);
}

async function updateWatcherSnapshot(watcherName, snapshot) {
  Snapshots.first(({ watcher }) => watcher === watcherName).snapshot = snapshot;
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
      await updateUserWatcherSnapshot(user, watcherName, snapshot);
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
    const { name: watcherName, watch } = watcher.name;
    // eslint-disable-next-line no-useless-return
    if (await isRunning(watcherName)) return;

    await startRunning(watcherName);
    const previousSnapshot = await getSnapshotForWatcher(watcherName);
    const { notifications, error, snapshot } = await execute(watch, {
      snapshot: previousSnapshot,
    });
    await updateWatcherSnapshot(watcherName, snapshot);
    await stopRunning(watcherName);

    if (notifications.length > 0) {
      const users = await usersForWatcher(watcherName);
      users.forEach(() => {
        // TODO: Send notification to user
      });
    }

    // TODO: change to config.isDev when that's merged
    if (process.env.NODE_ENV !== 'production') {
      console.table({
        watcher: watcherName,
        previousSnapshot: snapshotToString(previousSnapshot),
        newSnapshot: snapshotToString(snapshot),
        notifications: notifications
          .map(notification => `${notification.key}: ${notification.message}`)
          .join(' - '),
        error,
      });
    }

    if (error)
      console.warn(`ERR: Found error for watcher ${watcherName} ${error}`);
  });
}

module.exports = {
  runWatchersAuth,
  runWatchersNoAuth,
};
