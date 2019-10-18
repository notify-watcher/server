const mongoose = require('mongoose');

const { Schema } = mongoose;
const ClientSchema = require('../client/schema');

// To fix https://github.com/Automattic/mongoose/issues/4291
mongoose.Promise = global.Promise;

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
