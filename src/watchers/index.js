/* eslint-disable no-console */
const { CronJob } = require('cron');
const { env, WATCHERS_PATH } = require('../config');
const downloadWatchers = require('./download-watchers');
const { loadWatchers } = require('./load-watchers');
const { runWatchersAuth, runWatchersNoAuth } = require('./run-watchers');

async function setUpWatchers() {
  await downloadWatchers();

  const {
    watchers,
    minuteWatchersAuth,
    minuteWatchersNoAuth,
    hourWatchersAuth,
    hourWatchersNoAuth,
  } = loadWatchers(WATCHERS_PATH);

  const minuteWatchersCronJob = new CronJob(
    '0,5,10,15,20,25,30,35,40,45,50,55 * * * * *', // for dev
    // '0 * * * * *',
    function runMinuteWatchers() {
      console.log(new Date(), 'minute iteration');
      runWatchersAuth(minuteWatchersAuth);
      runWatchersNoAuth(minuteWatchersNoAuth);
    },
  );

  const hourWatchersCronJob = new CronJob(
    '0,5,10,15,20,25,30,35,40,45,50,55 * * * * *', // for dev
    // '0 0 * * * *',
    function runHourWatchers() {
      console.log(new Date(), 'hour iteration');
      runWatchersAuth(hourWatchersAuth);
      runWatchersNoAuth(hourWatchersNoAuth);
    },
  );

  if (env.isProd || env.isDev) {
    minuteWatchersCronJob.start();
    hourWatchersCronJob.start();

    console.log('');
    console.log('minuteWatchersAuth', minuteWatchersAuth);
    console.log('minuteWatchersNoAuth', minuteWatchersNoAuth);
    console.log('hourWatchersAuth', hourWatchersAuth);
    console.log('hourWatchersNoAuth', hourWatchersNoAuth);
  }

  return { watchers, minuteWatchersCronJob, hourWatchersCronJob };
}

module.exports = setUpWatchers;
