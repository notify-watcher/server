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

function runWatchersAuth(watchers) {
  watchers.forEach(async watcher => {
    const { name: watcherName } = watcher;
    const users = Users.filter(user => user.subscriptions[watcherName]);
    users.forEach(user => {
      const { name: username } = user;
      const runId = `${watcherName}:${username}`;
      if (isRunning(runId)) return;
      // TODO: run
    });
  });
}

function runWatchersNoAuth(watchers) {
  watchers.forEach(async watcher => {
    const { name } = watcher.name;
    if (isRunning(name)) return;
    // TODO: Run
  });
}

module.exports = {
  runWatchersAuth,
  runWatchersNoAuth,
};
