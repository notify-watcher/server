const request = require('../test/supertest');
const User = require('../models/user');
const emails = require('../emails');
const { HTTP_CODES } = require('../constants');

describe('users routes', () => {
  describe('POST users/send-token', () => {
    let response;
    const sendTokenUrl = '/users/send-token';
    const userEmail = 'test1@example.org';
    const sendTokenEmailSpy = jest.spyOn(emails, 'sendToken');

    afterAll(() => sendTokenEmailSpy.mockRestore());

    describe('to a new user', () => {
      beforeEach(async () => {
        sendTokenEmailSpy.mockClear();
        response = await request.post(sendTokenUrl).send({ email: userEmail });
      });

      it('should return "created"', () =>
        expect(response.status).toEqual(HTTP_CODES.created));
      it('should send an email', () =>
        expect(sendTokenEmailSpy).toHaveBeenCalled());
    });

    describe('to an existent user', () => {
      beforeEach(async () => {
        const user = await User.create({ email: userEmail });
        await user.createSecret();
        response = await request.post(sendTokenUrl).send({ email: userEmail });
      });

      afterEach(async () => sendTokenEmailSpy.mockClear());

      it('should return "no content"', () =>
        expect(response.status).toEqual(HTTP_CODES.noContent));
      it('should send an email', () =>
        expect(sendTokenEmailSpy).toHaveBeenCalled());
    });
  });
});
