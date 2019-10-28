const { loadWatchers } = require('../watchers/load-watchers');
const request = require('../tests/supertest');
const { HTTP_CODES } = require('../constants');

describe('watchers routes', () => {
  describe('GET /watchers', () => {
    const { watchersList } = loadWatchers();
    let response;

    beforeAll(async () => {
      response = await request.get('/watchers');
    });

    it('should return "ok"', () => expect(response.status).toBe(HTTP_CODES.ok));
    it('should be an array', () => expect(response.body).toBeInstanceOf(Array));
    it('should have same length as watchersList', () =>
      expect(response.body).toHaveLength(watchersList.length));
  });
});
