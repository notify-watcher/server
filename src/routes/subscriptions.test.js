const {
  constants: { CLIENT_KINDS },
} = require('@notify-watcher/core');
const { loadWatchers } = require('../watchers/load-watchers');
const request = require('../tests/supertest');
const User = require('../models/user');
const { HTTP_CODES } = require('../constants');

describe('subscriptions routes', () => {
  describe('POST subscriptions/subscribe', () => {
    const { watchersList } = loadWatchers();
    const watcher = watchersList[0] || { name: 'TODO' }; // TODO: this shouldn't be necessary

    const subscribe = body =>
      request.post('/subscriptions/subscribe').send(body);

    describe('for a non existent user', () => {
      it('should return "not found"', () =>
        subscribe({ email: 'invalid email' }).expect(HTTP_CODES.notFound));
    });

    describe('for an existent user', () => {
      let validBody;
      let user;

      beforeAll(async () => {
        user = await User.create({
          email: 'user-subscriptions-subscribe@example.org',
        });
        const client = await user.addClient({ kind: CLIENT_KINDS.telegram });
        const notificationType = {
          notificationType: 'TODO',
          clientIds: [client.id],
        };
        validBody = {
          email: user.email,
          watcher: watcher.name,
          notificationTypes: [notificationType],
        };
      });

      afterAll(() => user.remove());

      describe('with an invalid watcher', () => {
        it('should return "bad request"', () =>
          subscribe({
            ...validBody,
            watcher: 'invalid-watcher',
          }).expect(HTTP_CODES.badRequest));
      });

      describe('with a valid body', () => {
        let validResponse;

        beforeAll(async () => {
          validResponse = await subscribe(validBody);
        });

        it('should return "created"', () =>
          expect(validResponse.status).toEqual(HTTP_CODES.created));
        it('should return a subscription', () =>
          expect(validResponse.body).toHaveProperty('subscription'));
      });
    });
  });
});
