const mongoose = require('mongoose');

function dbConnect(databaseUrl) {
  return mongoose.connect(databaseUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
}

module.exports = {
  dbConnect,
};
