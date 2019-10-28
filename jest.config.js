module.exports = {
  globalTeardown: './src/tests/jest-global-teardown.js',
  setupFilesAfterEnv: ['./src/tests/jest-setup.js'],
  testEnvironment: 'node',
  testPathIgnorePatterns: ['/node_modules/', 'watchers/'],
};
