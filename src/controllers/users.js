const createError = require('http-errors');
const _ = require('lodash');
const { sendToken: sendTokenEmail } = require('../emails');
const User = require('../models/user');
const { HTTP_CODES } = require('../constants');

async function sendToken(ctx) {
  const { email } = ctx.request.body;
  let user = await User.findOne({ email });
  ctx.status = HTTP_CODES.noContent;
  if (!user) {
    user = await User.create({ email });
    await user.createSecret();
    ctx.status = HTTP_CODES.created;
  }
  const token = await user.generateToken();
  await sendTokenEmail(email, token);
}

// TODO: add auth
async function show(ctx) {
  const { email } = ctx.params;
  const user = await User.findOne({ email }).orFail(() =>
    createError.NotFound('No user has this email'),
  );
  ctx.body = _.pick(user, ['email', 'clients', 'subscriptions']);
}

module.exports = {
  sendToken,
  show,
};
