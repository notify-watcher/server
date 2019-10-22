const mongoose = require('mongoose');

const { Schema } = mongoose;

const schema = new Schema({
  kind: {
    type: String,
    required: true,
    index: true,
  },
});

module.exports = schema;
