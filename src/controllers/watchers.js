const config = require('../config');

async function list(ctx) {
  ctx.body = config.WATCHERS.list;
}

module.exports = {
  list,
};
