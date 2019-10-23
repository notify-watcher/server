const { sendToken: sendTokenEmail } = require('../emails');
const User = require('../models/user');

const STATUS_CODES = {
  created: 201,
  noContent: 204,
};

async function sendToken(ctx) {
  const { email } = ctx.request.body;
  let user = await User.findOne({ email });
  ctx.status = STATUS_CODES.noContent;
  if (!user) {
    user = await User.create({ email });
    await user.createSecret();
    ctx.status = STATUS_CODES.created;
  }
  const token = await user.generateToken();
  await sendTokenEmail(email, token);
}

module.exports = {
  sendToken,
};
