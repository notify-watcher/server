const mongoose = require('mongoose');
const {
  constants: { CLIENT_KINDS },
} = require('@notify-watcher/core');

const { Schema } = mongoose;

const schema = new Schema({
  kind: {
    type: String,
    enum: Object.keys(CLIENT_KINDS),
    required: true,
    index: true,
  },
});

module.exports = schema;
