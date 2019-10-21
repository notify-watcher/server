let createError = require('http-errors');
const User = require('../models/user');

async function register(ctx) {
  const { email, token, clientData } = ctx.request.body;
  const user = await User.findOne({ email });
  if (!user) throw createError.Unauthorized('Please use a valid user.');
  const verification = await user.verifyToken(token);
  if (!verification) throw createError.Unauthorized('Invalid code');
  const client = await user.addClient(clientData);
  ctx.body = { client };
}

module.exports = {
  register,
};
