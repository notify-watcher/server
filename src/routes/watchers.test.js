const request = require('../tests/supertest');
const { HTTP_CODES } = require('../constants');

describe('watchers routes', () => {
  describe('GET /watchers', () => {
    it('should return "ok"', () =>
      request.get('/watchers').expect(HTTP_CODES.ok));
  });
});
