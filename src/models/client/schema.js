const mongoose = require('mongoose');
const { clientKinds } = require('../../notifications/clients');

const { Schema } = mongoose;

const schema = new Schema({
  kind: {
    type: String,
    enum: Object.keys(clientKinds),
    required: true,
    index: true,
  },
});

module.exports = schema;
