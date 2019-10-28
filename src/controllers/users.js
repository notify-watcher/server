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

module.exports = {
  sendToken,
};
