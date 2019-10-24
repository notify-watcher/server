const path = require('path');

const TEMP_DIR_PATH = path.resolve(path.join('.', 'tmp'));

const {
  NODE_ENV = 'development',
  DATABASE_HOST,
  DATABASE_NAME = 'notify-watcher',
  DATABASE_PORT = '27017',
  PORT = 3000,
  DOWNLOAD_WATCHERS = false,
} = process.env;

const isDev = NODE_ENV === 'development';
const isTest = NODE_ENV === 'test';
const isProd = NODE_ENV === 'production';

function databaseUrl() {
  if (DATABASE_HOST)
    return `mongodb://${DATABASE_HOST}:${DATABASE_PORT}/${DATABASE_NAME}`;
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
  DOWNLOAD_WATCHERS,
  WATCHERS: [],
  WATCHERS_TEMP_PATH: path.resolve(path.join(TEMP_DIR_PATH, 'watchers')),
  WATCHERS_PATH: path.resolve(path.join('.', 'watchers')),
};

module.exports = config;
