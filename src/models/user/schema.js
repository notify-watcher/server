const mongoose = require('mongoose');
const ClientSchema = require('../client/schema');
const SubscriptionSchema = require('../subscription/schema');

const { Schema } = mongoose;

const schema = new Schema({
  email: {
    type: String,
    required: true,
    index: true,
  },
  secret: Schema.Types.String,
  clients: [ClientSchema],
  subscriptions: [SubscriptionSchema],
});

module.exports = schema;
