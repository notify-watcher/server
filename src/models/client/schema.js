const mongoose = require('mongoose');
const { Schema } = mongoose;

// To fix https://github.com/Automattic/mongoose/issues/4291
mongoose.Promise = global.Promise;

const schema = new Schema({
  kind: {
    type: String,
    required: true,
    index: true,
  },
  active: Boolean,
});

module.exports = schema;
