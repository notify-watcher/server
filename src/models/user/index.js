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
    const { kind, ...data } = clientData;
    const existentClient = this.clients.filter(
      client => client.kind === kind && _.isEqual(client.data, data),
    )[0];
    if (existentClient) return existentClient;
    this.clients.push({ kind, data });
    await this.save();
    return _.last(this.clients);
  }

  async updateSubscription(watcher, auth, notificationTypes) {
    const index = _.findIndex(this.subscriptions, { watcher });
    let subscription =
      index > 0 ? this.subscriptions[index] : { watcher, snapshot: {} };
    subscription = { ...subscription, auth, notificationTypes };
    this.subscriptions.splice(index, 1, subscription);
    await this.save();
    return this.subscriptions[index];
  }
}

schema.loadClass(User);

module.exports = mongoose.model('User', schema);
