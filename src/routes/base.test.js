const request = require('../tests/supertest');
const { HTTP_CODES } = require('../constants');

describe('basic routes', () => {
  describe('GET /', () => {
    it('should return "ok"', () => request.get('/').expect(HTTP_CODES.ok));
  });
});
