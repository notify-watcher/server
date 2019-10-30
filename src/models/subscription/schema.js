const mongoose = require('mongoose');

const config = require('../../config');

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
  auth: {
    type: Schema.Types.Mixed,
    validate: {
      validator: function(auth) {
        console.log(this.watcher);
        const {
          config: { auth: authConfig },
          checkAuth,
        } = config.WATCHERS.watchers[this.watcher];
        if (!authConfig) return true;
        if (checkAuth) return checkAuth({ auth });
        return false;
      },
      message: 'Auth is not valid',
    },
  },
  notificationTypes: [notificationTypeSchema],
  snapshot: Schema.Types.Mixed,
});

module.exports = schema;
