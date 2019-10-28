const {
  constants: { CLIENT_KINDS },
} = require('@notify-watcher/core');
const request = require('../tests/supertest');
const User = require('../models/user');
const { HTTP_CODES } = require('../constants');

describe('clients routes', () => {
  describe('POST clients/register', () => {
    const register = body => request.post('/clients/register').send(body);

    describe('for a non existent user', () => {
      it('should return "not found"', () =>
        register({ email: 'invalid email' }).expect(HTTP_CODES.notFound));
    });

    describe('for an existent user', () => {
      const clientData = { kind: CLIENT_KINDS.telegram };
      let user;
      let token;

      beforeEach(async () => {
        user = await User.create({ email: 'user-client-register@example.org' });
        await user.createSecret();
        token = await user.generateToken();
      });

      describe('with a invalid token', () => {
        it('should return "unauthorized"', () =>
          register({
            email: user.email,
            token: 'invalid',
            clientData,
          }).expect(HTTP_CODES.unauthorized));
      });

      describe('with an invalid client data', () => {
        it('should return "bad request"', () =>
          register({
            email: user.email,
            token,
            clientData: {
              kind: 'invalid-kind',
            },
          }).expect(HTTP_CODES.badRequest));
      });

      describe('with a valid token and client data', () => {
        let validResponse;
        beforeEach(async () => {
          validResponse = await register({
            email: user.email,
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
