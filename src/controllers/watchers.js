const config = require('../../config');

async function find(ctx) {
  ctx.body = config.WATCHERS;
}

module.exports = {
  find,
};
