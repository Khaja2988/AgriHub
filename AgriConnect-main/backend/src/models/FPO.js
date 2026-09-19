const mongoose = require('mongoose');

const fpoSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  crops: [{
    type: String,
    required: true
  }],
  location: {
    type: String,
    required: true
  },
  district: {
    type: String,
    required: true
  },
  state: {
    type: String,
    required: true
  },
  procurementCapacity: {
    type: Number,
    required: true
  },
  contact: {
    type: String,
    required: true
  },
  verified: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('FPO', fpoSchema);
