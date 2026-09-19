const mongoose = require('mongoose');

const farmerProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  village: {
    type: String,
    default: 'Kaza'
  },
  district: {
    type: String,
    default: 'Guntur'
  },
  state: {
    type: String,
    default: 'Andhra Pradesh'
  },
  preferredLanguage: {
    type: String,
    enum: ['en', 'te', 'hi'],
    default: 'te'
  },
  farmSize: {
    type: String,
    default: '2 acres'
  },
  cropsGrown: {
    type: [String],
    default: ['Tomato', 'Chilli']
  },
  coordinates: {
    latitude: { type: Number, default: 16.3067 },
    longitude: { type: Number, default: 80.4365 }
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('FarmerProfile', farmerProfileSchema);
