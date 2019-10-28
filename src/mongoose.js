const mongoose = require('mongoose');

// To fix https://github.com/Automattic/mongoose/issues/4291
mongoose.Promise = global.Promise;

/**
 * Connect to the database.
 */
function connect(databaseUrl) {
  return mongoose.connect(databaseUrl, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
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
