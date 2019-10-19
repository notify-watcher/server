// TODO: This key should also be moved to @notify-watcher/core
const ALL_WATCHERS_KEY = 'all';

// TODO: We can add authentication for a repo using { username, token }
// Then we clone as https://username:token@github.com/org/repo

/**
 * An array of all repos from where to download watchers.
 * Each object in the array should contain the following keys:
 *
 * ```js
 * {
 *  url: 'The repo url to clone',
 *  branch: '(Optional) The branch of the repo to checkout',
 *  commit: '(Optional) The commit of the repo to checkout',
 *  watchers: 'Array of watchers names or the ALL_WATCHERS_KEY string'
 * }
 * ```
 *
 * Either `branch` or `commit` **MUST** be defined, if both are not
 * specified then watchers won't be downloaded.
 */
const WATCHERS_LIST = [
  {
    url: 'https://github.com/notify-watcher/watchers',
    branch: 'watcher-unired-tag-total',
    watchers: ['gtd', 'github-notifications', 'vtr', 'unired-tag'],
  },
];

module.exports = { WATCHERS_LIST, ALL_WATCHERS_KEY };
