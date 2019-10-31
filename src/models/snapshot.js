const mongoose = require('mongoose');

const { Schema } = mongoose;

const schema = new Schema({
  watcher: {
    type: String,
    required: true,
    index: true,
  },
  snapshot: {
    type: Object,
    default: {},
  },
});

class Snapshot {
  static async forWatcher(watcher) {
    let snaphost = await this.findOne({ watcher });
    if (!snaphost) snaphost = await this.create({ watcher });
    return snaphost;
  }

  updateSnapshot(snapshot) {
    this.snapshot = snapshot;
    return this.save();
  }
}

schema.loadClass(Snapshot);

module.exports = mongoose.model('snapshot', schema);
