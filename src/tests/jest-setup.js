const mongoose = require('../mongoose');
const config = require('../config');

jest.mock('../../src/emails');

config.WATCHERS = {
  list: [
    {
      name: 'mock-watcher',
      displayName: 'Mock Watcher',
      description: 'A mock watcher',
    },
  ],
  watchers: {
    'mock-watcher': {
      config: {
        auth: false,
        notificationTypes: [
          {
            type: 'mock-notification-type',
            description: 'A notification type mock',
          },
        ],
      },
      watch: jest.fn(),
    },
  },
};

/**
 * Connect to a new database before running any tests.
 */
beforeAll(() => mongoose.connect(config.DATABASE_URL));

/**
 * Disconnect from the database.
 */
afterAll(() => mongoose.close());
