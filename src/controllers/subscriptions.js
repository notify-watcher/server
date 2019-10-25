const createError = require('http-errors');
const User = require('../models/user');

async function subscribe(ctx) {
  const { email, watcher, auth, notificationTypes } = ctx.request.body;
  const user = await User.findOne({ email }).orFail(() =>
    createError.NotFound('No user has this email'),
  );
  await user.updateSubscription(watcher, auth, notificationTypes);
}

module.exports = {
  subscribe,
};
