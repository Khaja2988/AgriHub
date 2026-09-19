const mongoose = require('mongoose');

const treatmentSchema = new mongoose.Schema({
  condition: {
    type: String,
    required: true,
    unique: true
  },
  crop: {
    type: String,
    required: true
  },
  severity: {
    type: String,
    enum: ['Low', 'Medium', 'High'],
    default: 'Medium'
  },
  symptoms: {
    type: String,
    required: true
  },
  actionSteps: [{
    type: String
  }],
  prevention: [{
    type: String
  }],
  expertAdvisoryContact: {
    type: String,
    default: 'Kisan Call Centre: 1800-180-1551 (Toll-free)'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Treatment', treatmentSchema);
