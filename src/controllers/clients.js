/* eslint-disable class-methods-use-this, no-console */

const emails = require('../emails');
const User = require('../models/user');

class ClientsController {
  async register(ctx) {
    const { email, clientName } = ctx.request.body;
    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({ email });
      await user.createSecret();
    }
    try {
      const token = user.generateToken();
      const emailResult = await emails.emailSender.send({
        template: emails.templates.emailConfirmation,
        message: {
          to: email,
        },
        locals: {
          email,
          apiBase: 'http://localhost:3000', // TODO: from config.json maybe?
          clientName,
          token,
        },
      });
      console.log('emailResult', emailResult); // TODO: remove this line
      return {
        success: true,
      };
    } catch (err) {
      console.error(err);
      return {
        success: false,
      };
    }
  }

  async verify(ctx) {
    const { email, token } = ctx.request.body;
    const user = await User.findOne({ email });
    const verification = user.verifyToken(token);
    if (verification) {
      console.log('verified');
      // TODO
    } else {
      console.log('invalid token');
      // TODO
    }
  }
}

module.exports = new ClientsController();
