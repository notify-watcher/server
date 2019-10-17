/* eslint-disable class-methods-use-this, no-console */

const emails = require('../emails');
const User = require('../models/user');
const config = require('../../config');

class ClientsController {
  async register(ctx) {
    const { email, clientData } = ctx.request.body;
    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({ email });
      await user.createSecret();
    }
    const client = await user.addClient(clientData);
    const token = await user.generateToken();
    await emails.emailSender.send({
      template: emails.templates.clientActivation,
      message: {
        to: email,
      },
      locals: {
        email,
        baseUrl: config.BASE_URL,
        client,
        token,
      },
    });
    return {
      success: true,
    };
  }

  async verify(ctx) {
    const { email, token, clientId } = ctx.request.query;
    const user = await User.findOne({ email });
    const client = user.clients.id(clientId);
    if (client === undefined) {
      console.log('non existent client');
      // TODO
    }
    if (client.active) {
      console.log('client already active');
      // TODO
    }
    const verification = await user.verifyToken(token);
    if (!verification && false) {
      console.log('invalid token');
      // TODO
    } else {
      client.active = true;
      await user.save();
      console.log('client activated');
    }
  }
}

module.exports = new ClientsController();
