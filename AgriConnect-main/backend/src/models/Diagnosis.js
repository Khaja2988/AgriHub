const mongoose = require('mongoose');

const diagnosisSchema = new mongoose.Schema({
  farmer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  crop: {
    type: String,
    required: true
  },
  condition: {
    type: String,
    required: true
  },
  type: {
    type: String,
    default: 'Disease'
  },
  confidence: {
    type: Number,
    default: 89
  },
  severity: {
    type: String,
    default: 'Medium'
  },
  symptoms: {
    type: String,
    required: true
  },
  treatment: {
    type: String,
    required: true
  },
  prevention: {
    type: String,
    required: true
  },
  provider: {
    type: String,
    default: 'DemoDiagnosisProvider (AI-assisted Demo Diagnosis)'
  },
  isDemo: {
    type: Boolean,
    default: true
  },
  imageUrl: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Diagnosis', diagnosisSchema);
