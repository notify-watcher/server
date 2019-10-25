const request = require('../tests/supertest');
const User = require('../models/user');
const emails = require('../emails');

describe('users routes', () => {
  describe('POST users/send-token', () => {
    const sendTokenUrl = '/users/send-token';
    const userEmail = 'test1@example.org';
    const sendTokenEmailSpy = jest.spyOn(emails, 'sendToken');

    beforeEach(async () => {
      sendTokenEmailSpy.mockReset();
    });

    afterAll(async () => {
      await User.deleteOne({ email: userEmail });
      sendTokenEmailSpy.mockRestore();
    });

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
