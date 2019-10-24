const mongoose = require('mongoose');

const { Schema } = mongoose;
const clients = ['telegram-bot', 'email']; // TODO: read from available clients.

const schema = new Schema({
  kind: {
    type: String,
    enum: clients,
    required: true,
    index: true,
  },
});

module.exports = schema;
