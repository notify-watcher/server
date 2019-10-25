const request = require('../test/supertest');
const User = require('../models/user');
const emails = require('../emails');
const { HTTP_CODES } = require('../test/constants');

describe('users routes', () => {
  describe('POST users/send-token', () => {
    const sendTokenUrl = '/users/send-token';
    const userEmail = 'test1@example.org';
    let sendTokenEmailSpy;

    beforeEach(async () => {
      sendTokenEmailSpy = jest.spyOn(emails, 'sendToken');
    });

    afterEach(async () => {
      console.log('AfterAll');
      await User.deleteOne({ email: userEmail });
      sendTokenEmailSpy.mockRestore();
    });

    describe('to a new user', () => {
      let response;
      beforeAll(async () => {
        response = await request.post(sendTokenUrl).send({ email: userEmail });
      });

      it('should return "created"', () =>
        expect(response.status).toEqual(HTTP_CODES.created));
      it('should send an email', () =>
        expect(sendTokenEmailSpy).toHaveBeenCalled());
    });

    describe('to an existent user', () => {
      let response;
      beforeAll(async () => {
        await request.post(sendTokenUrl).send({ email: userEmail });
        response = await request.post(sendTokenUrl).send({ email: userEmail });
      });

      it('should return "no content"', () =>
        expect(response.status).toEqual(HTTP_CODES.noContent));
      it('should send an email', () =>
        expect(sendTokenEmailSpy).toHaveBeenCalled());
    });
  });
});
