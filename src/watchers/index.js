/* eslint-disable no-await-in-loop */
/* eslint-disable no-console */
const fs = require('fs-extra');
const git = require('nodegit');
const config = require('../../config');
const { WATCHERS_LIST, ALL_WATCHERS_KEY } = require('./list');

const tempDirPath = `${__dirname}/tmp`;
const downloadedDirPath = `${__dirname}/downloaded`;

function ref(branch) {
  return `refs/remotes/origin/${branch}`;
}

function saveWatchers(names, repoTempPath) {
  config.WATCHERS = config.WATCHERS.concat(names);
  names.forEach(name =>
    fs.copySync(`${repoTempPath}/${name}`, `${downloadedDirPath}/${name}`),
  );
}

async function setUpWatchers() {
  if (!config.DOWNLOAD_WATCHERS) return;
  config.WATCHERS = [];
  fs.emptyDirSync(tempDirPath);
  fs.emptyDirSync(downloadedDirPath);

  await Promise.all(
    WATCHERS_LIST.map(async (watcher, index) => {
      const repoTempPath = `${tempDirPath}/${index}`;
      const { url, branch, commit, watchers } = watcher;

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

  fs.emptyDirSync(tempDirPath);

  // TODO: Set up crons for running watchers
}

if (require.main === module) {
  setUpWatchers().then(() => console.log('\nDownloaded watchers'));
}

module.exports = setUpWatchers;
