const mongoose = require('mongoose');

// To fix https://github.com/Automattic/mongoose/issues/4291
mongoose.Promise = global.Promise;

/**
 * Connect to the database.
 */
const connect = databaseUrl =>
  mongoose.connect(databaseUrl, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

/**
 * Drop database and close the connection.
 */
const dropDatabase = async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
};

module.exports = {
  connect,
  dropDatabase,
};
