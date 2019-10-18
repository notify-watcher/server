/* eslint-disable no-console */
const util = require('util');
const {
  execute,
  constants: { TIMEFRAMES },
} = require('@notify-watcher/core');

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
          subscribed: ['clientId'],
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
  {
    watcher: 'vtr',
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

async function getUserWatcherAuth(user, watcherName) {
  const subscription = user.subscriptions[watcherName];
  return subscription.auth;
}

async function getUserWatcherSnapshot(user, watcherName) {
  const subscription = user.subscriptions[watcherName];
  return subscription.snapshot;
}

async function updateUserWatcherSnapshot(user, watcherName, snapshot) {
  // eslint-disable-next-line no-param-reassign
  user.subscriptions[watcherName].snapshot = snapshot;
}

async function getSnapshotForWatcher(watcherName) {
  return (Snapshots.find(({ watcher }) => watcher === watcherName) || {})
    .snapshot;
}

async function updateWatcherSnapshot(watcherName, snapshot) {
  Snapshots.find(({ watcher }) => watcher === watcherName).snapshot = snapshot;
}

function shouldRunWatcher({ config: { timeframe } }, runDate) {
  // TODO: For now we will just run daily watchers at the hour in
  // the timeframe config for all users. Later we should add
  // logic to notifications so they're sent to each user at
  // different times.
  if (
    timeframe.type === TIMEFRAMES.day &&
    runDate.getHours() !== timeframe.hour
  )
    return false;
  return true;
}

function logWatcherIteration(data) {
  // TODO: change to config.isDev when that's merged
  if (process.env.NODE_ENV !== 'production') {
    console.log(`\n### Watcher iteration ${data.watcherName}\n`);
    console.log(util.inspect(data, { showHidden: false, depth: 2 }));
  }
}

async function runWatchersAuth(watchers) {
  const runDate = new Date();
  watchers.forEach(async watcher => {
    if (!shouldRunWatcher(watcher, runDate)) return;

    const { name: watcherName, watch } = watcher;
    const users = await usersForWatcher(watcherName);
    users.forEach(async user => {
      const id = `${watcherName}:${user.name}`;
      if (await isRunning(id)) return;

      await startRunning(id);
      const options = {
        auth: await getUserWatcherAuth(user, watcherName),
        snapshot: await getUserWatcherSnapshot(user, watcherName),
      };
      const { notifications, error, snapshot } = await execute(watch, options);
      await updateUserWatcherSnapshot(user, watcherName, snapshot);
      await stopRunning(id);
      logWatcherIteration({
        watcherName,
        previousSnapshot: options.snapshot,
        newSnapshot: snapshot,
        notifications,
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

async function runWatchersNoAuth(watchers) {
  const runDate = new Date();
  watchers.forEach(async watcher => {
    if (!shouldRunWatcher(watcher, runDate)) return;

    const { name: watcherName, watch } = watcher;
    // eslint-disable-next-line no-useless-return
    if (await isRunning(watcherName)) return;

    await startRunning(watcherName);
    const previousSnapshot = await getSnapshotForWatcher(watcherName);
    const { notifications, error, snapshot } = await execute(watch, {
      snapshot: previousSnapshot,
    });
    await updateWatcherSnapshot(watcherName, snapshot);
    await stopRunning(watcherName);
    logWatcherIteration({
      watcherName,
      previousSnapshot,
      newSnapshot: snapshot,
      notifications,
      error,
    });

    if (notifications.length > 0) {
      const users = await usersForWatcher(watcherName);
      users.forEach(() => {
        // TODO: Send notification to user
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
