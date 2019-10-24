const request = require('../test/supertest');
const User = require('../models/user');
const emails = require('../emails');

describe('users route tests', () => {
  describe('POST users/send-token', () => {
    const sendTokenUrl = '/users/send-token';
    const userEmail = 'test1@example.org';
    const sendTokenEmailSpy = jest.spyOn(emails, 'sendToken');

    afterEach(async () => {
      sendTokenEmailSpy.mockReset();
    });

    afterAll(async () => User.deleteOne({ email: userEmail }));

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
