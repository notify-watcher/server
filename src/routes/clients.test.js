const {
  constants: { CLIENT_KINDS },
} = require('@notify-watcher/core');
const request = require('../test/supertest');
const User = require('../models/user');

describe('clients routes', () => {
  describe('POST clients/register', () => {
    const registerUrl = '/clients/register';

    describe('for a non existent user', () => {
      it('should return 404', async () => {
        await request
          .post(registerUrl)
          .send({ email: 'invalid email' })
          .expect(404);
      });
    });

    describe('for an existent user', () => {
      const clientData = { kind: CLIENT_KINDS.telegram };
      const userEmail = 'user-client-register@example.org';
      let user;
      let token;

      beforeAll(async () => {
        user = await User.create({ email: userEmail });
        await user.createSecret();
        token = await user.generateToken();
      });

      afterAll(() => user.deleteOne());

      describe('with a invalid token', () => {
        it('should return 401', async () => {
          await request
            .post(registerUrl)
            .send({
              email: userEmail,
              token: 'invalid',
              clientData,
            })
            .expect(401);
        });
      });

      describe('with an invalid client data', () => {
        it('should return 500', async () => {
          await request
            .post(registerUrl)
            .send({
              email: userEmail,
              token,
              clientData: {
                kind: 'invalid-kind',
              },
            })
            .expect(500);
        });
      });

      describe('with a valid token and client data', () => {
        let response;
        beforeAll(async () => {
          response = await request.post(registerUrl).send({
            email: userEmail,
            token,
            clientData,
          });
        });
        it('should return 200', () => expect(response.status).toEqual(200));
        it('should send an email', () =>
          expect(response.body).toHaveProperty('client'));
      });
    });
  });
});
