const path = require('path');

const TEMP_DIR_PATH = path.resolve(path.join('.', 'tmp'));

const config = {
  PORT: process.env.PORT || 3000,
  DATABASE_URL: 'mongodb://localhost/notify-watcher',
  DOWNLOAD_WATCHERS: process.env.DOWNLOAD_WATCHERS || false,
  WATCHERS: [],
  WATCHERS_TEMP_PATH: path.resolve(path.join(TEMP_DIR_PATH, 'watchers')),
  WATCHERS_PATH: path.resolve(path.join('.', 'watchers')),
};

module.exports = config;
