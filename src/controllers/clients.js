const createError = require('http-errors');
const User = require('../models/user');
const { HTTP_CODES } = require('../constants');

async function register(ctx) {
  const { email, token, clientData } = ctx.request.body;
  const user = await User.findOne({ email }).orFail(() =>
    createError.NotFound('No user has this email'),
  );
  const verification = await user.verifyToken(token);
  ctx.assert(verification, createError.Unauthorized('Invalid code'));
  try {
    const client = await user.addClient(clientData);
    ctx.body = { client };
    ctx.status = HTTP_CODES.created;
  } catch (err) {
    ctx.throw(createError.BadRequest('Invalid client'));
  }
}

module.exports = {
  register,
};
