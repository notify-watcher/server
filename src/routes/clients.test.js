const {
  constants: { CLIENT_KINDS },
} = require('@notify-watcher/core');
const request = require('../test/supertest');
const User = require('../models/user');
const { HTTP_CODES } = require('../constants');

describe('clients routes', () => {
  describe('POST clients/register', () => {
    const registerUrl = '/clients/register';

    describe('for a non existent user', () => {
      it('should return "not found"', () =>
        request
          .post(registerUrl)
          .send({ email: 'invalid email' })
          .expect(HTTP_CODES.notFound));
    });

    describe('for an existent user', () => {
      const clientData = { kind: CLIENT_KINDS.telegram };
      const userEmail = 'user-client-register@example.org';
      let user;
      let token;

      beforeEach(async () => {
        user = await User.create({ email: userEmail });
        await user.createSecret();
        token = await user.generateToken();
      });

      describe('with a invalid token', () => {
        it('should return "unauthorized"', () =>
          request
            .post(registerUrl)
            .send({
              email: userEmail,
              token: 'invalid',
              clientData,
            })
            .expect(HTTP_CODES.unauthorized));
      });

      describe('with an invalid client data', () => {
        it('should return "bad request"', () =>
          request
            .post(registerUrl)
            .send({
              email: userEmail,
              token,
              clientData: {
                kind: 'invalid-kind',
              },
            })
            .expect(HTTP_CODES.badRequest));
      });

      describe('with a valid token and client data', () => {
        let validResponse;
        beforeEach(async () => {
          validResponse = await request.post(registerUrl).send({
            email: userEmail,
            token,
            clientData,
          });
        });
        it('should return "ok"', () =>
          expect(validResponse.status).toEqual(HTTP_CODES.ok));
        it('should return a client', () =>
          expect(validResponse.body).toHaveProperty('client'));
      });
    });
  });
});
