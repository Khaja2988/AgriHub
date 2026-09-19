const mongoose = require('mongoose');
const Crop = require('../models/Crop');
const mockData = require('../config/mockDb');

// @desc    Get all crops
// @route   GET /api/crops
// @access  Public
exports.getCrops = async (req, res) => {
  if (mongoose.connection.readyState === 1) {
    try {
      const crops = await Crop.find().sort({ name: 1 });
      if (crops && crops.length > 0) {
        return res.status(200).json({
          success: true,
          count: crops.length,
          data: crops
        });
      }
    } catch (error) {
      console.warn('[CropController] DB error:', error.message);
    }
  }

  // Fallback to mockData
  return res.status(200).json({
    success: true,
    count: mockData.crops.length,
    data: mockData.crops
  });
};

// @desc    Get single crop by name
// @route   GET /api/crops/:name
// @access  Public
exports.getCropByName = async (req, res) => {
  const cropName = req.params.name;
  if (mongoose.connection.readyState === 1) {
    try {
      const crop = await Crop.findOne({
        $or: [
          { name: { $regex: new RegExp(`^${cropName}$`, 'i') } },
          { 'localNames.en': { $regex: new RegExp(`^${cropName}$`, 'i') } },
          { 'localNames.te': { $regex: new RegExp(`^${cropName}$`, 'i') } }
        ]
      });

      if (crop) {
        return res.status(200).json({
          success: true,
          data: crop
        });
      }
    } catch (error) {
      console.warn('[CropController] DB error:', error.message);
    }
  }

  const fallback = mockData.crops.find(c => c.name.toLowerCase() === cropName.toLowerCase()) || mockData.crops[0];
  return res.status(200).json({
    success: true,
    data: fallback
  });
};
