const config = require('../config');
const mongoose = require('../mongoose');

async function globalTeardown() {
  await mongoose.connect(config.DATABASE_URL);
  await mongoose.dropDatabase();
}

module.exports = globalTeardown;
