/* eslint-disable no-console */
const util = require('util');
const {
  constants: { TIMEFRAMES },
} = require('@notify-watcher/core');
const { env } = require('../config.js');
const { sendNotifications } = require('../notifications');
const executor = require('./executor');

const LOCAL_ENV = {
  watcherIteration: false,
  watcherAuthRun: false,
  watcherNoAuthRun: false,
  alwaysRunDayWatcher: true,
};

// Keep track of which watchers are running,
// use name as a key for no auth watchers
// use name+username as a key for auth watchers
const MOCK_REDIS = {};

const Users = [
  {
    name: 'user1',
    subscriptions: {
      'github-notifications': {
        auth: {
          token: process.env.GITHUB_NOTIFICATIONS_TOKEN,
        },
        notificationTypes: {
          subscribed: ['user1ClientId1'],
        },
        snapshot: {},
      },
      'unired-tag': {
        auth: {
          rut: process.env.RUT,
        },
        notificationTypes: {
          updatedBallot: ['user1ClientId1'],
        },
        snapshot: {},
      },
      gtd: {
        notificationTypes: {
          newPlan: ['user1ClientId2'],
        },
      },
    },
  },
  {
    name: 'user2',
    subscriptions: {
      'unired-tag': {
        auth: {
          rut: process.env.RUT,
        },
        notificationTypes: {
          updatedBallot: ['user2ClientId1'],
        },
        snapshot: {},
      },
      gtd: {
        notificationTypes: {
          newPlan: ['user2ClientId2'],
        },
      },
    },
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
  const watcherIsRunning = MOCK_REDIS[id];
  if (watcherIsRunning) console.log(`Watcher already running: ${id}`);
  return watcherIsRunning;
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
  if (env.isDev && LOCAL_ENV.alwaysRunDayWatcher) return true;

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
  if (env.isDev && LOCAL_ENV.watcherIteration) {
    const { user, ...logData } = data;
    const userString = user ? ` for user: ${user}` : '';
    console.log(`\n### Watcher ${data.watcherName} iteration${userString}\n`);
    console.log(util.inspect(logData, { showHidden: false, depth: 2 }));
  }
}

async function runWatchersAuth(watchers) {
  const runDate = new Date();
  watchers.map(async watcher => {
    if (!shouldRunWatcher(watcher, runDate)) return;

    const usersNotifications = [];
    const { name: watcherName, watch } = watcher;
    const users = await usersForWatcher(watcherName);
    const runWatchersPromises = users.map(async user => {
      const id = `${watcherName}:${user.name}`;
      if (await isRunning(id)) return;

      await startRunning(id);
      const auth = await getUserWatcherAuth(user, watcherName);
      const previousSnapshot = await getUserWatcherSnapshot(user, watcherName);
      const { notifications, error, snapshot } = await executor.run(watch, {
        auth,
        snapshot: previousSnapshot,
      });
      await updateUserWatcherSnapshot(user, watcherName, snapshot);
      await stopRunning(id);
      logWatcherIteration({
        watcherName,
        previousSnapshot,
        newSnapshot: snapshot,
        notifications,
        error,
        user: user.name,
      });

      if (error) {
        console.warn(
          `ERR: Watcher ${watcherName} for user ${user.name} threw error\n${error}`,
        );
        return;
      }
      if (notifications.length === 0) return;

      usersNotifications.push({ user, notifications, watcherName });
    });

    await Promise.all(runWatchersPromises);
    if (usersNotifications.length === 0) return;

    if (env.isDev && LOCAL_ENV.watcherAuthRun) {
      console.log(`\n# Watcher ${watcherName} usersNotifications`);
      console.log(
        util.inspect(usersNotifications, { showHidden: false, depth: 3 }),
      );
    }

    await sendNotifications(usersNotifications);
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
    const { notifications, error, snapshot } = await executor.run(watch, {
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

    if (error) {
      console.warn(`ERR: Watcher ${watcherName} threw error\n${error}`);
      return;
    }
    if (notifications.length === 0) return;

    const users = await usersForWatcher(watcherName);
    const usersNotifications = users.map(user => ({
      user,
      notifications,
      watcherName,
    }));

    if (env.isDev && LOCAL_ENV.watcherNoAuthRun) {
      console.log(`\n# Watcher ${watcherName} usersNotifications`);
      console.log(
        util.inspect(usersNotifications, { showHidden: false, depth: 3 }),
      );
    }

    await sendNotifications(usersNotifications);
  });
}

module.exports = {
  runWatchersAuth,
  runWatchersNoAuth,
};
