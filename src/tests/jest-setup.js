const mongoose = require('../mongoose');
const config = require('../config');

jest.mock('../../src/emails');

/**
 * Connect to a new database before running any tests.
 */
beforeAll(() => mongoose.connect(config.DATABASE_URL));

/**
 * Clear all test data after every test.
 */
afterEach(() => mongoose.clearDatabase());

/**
 * Remove and close the db and server.
 */
afterAll(() => mongoose.dropDatabase());
