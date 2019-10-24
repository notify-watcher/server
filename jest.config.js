module.exports = {
  testEnvironment: 'node',
  testPathIgnorePatterns: ['/node_modules/', 'watchers/'],
  setupFilesAfterEnv: ['./src/tests/jest-setup.js'],
};
