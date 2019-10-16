const path = require('path');

const TEMP_DIR_PATH = path.resolve('./tmp');

const config = {
  PORT: process.env.PORT || 3000,
  DOWNLOAD_WATCHERS: process.env.DOWNLOAD_WATCHERS || false,
  WATCHERS: [],
  WATCHERS_TEMP_PATH: path.resolve(`${TEMP_DIR_PATH}/watchers`),
  WATCHERS_PATH: path.resolve(`./watchers`),
};

module.exports = config;
