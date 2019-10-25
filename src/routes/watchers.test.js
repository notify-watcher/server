const request = require('../test/supertest');

describe('watchers routes', () => {
  describe('GET /watchers', () => {
    it('should return 200', async () => {
      await request.get('/watchers').expect(200);
    });
  });
});
