const User = require('../models/user');

async function register(ctx) {
  const { email, token, clientData } = ctx.request.body;
  let user = await User.findOne({ email });
  if (!user) {
    console.log('email does not exists');
    return;
  }
  const verification = await user.verifyToken(token);
  if (!verification) {
    console.log('invalid token');
    return;
    // TODO
  }
  const client = await user.addClient(clientData);
  return {
    client,
  };
}

module.exports = {
  register,
};
