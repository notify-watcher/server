const createError = require('http-errors');
const User = require('../models/user');

async function subscribe(ctx) {
  const { email, token, subscriptionsData } = ctx.request.body;
  const user = await User.findOne({ email }).orFail(() =>
    createError.NotFound('No user has this email'),
  );
  const verification = await user.verifyToken(token);
  ctx.assert(verification, createError.Unauthorized('Invalid code'));
  await user.updateSubscriptions(subscriptionsData);
}

module.exports = {
  subscribe,
};
