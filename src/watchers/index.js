/* eslint-disable no-await-in-loop */
/* eslint-disable no-console */
const fs = require('fs-extra');
const git = require('nodegit');
const { DONT_DOWNLOAD_WATCHERS } = require('../../config');
const { WATCHERS_LIST, ALL_WATCHERS_KEY } = require('./list');

const tempDirPath = `${__dirname}/tmp`;
const downloadedDirPath = `${__dirname}/downloaded`;

function ref(branch) {
  return `refs/remotes/origin/${branch}`;
}

function saveWatchers(names) {
  console.log('Saving watchers:', names);
  names.forEach(name =>
    fs.copySync(`${tempDirPath}/${name}`, `${downloadedDirPath}/${name}`),
  );
}

async function setUpWatchers() {
  let allWatchers = [];
  if (DONT_DOWNLOAD_WATCHERS) return allWatchers;
  fs.emptyDirSync(downloadedDirPath);
  for (let i = 0; i < WATCHERS_LIST.length; i += 1) {
    const watcher = WATCHERS_LIST[i];
    const { url, branch, commit, watchers } = watcher;
    fs.emptyDirSync(tempDirPath);
    console.log('Downloading:', watcher);
    const repo = await git.Clone(url, tempDirPath);
    let reference;
    if (branch) {
      reference = await repo.getBranch(ref(branch));
    } else if (commit) {
      const oid = git.Oid.fromString(commit);
      reference = await git.Reference.create(repo, ref(branch), oid, 1, '');
    } else return console.warn(`No branch or commit for remote ${url}`);
    await repo.checkoutRef(reference);

    const watchersNames = fs
      .readdirSync(tempDirPath, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(({ name }) => name)
      .filter(name => name[0] !== '.')
      .filter(name => watchers === ALL_WATCHERS_KEY || watchers.includes(name));
    saveWatchers(watchersNames);
    allWatchers = [...allWatchers, ...watchersNames];
  }
  fs.emptyDirSync(tempDirPath);

  // TODO: Set up crons for running watchers

  return allWatchers;
}

module.exports = setUpWatchers;
