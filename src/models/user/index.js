const speakeasy = require('speakeasy');
const mongoose = require('mongoose');
const schema = require('./schema');
const last = require('lodash/last');

class User {
  async createSecret() {
    const secret = speakeasy.generateSecret({ length: 20 });
    this.secret = secret.base32;
    return this.save();
  }

  async generateToken() {
    return speakeasy.totp({
      secret: this.secret,
      encoding: 'base32',
    });
  }

  async verifyToken(token) {
    return speakeasy.totp.verify({
      secret: this.secret,
      encoding: 'base32',
      token,
    });
  }

  async addClient(clientData) {
    clientData.active = false;
    this.clients.push(clientData);
    await this.save();
    return last(this.clients);
  }
}

schema.loadClass(User);

module.exports = mongoose.model('User', schema);
