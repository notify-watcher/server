const createError = require('http-errors');
const User = require('../models/user');
const { HTTP_CODES } = require('../constants');

async function subscribe(ctx) {
  const { email, watcher, auth, notificationTypes } = ctx.request.body;
  const user = await User.findOne({ email }).orFail(() =>
    createError.NotFound('No user has this email'),
  );
  try {
    const subscription = await user.updateSubscription(
      watcher,
      auth,
      notificationTypes,
    );
    ctx.body = { subscription };
    ctx.status = HTTP_CODES.created;
  } catch (err) {
    ctx.throw(createError.BadRequest('Invalid subscription'));
  }
}

module.exports = {
  subscribe,
};
