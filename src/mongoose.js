const mongoose = require('mongoose');
const config = require('./config');

// To fix https://github.com/Automattic/mongoose/issues/4291
mongoose.Promise = global.Promise;

const defaultOptions = {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const authOptions = config.DATABASE_USERNAME &&
  config.DATABASE_PASSWORD && {
    auth: { authSource: 'admin' },
    user: config.DATABASE_USERNAME,
    pass: config.DATABASE_PASSWORD,
  };

/**
 * Connect to the database.
 * @param {string} databaseUrl Url of the database
 */
function connect(databaseUrl) {
  const options = authOptions
    ? { ...defaultOptions, ...authOptions }
    : defaultOptions;
  return mongoose.connect(databaseUrl, options);
}

/**
 * Drop database and close the connection.
 */
async function dropDatabase() {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
}

function close() {
  return mongoose.connection.close;
}

module.exports = {
  close,
  connect,
  dropDatabase,
};
