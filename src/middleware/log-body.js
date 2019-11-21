/* eslint-disable no-console */
const util = require('util');

function logBody(ctx, next) {
  console.log(util.inspect(ctx.request.body, { showHidden: false, depth: 2 }));
  return next();
}

module.exports = logBody;
