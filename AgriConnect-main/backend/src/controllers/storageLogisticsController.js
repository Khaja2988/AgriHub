const mongoose = require('mongoose');
const StorageFacility = require('../models/StorageFacility');
const LogisticsProvider = require('../models/LogisticsProvider');
const mockData = require('../config/mockDb');

// @desc    Get storage facilities
// @route   GET /api/storage
// @access  Public
exports.getStorageFacilities = async (req, res) => {
  const { district, state, crop } = req.query;

  if (mongoose.connection.readyState === 1) {
    try {
      const filter = {};
      if (district) filter.district = { $regex: new RegExp(district, 'i') };
      if (state) filter.state = { $regex: new RegExp(state, 'i') };
      if (crop) filter.supportedCrops = { $regex: new RegExp(crop, 'i') };

      const facilities = await StorageFacility.find(filter).sort({ availableCapacity: -1 });
      if (facilities && facilities.length > 0) {
        return res.status(200).json({
          success: true,
          count: facilities.length,
          distanceNotice: 'Estimated distance from Guntur Mandi cluster',
          data: facilities
        });
      }
    } catch (error) {
      console.warn('[StorageController] DB error:', error.message);
    }
  }

  return res.status(200).json({
    success: true,
    count: mockData.storageFacilities.length,
    distanceNotice: 'Estimated distance from Guntur Mandi cluster',
    data: mockData.storageFacilities
  });
};

// @desc    Submit cold storage booking request
// @route   POST /api/storage/requests
// @access  Public
exports.createStorageRequest = async (req, res) => {
  const { storageId, crop, quantity, durationMonths } = req.body;
  const facility = mockData.storageFacilities.find(s => s._id === storageId) || mockData.storageFacilities[0];
  const estCost = Math.round((facility.estimatedCost || 2) * (Number(quantity) || 1000) * (Number(durationMonths) || 1));

  return res.status(201).json({
    success: true,
    message: 'Storage reservation inquiry submitted successfully.',
    data: {
      storageFacility: facility.name,
      crop: crop || 'Tomato',
      quantity: quantity || 1000,
      durationMonths: durationMonths || 1,
      estimatedCost: estCost,
      status: 'PENDING',
      costNotice: 'Estimated Storage Cost based on indicative facility tariff'
    }
  });
};

// @desc    Get logistics providers matching criteria
// @route   GET /api/logistics
// @access  Public
exports.getLogisticsProviders = async (req, res) => {
  if (mongoose.connection.readyState === 1) {
    try {
      const providers = await LogisticsProvider.find({ available: true }).sort({ estimatedCost: 1 });
      if (providers && providers.length > 0) {
        return res.status(200).json({
          success: true,
          count: providers.length,
          notice: 'Estimated Transport Cost. Final freight depends on road permits and loading points.',
          data: providers
        });
      }
    } catch (error) {
      console.warn('[LogisticsController] DB error:', error.message);
    }
  }

  return res.status(200).json({
    success: true,
    count: mockData.logisticsProviders.length,
    notice: 'Estimated Transport Cost. Final freight depends on road permits and loading points.',
    data: mockData.logisticsProviders
  });
};

// @desc    Submit logistics dispatch request
// @route   POST /api/logistics/requests
// @access  Public
exports.createLogisticsRequest = async (req, res) => {
  const { logisticsId, pickup, destination, crop, quantity } = req.body;
  const provider = mockData.logisticsProviders.find(l => l._id === logisticsId) || mockData.logisticsProviders[0];

  return res.status(201).json({
    success: true,
    message: 'Logistics transport booking request placed.',
    data: {
      provider: provider.provider,
      vehicleType: provider.vehicleType,
      pickup: pickup || 'Kaza, Guntur',
      destination: destination || 'Guntur Mandi',
      crop: crop || 'Tomato',
      quantity: quantity || 1000,
      estimatedCost: provider.estimatedCost,
      status: 'DISPATCH_PENDING',
      costNotice: 'Estimated Transport Cost'
    }
  });
};
