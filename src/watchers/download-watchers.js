/* eslint-disable no-console */
const fs = require('fs-extra');
const git = require('nodegit');
const config = require('../../config');
const { WATCHERS_LIST, ALL_WATCHERS_KEY } = require('./list');

function ref(branch) {
  return `refs/remotes/origin/${branch}`;
}

function saveWatchers(names, repoTempPath) {
  names.forEach(name =>
    fs.copySync(`${repoTempPath}/${name}`, `${config.WATCHERS_PATH}/${name}`),
  );
}

function isWatcherValid(watcher, index) {
  const { url, branch, commit, watchers } = watcher;
  const warningMessages = [];
  if (!url) warningMessages.push(`WARN: No url for i:${index} ${url}`);
  if (!branch && !commit)
    warningMessages.push(`WARN: No branch or commit for i:${index} ${url}`);
  if (!watchers || watchers.length === 0)
    warningMessages.push(`WARN: No watchers for i:${index} ${url}`);

  if (warningMessages.length > 0) {
    warningMessages.forEach(message => console.warn(message));
    return false;
  }
  return true;
}

async function downloadWatchers() {
  if (!config.DOWNLOAD_WATCHERS) return;
  fs.emptyDirSync(config.WATCHERS_TEMP_PATH);
  fs.emptyDirSync(config.WATCHERS_PATH);
  console.table(WATCHERS_LIST);
  console.log();

  await Promise.all(
    WATCHERS_LIST.map(async (watcher, index) => {
      const repoTempPath = `${config.WATCHERS_TEMP_PATH}/${index}`;
      const { url, branch, commit, watchers } = watcher;

      if (!isWatcherValid(watcher, index)) return;

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
      saveWatchers(watchersNames, repoTempPath);
    }),
  );

  fs.emptyDirSync(config.WATCHERS_TEMP_PATH);
}

if (require.main === module) {
  downloadWatchers().then(() => console.log('\nDownloaded watchers'));
}

module.exports = downloadWatchers;
