const mongoose = require('mongoose');

const buyerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  crops: [{
    type: String,
    required: true
  }],
  requiredQuantity: {
    type: Number,
    required: true
  },
  indicativePrice: {
    type: Number,
    required: true
  },
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

module.exports = mongoose.model('Buyer', buyerSchema);
