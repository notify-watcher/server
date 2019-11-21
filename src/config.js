const path = require('path');
// THIS GENERATES A CIRCULAR DEPENDENCY, fix later
// const { clientKinds } = require('./notifications/clients');

const TEMP_DIR_PATH = path.resolve(path.join('.', 'tmp'));

const {
  DATABASE_USERNAME,
  DATABASE_PASSWORD,
  DATABASE_HOST,
  DATABASE_NAME = 'notify-watcher',
  DATABASE_PORT = '27017',
  DOWNLOAD_WATCHERS = false,
  NODE_ENV = 'development',
  NOTIFY_WATCHER_TOKEN = 'secret',
  NOTIFY_WATCHER_TELEGRAM_URL = 'http://localhost:3003',
  PORT = 3000,
} = process.env;

const isDev = NODE_ENV === 'development';
const isTest = NODE_ENV === 'test';
const isProd = NODE_ENV === 'production';

function databaseUrl() {
  if (isTest) return 'mongodb://localhost/notify-watcher-test';

  if (DATABASE_HOST) {
    if (!DATABASE_USERNAME || !DATABASE_PASSWORD)
      throw new Error('Missing username or password for database');

    return `mongodb://${DATABASE_USERNAME}:${DATABASE_PASSWORD}@${DATABASE_HOST}:${DATABASE_PORT}/${DATABASE_NAME}`;
  }

  return 'mongodb://localhost/notify-watcher';
}

// We can clone a private repo using the following url format
// https://<username>:<token>@github.com/<org>/<repo>

/**
 * An array of all repos from where to download watchers.
 * Each object in the array should contain the following keys:
 *
 * ```js
 * {
 *  url: 'The repo url to clone',
 *  branch: '(Optional) The branch of the repo to checkout',
 *  commit: '(Optional) The commit of the repo to checkout',
 *  watchers: 'Array of watchers names or the WATCHERS_LIST_DOWNLOAD_ALL_KEY string'
 * }
 * ```
 *
 * Either `branch` or `commit` **MUST** be defined, if both are not
 * specified then watchers won't be downloaded.
 */
const WATCHERS_LIST = [
  {
    url: 'https://github.com/notify-watcher/watchers',
    branch: 'master',
    watchers: ['gtd', 'github-notifications', 'vtr', 'unired-tag'],
  },
];

const config = {
  api: {
    port: PORT,
    authToken: {
      headerName: 'x-notify-watcher-token',
      headerValue: NOTIFY_WATCHER_TOKEN,
    },
  },
  clients: {
    telegram: {
      url: NOTIFY_WATCHER_TELEGRAM_URL,
    },
  },
  env: {
    isDev,
    isTest,
    isProd,
  },
  DATABASE_URL: databaseUrl(),
  DOWNLOAD_WATCHERS,
  WATCHERS_LIST,
  WATCHERS_LIST_DOWNLOAD_ALL_KEY: 'all',
  WATCHERS_PATH: path.resolve(path.join('.', 'watchers')),
  WATCHERS_TEMP_PATH: path.resolve(path.join(TEMP_DIR_PATH, 'watchers')),
  WATCHERS: {
    list: [],
    watchers: {},
  },
};

module.exports = config;
