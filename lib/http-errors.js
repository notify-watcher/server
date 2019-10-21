const createError = require('http-errors');

const CODES = {
  UNAUTHORIZED: 401,
};

function unauthorized(message = 'Unauthorized') {
  return createError(CODES.UNAUTHORIZED, message);
}

module.exports = {
  unauthorized,
};
