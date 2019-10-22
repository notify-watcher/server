const mongoose = require('mongoose');
const ClientSchema = require('../client/schema');

const { Schema } = mongoose;

const schema = new Schema({
  email: {
    type: String,
    required: true,
    index: true,
  },
  secret: Schema.Types.String,
  clients: [ClientSchema],
  subscriptions: [Schema.Types.Mixed],
});

module.exports = schema;
