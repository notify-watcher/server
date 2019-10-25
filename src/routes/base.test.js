const request = require('../test/supertest');
const { HTTP_CODES } = require('../test/constants');

describe('basic routes', () => {
  describe('GET /', () => {
    it('should return "ok"', () => request.get('/').expect(HTTP_CODES.ok));
  });
});
