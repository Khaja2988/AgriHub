const mongoose = require('mongoose');

const logisticsProviderSchema = new mongoose.Schema({
  provider: {
    type: String,
    required: true
  },
  vehicleType: {
    type: String,
    required: true
  },
  capacity: {
    type: Number,
    required: true
  },
  serviceAreas: [{
    type: String
  }],
  baseRate: {
    type: Number,
    default: 500
  },
  estimatedCost: {
    type: Number,
    required: true
  },
  ratePerKm: {
    type: Number,
    default: 15
  },
  estimatedTime: {
    type: String,
    default: '2 - 4 hours'
  },
  contact: {
    type: String,
    required: true
  },
  available: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('LogisticsProvider', logisticsProviderSchema);
