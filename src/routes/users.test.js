const config = require('../config');
const { clientKinds } = require('../notifications/clients');
const request = require('../tests/supertest');
const User = require('../models/user');
const emails = require('../emails');
const { HTTP_CODES } = require('../constants');

describe('users routes', () => {
  describe('POST /users/send-token', () => {
    const sendToken = body => request.post('/users/send-token').send(body);
    const sendTokenEmailSpy = jest.spyOn(emails, 'sendToken');

    const email = 'send-token@example.org';
    let response;

    afterAll(() => sendTokenEmailSpy.mockRestore());

    describe('to a non-existing user', () => {
      beforeAll(async () => {
        response = await sendToken({ email });
      });

      afterAll(async () => {
        const user = await User.findOne({ email });
        await user.remove();
        sendTokenEmailSpy.mockClear();
      });

      it('should return "created"', () =>
        expect(response.status).toEqual(HTTP_CODES.created));
      it('should send an email', () =>
        expect(sendTokenEmailSpy).toHaveBeenCalled());
    });

    describe('to an existent user', () => {
      let user;

      beforeAll(async () => {
        user = await User.create({ email });
        await user.createSecret();
        response = await sendToken({ email });
      });

      afterAll(() => {
        sendTokenEmailSpy.mockClear();
        user.remove();
      });

      it('should return "no content"', () =>
        expect(response.status).toEqual(HTTP_CODES.noContent));
      it('should send an email', () =>
        expect(sendTokenEmailSpy).toHaveBeenCalled());
    });
  });

  describe('POST /users/:email/subscriptions', () => {
    const watcher = config.WATCHERS.watchers[config.WATCHERS.list[0].name];
    const { notificationTypes } = watcher.config;

    function subscribe(email, body) {
      return request.post(`/users/${email}/subscriptions`).send(body);
    }

    describe('for a non existent user', () => {
      it('should return "not found"', () =>
        subscribe('invalid email', {}).expect(HTTP_CODES.notFound));
    });

    describe('for an existent user', () => {
      let user;
      let validBody;

      beforeAll(async () => {
        user = await User.create({
          email: 'user-subscriptions-subscribe@example.org',
        });
        const client = await user.addClient({
          kind: clientKinds.telegram,
          data: { chatId: 'chatId' },
        });
        const notificationType = {
          notificationType: notificationTypes[0].type,
          clientIds: [client.id],
        };
        validBody = {
          watcher: watcher.name,
          notificationTypes: [notificationType],
        };
      });

      afterAll(() => user.remove());

      describe('with a valid subscription', () => {
        let validResponse;

        beforeAll(async () => {
          validResponse = await subscribe(user.email, validBody);
        });

        it('should return "created"', () =>
          expect(validResponse.status).toEqual(HTTP_CODES.created));

        it('should return a subscription for the watcher', () =>
          expect(validResponse.body).toHaveProperty('watcher', watcher.name));
      });
    });
  });
});
