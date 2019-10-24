const mongoose = require('../mongoose');
const config = require('../config');

jest.mock('../../src/emails');

let testDatabase;

beforeAll(async () => {
  testDatabase = await mongoose.dbConnect(config.DATABASE_URL);
});

afterAll(async () => {
  const { connection } = testDatabase;
  await connection.db.dropDatabase();
  await connection.close();
});
