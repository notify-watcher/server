const emails = require('../emails');
const User = require('../models/user');

async function sendToken(ctx) {
  const { email } = ctx.request.body;
  let newUser = false;
  let user = await User.findOne({ email });
  if (!user) {
    user = await User.create({ email });
    await user.createSecret();
    newUser = true;
  }
  const token = await user.generateToken();
  await emails.emailSender.send({
    template: emails.templates.sendToken,
    message: {
      to: email,
    },
    locals: {
      token,
    },
  });
  ctx.body = {
    email,
    newUser,
  };
}

module.exports = {
  sendToken,
};
