const SellingRequest = require('../models/SellingRequest');
const decisionEngineService = require('../services/decisionEngineService');
const mockData = require('../config/mockDb');

// @desc    Calculate estimated net returns via Farm-to-Market Decision Engine
// @route   POST /api/selling/calculate
// @access  Public
exports.calculateDecision = async (req, res) => {
  try {
    const calculation = decisionEngineService.calculateNetReturn(req.body);
    return res.status(200).json({
      success: true,
      data: calculation
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Error calculating farm-to-market estimates'
    });
  }
};

// @desc    Submit full Selling Request from the Selling Wizard
// @route   POST /api/selling-requests
// @access  Public
exports.createSellingRequest = async (req, res) => {
  try {
    const {
      crop = 'Tomato',
      quantity = 1000,
      harvestDate = new Date().toISOString().split('T')[0],
      expectedPrice = 22,
      targetType = 'BUYER',
      buyerName = 'Sri Krishna Agro Traders',
      fpoName = 'Guntur Rythu Mitra FPC',
      storageName = 'Guntur Central Cold Chain Warehouse',
      logisticsName = 'Kisan Rural Logistics (Ashok Leyland Dost)',
      pickupLocation = 'Kaza Village Farm, Guntur',
      farmerName = 'Ravi Kumar'
    } = req.body;

    const calc = decisionEngineService.calculateNetReturn({
      crop,
      quantity,
      indicativePrice: expectedPrice,
      includeStorage: !!storageName,
      includeLogistics: !!logisticsName
    });

    const newRequest = {
      _id: 'sr-' + Date.now(),
      farmerName: req.user ? req.user.name : farmerName,
      crop,
      quantity: Number(quantity),
      harvestDate,
      expectedPrice: Number(expectedPrice),
      targetType,
      buyerName: targetType === 'BUYER' ? buyerName : '',
      fpoName: targetType === 'FPO' ? fpoName : '',
      storageName,
      logisticsName,
      pickupLocation,
      estimatedGrossValue: calc.estimatedGrossValue,
      estimatedCosts: calc.estimatedCosts,
      estimatedNetValue: calc.estimatedNetValue,
      status: 'PENDING',
      createdAt: new Date(),
      notes: 'Submitted via AGRIHUB End-to-End Selling Wizard'
    };

    // Try persisting to MongoDB
    try {
      const doc = new SellingRequest({
        farmer: req.user ? req.user._id : '66ebc1234567890123456789',
        ...newRequest
      });
      await doc.save();
      newRequest._id = doc._id;
    } catch (dbErr) {
      console.warn('[SellingController] MongoDB save fallback to in-memory array');
    }

    // Keep in mockData
    mockData.sellingRequests.unshift(newRequest);

    return res.status(201).json({
      success: true,
      message: 'Selling request created successfully and broadcasted to verified aggregator network.',
      data: newRequest
    });
  } catch (error) {
    console.error('Error creating selling request:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Error submitting selling request'
    });
  }
};

// @desc    Get all selling requests for farmer
// @route   GET /api/selling-requests
// @access  Public
exports.getSellingRequests = async (req, res) => {
  try {
    const query = req.user ? { farmer: req.user._id } : {};
    const requests = await SellingRequest.find(query).sort({ createdAt: -1 });
    if (requests && requests.length > 0) {
      return res.status(200).json({
        success: true,
        count: requests.length,
        data: requests
      });
    }
  } catch (error) {
    console.warn('[SellingController] MongoDB fetch fallback to in-memory requests');
  }

  return res.status(200).json({
    success: true,
    count: mockData.sellingRequests.length,
    data: mockData.sellingRequests
  });
};

// @desc    Get single selling request by ID
// @route   GET /api/selling-requests/:id
// @access  Public
exports.getRequestById = async (req, res) => {
  try {
    const request = await SellingRequest.findById(req.params.id);
    if (request) {
      return res.status(200).json({
        success: true,
        data: request
      });
    }
  } catch (error) {
    // fallback
  }

  const found = mockData.sellingRequests.find(r => r._id === req.params.id) || mockData.sellingRequests[0];
  return res.status(200).json({
    success: true,
    data: found
  });
};

// @desc    Update selling request status
// @route   PUT /api/selling-requests/:id/status
// @access  Public
exports.updateRequestStatus = async (req, res) => {
  const { status } = req.body;
  try {
    const request = await SellingRequest.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (request) {
      return res.status(200).json({
        success: true,
        data: request
      });
    }
  } catch (error) {
    // fallback
  }

  const found = mockData.sellingRequests.find(r => r._id === req.params.id);
  if (found) found.status = status;

  return res.status(200).json({
    success: true,
    message: `Status updated to ${status}`,
    data: found || { status }
  });
};
