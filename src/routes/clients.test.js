const request = require('../test/supertest');
const User = require('../models/user');

describe('clients routes', () => {
  describe('POST clients/register', () => {
    const registerUrl = '/clients/register';

    test('for a non existent user', async () => {
      await request
        .post(registerUrl)
        .send({ email: 'invalid email' })
        .expect(404);
    });

    describe('for an existent user', () => {
      const clientData = { kind: 'telegram-bot' };
      const userEmail = 'user-client-register@example.org';
      let user;

      beforeAll(async () => {
        user = await User.create({ email: userEmail });
        await user.createSecret();
      });

      afterAll(() => user.deleteOne());

      test('with a invalid token', async () => {
        await request
          .post(registerUrl)
          .send({
            email: userEmail,
            token: 'invalid',
            clientData,
          })
          .expect(401);
      });

      test('with an invalid client data', async () => {
        const token = await user.generateToken();
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

      test('with a valid token and client data', async () => {
        const token = await user.generateToken();
        const response = await request
          .post(registerUrl)
          .send({
            email: userEmail,
            token,
            clientData,
          })
          .expect(200);
        expect(response.body).toHaveProperty('client');
      });
    });
  });
});
