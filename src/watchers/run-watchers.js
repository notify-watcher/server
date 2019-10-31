/* eslint-disable no-console */
const util = require('util');
const {
  constants: { TIMEFRAMES },
} = require('@notify-watcher/core');
const { env } = require('../config.js');
const { HTTP_CODES } = require('../constants');
const { sendWatcherNotifications } = require('../notifications');
const Snapshot = require('../models/snapshot');
const executor = require('./executor');

const LOCAL_ENV = {
  watcherIteration: false,
  watcherAuthRun: false,
  watcherNoAuthRun: false,
  alwaysRunDayWatcher: false,
};

// Keep track of which watchers are running,
// use name as a key for no auth watchers
// use name+username as a key for auth watchers
const MOCK_REDIS = {};

const Users = [
  {
    name: 'user1',
    email: 'user1@example.com',
    subscriptions: {
      'github-notifications': {
        auth: {
          token: process.env.GITHUB_NOTIFICATIONS_TOKEN,
        },
        notificationTypes: {
          subscribed: ['user1TelegramChatId1'],
        },
        snapshot: {},
      },
      'unired-tag': {
        auth: {
          rut: process.env.RUT,
        },
        notificationTypes: {
          updatedBallot: ['user1TelegramChatId1'],
        },
        snapshot: {},
      },
      gtd: {
        notificationTypes: {
          newPlan: ['user1TelegramChatId1'],
        },
      },
      vtr: {
        notificationTypes: {
          newPlan: ['user1Email1'],
        },
      },
    },
  },
  {
    name: 'user2',
    email: 'user2@example.com',
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
          newPlan: ['user2TelegramChatId1', 'user2Email1'],
        },
      },
      vtr: {
        notificationTypes: {
          newPlan: ['user2TelegramChatId2'],
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

      let response;
      try {
        response = await executor.run(watch, {
          auth,
          snapshot: previousSnapshot,
        });
      } catch (error) {
        if (
          error.status === HTTP_CODES.unauthorized ||
          error.status === HTTP_CODES.forbidden
        ) {
          // TODO: send notification to user https://github.com/notify-watcher/server/issues/56
          return;
        }
        // TODO: rollbar
        console.warn(
          `ERR: Watcher ${watcherName} for user ${user.name} threw error`,
        );
        console.warn(error);
        return;
      }

      const { notifications, error, snapshot } = response;
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
      if (notifications.length === 0) return;

      usersNotifications.push({ user, notifications });
    });

    await Promise.all(runWatchersPromises);
    if (usersNotifications.length === 0) return;

    sendWatcherNotifications(watcherName, usersNotifications);

    if (env.isDev && LOCAL_ENV.watcherAuthRun) {
      console.log(`\n# Watcher ${watcherName} usersNotifications`);
      console.log(
        util.inspect(usersNotifications, { showHidden: false, depth: 3 }),
      );
    }
  });
}

async function runWatchersNoAuth(watchers) {
  const runDate = new Date();
  watchers.forEach(async watcher => {
    if (!shouldRunWatcher(watcher, runDate)) return;

    const { name: watcherName, watch } = watcher;
    // eslint-disable-next-line no-useless-return
    if (await isRunning(watcherName)) return;

    const snapshotDocument = await Snapshot.forWatcher(watcherName);
    const previousSnapshot = snapshotDocument.snapshot;

    let response;
    try {
      response = await executor.run(watch, {
        snapshot: previousSnapshot,
      });
    } catch (error) {
      // TODO: rollbar
      console.warn(`ERR: Watcher ${watcherName} threw error`);
      console.warn(error);
      return;
    }

    const { notifications, error, snapshot } = response;
    await snapshotDocument.updateSnapshot(snapshot);
    logWatcherIteration({
      watcherName,
      previousSnapshot,
      newSnapshot: snapshot,
      notifications,
      error,
    });
    if (notifications.length === 0) return;

    const users = await usersForWatcher(watcherName);
    if (users.length === 0) return;

    const usersNotifications = users.map(user => ({
      user,
      notifications,
    }));
    sendWatcherNotifications(watcherName, usersNotifications);

    if (env.isDev && LOCAL_ENV.watcherNoAuthRun) {
      console.log(`\n# Watcher ${watcherName} usersNotifications`);
      console.log(
        util.inspect(usersNotifications, { showHidden: false, depth: 3 }),
      );
    }
  });
}

module.exports = {
  runWatchersAuth,
  runWatchersNoAuth,
};
