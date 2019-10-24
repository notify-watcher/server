module.exports = {
  testEnvironment: 'node',
  testPathIgnorePatterns: ['/node_modules/', 'watchers/'],
  setupFilesAfterEnv: ['./src/test/jest-setup.js'],
};
