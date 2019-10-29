const mongoose = require('mongoose');

const { Schema } = mongoose;

const STATUSES = ['valid', 'invalid-auth'];

const notificationTypeSchema = new Schema({
  notificationType: {
    type: String,
    required: true,
    index: true,
  },
  clientIds: [String],
});

const schema = new Schema({
  watcher: {
    type: String,
    required: true,
    index: true,
  },
  status: {
    type: String,
    enum: STATUSES,
    required: true,
  },
  auth: Schema.Types.Mixed,
  notificationTypes: [notificationTypeSchema],
  snapshot: Schema.Types.Mixed,
});

module.exports = schema;
