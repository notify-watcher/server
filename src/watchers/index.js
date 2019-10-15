/* eslint-disable no-await-in-loop */
/* eslint-disable no-console */
const fs = require('fs-extra');
const config = require('../../config');
const { DOWNLOADED_DIR_PATH } = require('./config');
const downloadWatchers = require('./download-watchers');
const loadWatchersList = require('./load-watchers-list');

async function setUpWatchers() {
  await downloadWatchers();

  config.WATCHERS = fs
    .readdirSync(DOWNLOADED_DIR_PATH, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .filter(({ name }) => name[0] !== '.')
    .map(({ name }) => name);

  const { minuteWatchers, hourWatchers } = loadWatchersList();
}

if (require.main === module) {
  setUpWatchers().then(() => console.log('\nDownloaded watchers'));
}

module.exports = setUpWatchers;
