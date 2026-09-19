const mongoose = require('mongoose');

const marketPriceSchema = new mongoose.Schema({
  crop: {
    type: String,
    required: true,
    index: true
  },
  market: {
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
  minPrice: {
    type: Number,
    required: true
  },
  modalPrice: {
    type: Number,
    required: true
  },
  maxPrice: {
    type: Number,
    required: true
  },
  unit: {
    type: String,
    default: '₹/kg'
  },
  sourceType: {
    type: String,
    enum: ['DEMO', 'API', 'MANUAL'],
    default: 'DEMO'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('MarketPrice', marketPriceSchema);
