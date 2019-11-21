const { errorsMiddleware } = require('./errors');
const { setInstance, setUserInstace } = require('./setInstance');
const logBody = require('./log-body');

module.exports = {
  errorsMiddleware,
  logBody,
  setInstance,
  setUserInstace,
};
