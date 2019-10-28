const mongoose = require('mongoose');

// To fix https://github.com/Automattic/mongoose/issues/4291
mongoose.Promise = global.Promise;

/**
 * Connect to the database.
 */
const connect = async databaseUrl => {
  return mongoose.connect(databaseUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
};

/**
 * Drop database and close the connection.
 */
const dropDatabase = async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
};

/**
 * Remove all the data for all db collections.
 */
const clearDatabase = async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany();
  }
};

module.exports = {
  connect,
  dropDatabase,
  clearDatabase,
};
