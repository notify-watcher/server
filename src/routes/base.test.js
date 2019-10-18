const request = require('./supertest');

describe('basic route tests', () => {
  test('get home route GET /', async () => {
    const response = await request.get('/');
    expect(response.status).toEqual(200);
    expect(response.text).toContain('Hello World!');
  });
});
