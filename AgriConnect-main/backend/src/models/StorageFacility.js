const mongoose = require('mongoose');

const storageFacilitySchema = new mongoose.Schema({
  name: {
    type: String,
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
  latitude: {
    type: Number,
    default: 16.3067
  },
  longitude: {
    type: Number,
    default: 80.4365
  },
  totalCapacity: {
    type: Number,
    required: true
  },
  availableCapacity: {
    type: Number,
    required: true
  },
  storageType: {
    type: String,
    default: 'Cold Storage'
  },
  estimatedCost: {
    type: Number,
    required: true
  },
  costUnit: {
    type: String,
    default: '₹/kg/month'
  },
  contact: {
    type: String,
    required: true
  },
  supportedCrops: [{
    type: String
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('StorageFacility', storageFacilitySchema);
