const config = require('../../config');

async function list(ctx) {
  ctx.body = config.WATCHERS;
}

module.exports = {
  list,
};
