const request = require('../tests/supertest');
const User = require('../models/user');
const emails = require('../emails');
const { HTTP_CODES } = require('../constants');

describe('users routes', () => {
  describe('POST users/send-token', () => {
    const sendToken = body => request.post('/users/send-token').send(body);

    let response;
    const email = 'send-token@example.org';
    const sendTokenEmailSpy = jest.spyOn(emails, 'sendToken');

    afterAll(() => sendTokenEmailSpy.mockRestore());

    describe('to a new user', () => {
      beforeEach(async () => {
        sendTokenEmailSpy.mockClear();
        response = await sendToken({ email });
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
      });

      afterAll(() => user.deleteOne());

      beforeEach(async () => {
        response = await sendToken({ email });
      });

      afterEach(() => sendTokenEmailSpy.mockClear());

      it('should return "no content"', () =>
        expect(response.status).toEqual(HTTP_CODES.noContent));
      it('should send an email', () =>
        expect(sendTokenEmailSpy).toHaveBeenCalled());
    });
  });
});
