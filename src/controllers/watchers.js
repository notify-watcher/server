const config = require('../config');

function list(ctx) {
  ctx.body = config.WATCHERS.list;
}

function show(ctx) {
  const { watcher: watcherName } = ctx.params;
  const watcher = config.WATCHERS.watchers[watcherName];
  ctx.body = watcher;
}

module.exports = {
  list,
  show,
};
