const speakeasy = require('speakeasy');
const _ = require('lodash');
const mongoose = require('mongoose');
const schema = require('./schema');

const TOKEN_TTL = 15 * 60; // 15 minutes (specified in seconds)

class User {
  createSecret() {
    const secret = speakeasy.generateSecret({ length: 20 });
    this.secret = secret.base32;
    return this.save();
  }

  generateToken() {
    return speakeasy.totp({
      secret: this.secret,
      encoding: 'base32',
      step: TOKEN_TTL,
    });
  }

  verifyToken(token) {
    return speakeasy.totp.verify({
      secret: this.secret,
      encoding: 'base32',
      token,
      step: TOKEN_TTL,
    });
  }

  async addClient(clientData) {
    this.clients.push(clientData);
    await this.save();
    return _.last(this.clients);
  }

  updateSubscriptions(subscriptionsData) {
    this.subscriptions = subscriptionsData;
    return this.save();
  }
}

schema.loadClass(User);

module.exports = mongoose.model('User', schema);
