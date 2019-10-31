const request = require('../tests/supertest');
const config = require('../config');
const { HTTP_CODES } = require('../constants');

describe('watchers routes', () => {
  describe('GET /watchers', () => {
    const watchersList = config.WATCHERS.list;
    let response;

    beforeAll(async () => {
      response = await request.get('/watchers');
    });

    it('should return "ok"', () => expect(response.status).toBe(HTTP_CODES.ok));

    it('should be an array', () => expect(response.body).toBeInstanceOf(Array));

    it('should have same length as watchersList', () =>
      expect(response.body).toHaveLength(watchersList.length));

    it('should contain name, displayName and description', () =>
      expect(
        response.body.every(
          watcher => watcher.name && watcher.displayName && watcher.description,
        ),
      ).toBeTruthy());
  });
});
