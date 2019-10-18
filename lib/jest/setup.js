const mongoose = require('mongoose');
const config = require('../../config');

let testDatabase;

beforeAll(async () => {
  testDatabase = await mongoose.connect(config.DATABASE_URL);
});

afterAll(async () => {
  const { connection } = testDatabase;
  await connection.db.dropDatabase();
  await connection.close();
});
