const path = require('path');
const { version: VERSION } = require('../package.json');
// THIS GENERATES A CIRCULAR DEPENDENCY, fix later
// const { clientKinds } = require('./notifications/clients');

const TEMP_DIR_PATH = path.resolve(path.join('.', 'tmp'));
const DEFAULT_DB_NAME = 'notify-watcher';

const {
  DATABASE_USERNAME,
  DATABASE_PASSWORD,
  DATABASE_HOST,
  DATABASE_NAME,
  DATABASE_PORT = '27017',
  DOWNLOAD_WATCHERS = false,
  GIT_DESCRIBE,
  NODE_ENV = 'development',
  NOTIFY_WATCHER_TOKEN = 'secret',
  NOTIFY_WATCHER_TELEGRAM_URL = 'http://localhost:3003',
  PORT = 3000,
} = process.env;

const isDev = NODE_ENV === 'development';
const isTest = NODE_ENV === 'test';
const isProd = NODE_ENV === 'production';

function databaseUrl() {
  const dbName =
    DATABASE_NAME || (isTest ? `${DEFAULT_DB_NAME}-test` : DEFAULT_DB_NAME);
  if (DATABASE_HOST)
    return `mongodb://${DATABASE_HOST}:${DATABASE_PORT}/${dbName}`;

  return `mongodb://localhost/${dbName}`;
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
  DATABASE_USERNAME,
  DATABASE_PASSWORD,
  DATABASE_URL: databaseUrl(),
  DOWNLOAD_WATCHERS,
  GIT_DESCRIBE,
  VERSION,
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
