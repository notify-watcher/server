const ALL_WATCHERS_KEY = 'all';

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
];

module.exports = { WATCHERS_LIST, ALL_WATCHERS_KEY };
