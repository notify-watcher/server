const request = require('../tests/supertest');

describe('watchers routes', () => {
  describe('GET /watchers', () => {
    it('should return 200', async () => {
      await request.get('/watchers').expect(200);
    });
  });
});
