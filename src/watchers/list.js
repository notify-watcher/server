const ALL_WATCHERS_KEY = 'all';

// We can add authentication for a repo using { username, token }
// Then we clone as https://username:token@github.com/org/repo

const WATCHERS_LIST = [
  {
    url: 'https://github.com/notify-watcher/watchers',
    branch: 'master',
    watchers: ['gtd'],
  },
  {
    url: 'https://github.com/notify-watcher/watchers',
    commit: '4e61a833073a56bbe19ff966f09129f6b165f95a',
    watchers: ALL_WATCHERS_KEY,
  },
  {
    url: 'https://github.com/notify-watcher/watchers',
    watchers: ALL_WATCHERS_KEY,
  },
  {
    url: 'https://github.com/notify-watcher/watchers',
    branch: 'master',
  },
  {
    url: 'https://github.com/notify-watcher/watchers',
    commit: '4e61a833073a56bbe19ff966f09129f6b165f95a',
  },
];

module.exports = { WATCHERS_LIST, ALL_WATCHERS_KEY };
