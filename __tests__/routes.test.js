const request = require('supertest');
const server = require('../index.js');

// close the server after each test
afterAll(() => {
  server.close();
});

describe('basic route tests', () => {
  test('get home route GET /', async () => {
    const response = await request(server).get('/');
    expect(response.status).toEqual(200);
    expect(response.text).toContain('Hello World!');
  });
});
