const mongoose = require('mongoose');

const sellingRequestSchema = new mongoose.Schema({
  farmer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  farmerName: {
    type: String,
    default: 'Ravi Kumar'
  },
  crop: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: true
  },
  harvestDate: {
    type: String,
    required: true
  },
  expectedPrice: {
    type: Number,
    required: true
  },
  targetType: {
    type: String,
    enum: ['BUYER', 'FPO'],
    default: 'BUYER'
  },
  buyerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Buyer',
    required: false
  },
  buyerName: {
    type: String,
    default: ''
  },
  fpoId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'FPO',
    required: false
  },
  fpoName: {
    type: String,
    default: ''
  },
  storageId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'StorageFacility',
    required: false
  },
  storageName: {
    type: String,
    default: ''
  },
  logisticsId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'LogisticsProvider',
    required: false
  },
  logisticsName: {
    type: String,
    default: ''
  },
  pickupLocation: {
    type: String,
    required: true
  },
  estimatedGrossValue: {
    type: Number,
    required: true
  },
  estimatedCosts: {
    storageCost: { type: Number, default: 0 },
    transportCost: { type: Number, default: 0 },
    otherCosts: { type: Number, default: 0 },
    totalCost: { type: Number, default: 0 }
  },
  estimatedNetValue: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['PENDING', 'ACCEPTED', 'REJECTED', 'IN_PROGRESS', 'COMPLETED'],
    default: 'PENDING'
  },
  notes: {
    type: String,
    default: 'Estimated value calculated by KrishiSetu Decision Engine'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('SellingRequest', sellingRequestSchema);
