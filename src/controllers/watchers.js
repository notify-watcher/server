const _ = require('lodash');
const config = require('../config');

function list(ctx) {
  ctx.body = config.WATCHERS.list;
}

function show(ctx) {
  const { watcher: watcherName } = ctx.params;
  const watcher = config.WATCHERS.watchers[watcherName];
  ctx.body = {
    ..._.pick(watcher, ['name', 'displayName', 'description']),
    ..._.pick(watcher.config, ['auth', 'notificationTypes']),
  };
}

module.exports = {
  list,
  show,
};
