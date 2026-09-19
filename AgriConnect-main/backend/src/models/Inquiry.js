const mongoose = require('mongoose');

const inquirySchema = new mongoose.Schema({
  farmer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  farmerName: {
    type: String,
    required: true
  },
  farmerPhone: {
    type: String,
    required: true
  },
  recipientType: {
    type: String,
    enum: ['BUYER', 'FPO', 'STORAGE', 'LOGISTICS'],
    required: true
  },
  recipientId: {
    type: String,
    required: true
  },
  recipientName: {
    type: String,
    required: true
  },
  crop: {
    type: String,
    default: ''
  },
  quantity: {
    type: Number,
    default: 0
  },
  message: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['PENDING', 'RESPONDED', 'CLOSED'],
    default: 'PENDING'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Inquiry', inquirySchema);
