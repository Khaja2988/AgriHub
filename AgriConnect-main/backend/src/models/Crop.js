const mongoose = require('mongoose');

const cropSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  localNames: {
    en: { type: String, default: '' },
    te: { type: String, default: '' },
    hi: { type: String, default: '' }
  },
  category: {
    type: String,
    default: 'Vegetable'
  },
  season: {
    type: String,
    default: 'All Year'
  },
  commonDiseases: [{
    type: String
  }],
  commonPests: [{
    type: String
  }],
  imageUrl: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Crop', cropSchema);
