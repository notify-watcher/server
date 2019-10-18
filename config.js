const path = require('path');

const TEMP_DIR_PATH = path.resolve(path.join('.', 'tmp'));

const { NODE_ENV, DATABASE_URL, PORT = 3000, DOWNLOAD_WATCHERS } = process.env;

const isDev = NODE_ENV === 'development';
const isTest = NODE_ENV === 'test';
const isProd = NODE_ENV === 'production';

function databaseUrl() {
  if (DATABASE_URL) return DATABASE_URL;
  if (isTest) return 'mongodb://localhost/notify-watcher-test';
  return 'mongodb://localhost/notify-watcher';
}

const config = {
  env: {
    isDev,
    isTest,
    isProd,
  },
  PORT,
  DATABASE_URL: databaseUrl(),
  DOWNLOAD_WATCHERS: DOWNLOAD_WATCHERS,
  WATCHERS: [],
  WATCHERS_TEMP_PATH: path.resolve(path.join(TEMP_DIR_PATH, 'watchers')),
  WATCHERS_PATH: path.resolve(path.join('.', 'watchers')),
};

module.exports = config;
