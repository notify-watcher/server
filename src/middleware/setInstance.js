const createError = require('http-errors');
const User = require('../models/user');

const defaultOptions = {
  fromBody: false,
};

function setInstance(Model, paramName, resourceName, options) {
  const finalOptions = { ...defaultOptions, ...options };
  const { fromBody } = finalOptions;
  return async function setInstanceMiddleware(ctx, next) {
    if (ctx.state[resourceName]) return next();

    const paramValue = (fromBody ? ctx.request.body : ctx.params)[paramName];
    const query = { [paramName]: paramValue };
    ctx.state[resourceName] = await Model.findOne(query).orFail(
      createError.NotFound(`No ${resourceName} has this ${paramName}`),
    );

    return next();
  };
}

module.exports = {
  setInstance,
  setUserInstace: setInstance(User, 'email', 'user'),
};
