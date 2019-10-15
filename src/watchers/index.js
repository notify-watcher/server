/* eslint-disable no-console */
const fs = require('fs-extra');
const { CronJob } = require('cron');
const { DOWNLOADED_DIR_PATH } = require('./config');
const downloadWatchers = require('./download-watchers');
const loadWatchersList = require('./load-watchers-list');
const { runWatchersAuth, runWatchersNoAuth } = require('./run-watchers');

async function setUpWatchers() {
  await downloadWatchers();

  const watchersNames = fs
    .readdirSync(DOWNLOADED_DIR_PATH, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .filter(({ name }) => name[0] !== '.')
    .map(({ name }) => name);

  const {
    allWatchers,
    minuteWatchersAuth,
    minuteWatchersNoAuth,
    hourWatchersAuth,
    hourWatchersNoAuth,
  } = loadWatchersList(watchersNames);

  const minuteWatchersCronJob = new CronJob(
    '0,5,10,15,20,25,30,35,40,45,50,55 * * * * *', // change to one below
    // '* * * * * *',
    function runMinuteWatchers() {
      console.log('minute iteration');
      runWatchersAuth(minuteWatchersAuth);
      runWatchersNoAuth(minuteWatchersNoAuth);
    },
  );

  const hourWatchersCronJob = new CronJob(
    '0 0 * * * *',
    function runHourWatchers() {
      console.log('hour iteration');
      runWatchersAuth(hourWatchersAuth);
      runWatchersNoAuth(hourWatchersNoAuth);
    },
  );

  minuteWatchersCronJob.start();
  hourWatchersCronJob.start();

  console.log('minuteWatchersAuth', minuteWatchersAuth);
  console.log('minuteWatchersNoAuth', minuteWatchersNoAuth);
  console.log('hourWatchersAuth', hourWatchersAuth);
  console.log('hourWatchersNoAuth', hourWatchersNoAuth);

  return { watchers: allWatchers, minuteWatchersCronJob, hourWatchersCronJob };
}

if (require.main === module) {
  setUpWatchers().then(() => console.log('\nDownloaded watchers'));
}

module.exports = setUpWatchers;
