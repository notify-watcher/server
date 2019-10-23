const _ = require('lodash');
const request = require('../test/supertest');
const emails = require('../emails');

describe('users route tests', () => {
  describe('POST users/send-token', () => {
    const sendTokenUrl = '/users/send-token';
    const userEmail = 'test1@example.org';
    let sendTokenEmailSpy;

    beforeEach(async () => {
      sendTokenEmailSpy = jest.spyOn(emails, 'sendToken');
    });

    afterEach(async () => {
      sendTokenEmailSpy.mockReset();
    });

    afterAll(async () => User.delete);

    test('to a new user', async () => {
      await request
        .post(sendTokenUrl)
        .send({ email: userEmail })
        .expect(201);
      expect(sendTokenEmailSpy).toHaveBeenCalled();
    });

    test('to an existent user', async () => {
      await request
        .post(sendTokenUrl)
        .send({ email: userEmail })
        .expect(204);
      expect(sendTokenEmailSpy).toHaveBeenCalled();
    });
  });
});
