const mongoose = require('mongoose');

const syncQueueSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  actionType: {
    type: String,
    required: true
  },
  payload: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  status: {
    type: String,
    enum: ['PENDING', 'PROCESSED', 'FAILED'],
    default: 'PENDING'
  },
  retryCount: {
    type: Number,
    default: 0
  },
  lastError: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('SyncQueue', syncQueueSchema);
