const mongoose = require('../mongoose');
const config = require('../config');

jest.mock('../../src/emails');

/**
 * Connect to a new database before running any tests.
 */
beforeAll(() => mongoose.connect(config.DATABASE_URL));

/**
 * Remove and close the db and server.
 */
afterAll(() => mongoose.dropDatabase());
