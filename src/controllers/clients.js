const httpErrors = require('../../lib/http-errors');
const User = require('../models/user');

async function register(ctx, next) {
  const { email, token, clientData } = ctx.request.body;
  const user = await User.findOne({ email });
  if (!user) return next(httpErrors.unauthorized('Please use a valid user.'));
  const verification = await user.verifyToken(token);
  if (!verification) {
    const message = ```
      Invalid code. You can generate a new code to be sure it is
      still valid before attempt to register a client.```;
    return next(httpErrors.unauthorized(message));
  }
  const client = await user.addClient(clientData);
  ctx.body = { client };
  return next();
}

module.exports = {
  register,
};
