const mongoose = require('mongoose');

const { Schema } = mongoose;

const notificationTypeSchema = new Schema({
  notificationType: String,
  clientIds: [String],
});

const schema = new Schema({
  watcher: {
    type: String,
    required: true,
    index: true,
  },
  auth: Schema.Types.Mixed,
  notificationTypes: [notificationTypeSchema],
  snapshot: Schema.Types.Mixed,
});

module.exports = schema;
