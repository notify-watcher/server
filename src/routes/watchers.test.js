const request = require('../tests/supertest');

describe('watchers route tests', () => {
  test('get all watchers  GET /watchers', async () => {
    const response = await request.get('/watchers');
    expect(response.status).toEqual(200);
  });
});
