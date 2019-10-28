const request = require('../tests/supertest');
const User = require('../models/user');
const emails = require('../emails');
const { HTTP_CODES } = require('../constants');

describe('users routes', () => {
  describe('POST users/send-token', () => {
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
});
