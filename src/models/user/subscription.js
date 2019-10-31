const mongoose = require('mongoose');

const { Schema } = mongoose;

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
  auth: {
    type: Object,
    default: {},
  },
  authFailed: {
    type: Boolean,
    default: false,
  },
  notificationTypes: [notificationTypeSchema],
  snapshot: {
    type: Object,
    default: {},
  },
});

class Subscription {
  updateSnapshot(snapshot) {
    this.snapshot = snapshot;
    return this.ownerDocument().save();
  }
}

schema.loadClass(Subscription);

module.exports = schema;
