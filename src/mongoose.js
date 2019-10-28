const mongoose = require('mongoose');

// To fix https://github.com/Automattic/mongoose/issues/4291
mongoose.Promise = global.Promise;

function dbConnect(databaseUrl) {
  return mongoose.connect(databaseUrl, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
}

module.exports = {
  dbConnect,
};
