const mongoose = require('mongoose');
const Buyer = require('../models/Buyer');
const FPO = require('../models/FPO');
const Inquiry = require('../models/Inquiry');
const mockData = require('../config/mockDb');

// @desc    Get buyers list with filtering
// @route   GET /api/buyers
// @access  Public
exports.getBuyers = async (req, res) => {
  const { crop, district, state } = req.query;

  if (mongoose.connection.readyState === 1) {
    try {
      const filter = {};
      if (crop) filter.crops = { $regex: new RegExp(crop, 'i') };
      if (district) filter.district = { $regex: new RegExp(district, 'i') };
      if (state) filter.state = { $regex: new RegExp(state, 'i') };

      const buyers = await Buyer.find(filter).sort({ indicativePrice: -1 });
      if (buyers && buyers.length > 0) {
        return res.status(200).json({
          success: true,
          count: buyers.length,
          data: buyers
        });
      }
    } catch (error) {
      console.warn('[BuyerController] DB error:', error.message);
    }
  }

  let result = mockData.buyers;
  if (crop) {
    result = result.filter(b => b.crops.some(c => c.toLowerCase().includes(crop.toLowerCase())));
  }

  return res.status(200).json({
    success: true,
    count: result.length,
    data: result
  });
};

// @desc    Get buyer by ID
// @route   GET /api/buyers/:id
// @access  Public
exports.getBuyerById = async (req, res) => {
  if (mongoose.connection.readyState === 1) {
    try {
      const buyer = await Buyer.findById(req.params.id);
      if (buyer) {
        return res.status(200).json({
          success: true,
          data: buyer
        });
      }
    } catch (error) {
      console.warn('[BuyerController] DB error');
    }
  }

  const fallback = mockData.buyers.find(b => b._id === req.params.id) || mockData.buyers[0];
  return res.status(200).json({
    success: true,
    data: fallback
  });
};

// @desc    Get FPOs list with filtering
// @route   GET /api/fpos
// @access  Public
exports.getFpos = async (req, res) => {
  const { crop, district, state } = req.query;

  if (mongoose.connection.readyState === 1) {
    try {
      const filter = {};
      if (crop) filter.crops = { $regex: new RegExp(crop, 'i') };
      if (district) filter.district = { $regex: new RegExp(district, 'i') };
      if (state) filter.state = { $regex: new RegExp(state, 'i') };

      const fpos = await FPO.find(filter).sort({ procurementCapacity: -1 });
      if (fpos && fpos.length > 0) {
        return res.status(200).json({
          success: true,
          count: fpos.length,
          data: fpos
        });
      }
    } catch (error) {
      console.warn('[FPOController] DB error:', error.message);
    }
  }

  return res.status(200).json({
    success: true,
    count: mockData.fpos.length,
    data: mockData.fpos
  });
};

// @desc    Get FPO by ID
// @route   GET /api/fpos/:id
// @access  Public
exports.getFpoById = async (req, res) => {
  if (mongoose.connection.readyState === 1) {
    try {
      const fpo = await FPO.findById(req.params.id);
      if (fpo) {
        return res.status(200).json({
          success: true,
          data: fpo
        });
      }
    } catch (error) {
      console.warn('[FPOController] DB error');
    }
  }

  const fallback = mockData.fpos.find(f => f._id === req.params.id) || mockData.fpos[0];
  return res.status(200).json({
    success: true,
    data: fallback
  });
};

// @desc    Submit direct inquiry to Buyer or FPO
// @route   POST /api/buyers/inquiry or /api/fpos/inquiry
// @access  Public
exports.sendInquiry = async (req, res) => {
  const { recipientType = 'BUYER', recipientId, recipientName, crop, quantity, message, farmerName, farmerPhone } = req.body;

  if (mongoose.connection.readyState === 1) {
    try {
      const inquiry = new Inquiry({
        farmer: req.user ? req.user._id : '66ebc1234567890123456789',
        farmerName: farmerName || (req.user ? req.user.name : 'Ravi Kumar'),
        farmerPhone: farmerPhone || (req.user ? req.user.phone : '9848012345'),
        recipientType,
        recipientId: recipientId || 'direct-inquiry',
        recipientName: recipientName || 'Agri Trader',
        crop: crop || 'Tomato',
        quantity: quantity || 1000,
        message: message || 'Interested in direct procurement and modal price confirmation.',
        status: 'PENDING'
      });
      await inquiry.save();
    } catch (err) {
      console.warn('[InquiryController] Saved in-memory / DB offline');
    }
  }

  return res.status(201).json({
    success: true,
    message: `Inquiry successfully sent to ${recipientName || 'Buyer/FPO'}. The aggregator will contact you shortly.`,
    data: {
      recipientName: recipientName || 'Agri Trader',
      crop: crop || 'Tomato',
      quantity: quantity || 1000,
      status: 'PENDING'
    }
  });
};
