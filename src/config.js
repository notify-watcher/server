const path = require('path');

const TEMP_DIR_PATH = path.resolve(path.join('.', 'tmp'));

const {
  DATABASE_HOST,
  DATABASE_NAME = 'notify-watcher',
  DATABASE_PORT = '27017',
  DOWNLOAD_WATCHERS = false,
  NODE_ENV = 'development',
  NOTIFY_WATCHER_SERVER_TOKEN = 'server-token',
  NOTIFY_WATCHER_TELEGRAM_TOKEN = 'telegram-token',
  PORT = 3000,
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
  api: {
    port: PORT,
    serverToken: {
      headerName: 'x-notify-watcher-server-token',
      headerValue: NOTIFY_WATCHER_SERVER_TOKEN,
    },
    telegramToken: {
      headerName: 'x-notify-watcher-telegram-token',
      headerValue: NOTIFY_WATCHER_TELEGRAM_TOKEN,
    },
  },
  env: {
    isDev,
    isTest,
    isProd,
  },
  DATABASE_URL: databaseUrl(),
  DOWNLOAD_WATCHERS,
  NOTIFY_WATCHER_SERVER_TOKEN,
  NOTIFY_WATCHER_TELEGRAM_TOKEN,
  WATCHERS_PATH: path.resolve(path.join('.', 'watchers')),
  WATCHERS_TEMP_PATH: path.resolve(path.join(TEMP_DIR_PATH, 'watchers')),
  WATCHERS: [],
};

module.exports = config;
