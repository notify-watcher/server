const ALL_WATCHERS_KEY = 'all';

// We can add authentication for a repo using { username, token }
// Then we clone as https://username:token@github.com/org/repo

const WATCHERS_LIST = [
  {
    url: 'https://github.com/notify-watcher/watchers',
    branch: 'master',
    watchers: ['gtd', 'github-notifications', 'vtr'],
  },
];

module.exports = { WATCHERS_LIST, ALL_WATCHERS_KEY };
