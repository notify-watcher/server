module.exports = {
  testEnvironment: 'node',
  testPathIgnorePatterns: ['/node_modules/', 'watchers/'],
  setupFilesAfterEnv: ['./lib/jest/setup.js'],
};
