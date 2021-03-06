const speakeasy = require('speakeasy');
const _ = require('lodash');
const mongoose = require('mongoose');
const ClientSchema = require('./client');
const SubscriptionSchema = require('./subscription');

const { Schema } = mongoose;

const TOKEN_TTL = 15 * 60; // 15 minutes (specified in seconds)

function createSecret() {
  return speakeasy.generateSecret({ length: 20 }).base32;
}

const schema = new Schema({
  email: {
    type: String,
    required: true,
    index: true,
  },
  secret: {
    type: String,
    required: true,
    default: createSecret,
  },
  clients: [ClientSchema],
  subscriptions: [SubscriptionSchema],
});

class User {
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

  subscriptionForWatcher(watcher) {
    return _.find(this.subscriptions, { watcher });
  }

  async updateSubscription(watcher, auth, notificationTypes) {
    let index = _.findIndex(this.subscriptions, { watcher });
    if (index < 0) index = this.subscriptions.push({ watcher }) - 1;
    const subscription = this.subscriptions[index];
    subscription.notificationTypes = notificationTypes;
    await this.save();
    return this.subscriptions[index];
  }

  static forWatcher(watcher) {
    return this.find({ 'subscriptions.watcher': watcher });
  }
}

schema.loadClass(User);

module.exports = mongoose.model('User', schema);
