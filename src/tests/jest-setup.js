const mongoose = require('../mongoose');
const config = require('../config');

jest.mock('../../src/emails');

const mockWatcher = {
  name: 'mock-watcher',
  displayName: 'Mock Watcher',
  description: 'A mock watcher',
};

config.WATCHERS = {
  list: [mockWatcher],
  watchers: {
    'mock-watcher': {
      ...mockWatcher,
      watch: jest.fn(),
      config: {
        auth: false,
        notificationTypes: [
          {
            type: 'mock-notification-type',
            description: 'A notification type mock',
          },
        ],
      },
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
