const mongoose = require('../mongoose');
const config = require('../config');

jest.mock('../../src/emails');

/**
 * Connect to a new database before running any tests.
 */
beforeAll(() => mongoose.connect(config.DATABASE_URL));

/**
 * Disconnect from the database.
 */
afterAll(() => mongoose.close());
