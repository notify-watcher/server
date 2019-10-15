/* eslint-disable no-await-in-loop */
/* eslint-disable no-console */
const fs = require('fs-extra');
const git = require('nodegit');
const config = require('../../config');
const { TEMP_DIR_PATH, DOWNLOADED_DIR_PATH } = require('./config');
const { WATCHERS_LIST, ALL_WATCHERS_KEY } = require('./list');
const loadWatchersList = require('./load-watchers-list');

function ref(branch) {
  return `refs/remotes/origin/${branch}`;
}

function saveWatchers(names, repoTempPath) {
  names.forEach(name =>
    fs.copySync(`${repoTempPath}/${name}`, `${DOWNLOADED_DIR_PATH}/${name}`),
  );
}

async function downloadWatchers() {
  if (!config.DOWNLOAD_WATCHERS) return;
  config.WATCHERS = [];
  fs.emptyDirSync(TEMP_DIR_PATH);
  fs.emptyDirSync(DOWNLOADED_DIR_PATH);
  console.table(WATCHERS_LIST);
  console.log();

  await Promise.all(
    WATCHERS_LIST.map(async (watcher, index) => {
      const repoTempPath = `${TEMP_DIR_PATH}/${index}`;
      const { url, branch, commit, watchers } = watcher;

      if (!url) return console.warn(`WARN: No url for i:${index} ${url}`);
      if (!branch && !commit)
        return console.warn(`WARN: No branch or commit for i:${index} ${url}`);
      if (!watchers || watchers.length === 0)
        return console.warn(`WARN: No watchers for i:${index} ${url}`);

      const repo = await git.Clone(url, repoTempPath);
      let reference;
      if (branch) {
        reference = await repo.getBranch(ref(branch));
      } else if (commit) {
        const oid = git.Oid.fromString(commit);
        reference = await git.Reference.create(repo, ref(branch), oid, 1, '');
      }
      await repo.checkoutRef(reference);

      const watchersNames = fs
        .readdirSync(repoTempPath, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(({ name }) => name)
        .filter(name => name[0] !== '.')
        .filter(
          name => watchers === ALL_WATCHERS_KEY || watchers.includes(name),
        );
      console.log(
        `i:${index} Saving ${watchersNames} from ${url}@${branch || commit}`,
      );
      return saveWatchers(watchersNames, repoTempPath);
    }),
  );

  fs.emptyDirSync(TEMP_DIR_PATH);
}

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
