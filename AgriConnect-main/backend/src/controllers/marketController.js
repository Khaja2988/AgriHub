const mongoose = require('mongoose');
const MarketPrice = require('../models/MarketPrice');
const mockData = require('../config/mockDb');

// @desc    Get all indicative market prices
// @route   GET /api/market-prices
// @access  Public
exports.getMarketPrices = async (req, res) => {
  const { crop, district, state } = req.query;

  if (mongoose.connection.readyState === 1) {
    try {
      const filter = {};
      if (crop) filter.crop = { $regex: new RegExp(crop, 'i') };
      if (district) filter.district = { $regex: new RegExp(district, 'i') };
      if (state) filter.state = { $regex: new RegExp(state, 'i') };

      const prices = await MarketPrice.find(filter).sort({ crop: 1, modalPrice: -1 });
      if (prices && prices.length > 0) {
        return res.status(200).json({
          success: true,
          count: prices.length,
          dataSourceNotice: 'Indicative / Demo Market Data (aligned with e-NAM reference mandi records)',
          data: prices
        });
      }
    } catch (error) {
      console.warn('[MarketController] DB error:', error.message);
    }
  }

  let filtered = mockData.marketPrices;
  if (crop) {
    filtered = filtered.filter(p => p.crop.toLowerCase().includes(crop.toLowerCase()));
  }

  return res.status(200).json({
    success: true,
    count: filtered.length,
    dataSourceNotice: 'Indicative / Demo Market Data (aligned with e-NAM reference mandi records)',
    data: filtered
  });
};

// @desc    Get market prices for a specific crop
// @route   GET /api/market-prices/:crop
// @access  Public
exports.getPricesByCrop = async (req, res) => {
  const cropName = req.params.crop;

  if (mongoose.connection.readyState === 1) {
    try {
      const prices = await MarketPrice.find({
        crop: { $regex: new RegExp(`^${cropName}$`, 'i') }
      }).sort({ modalPrice: -1 });

      if (prices && prices.length > 0) {
        return res.status(200).json({
          success: true,
          crop: cropName,
          count: prices.length,
          dataSourceNotice: 'Indicative / Demo Market Data (e-NAM format)',
          data: prices
        });
      }
    } catch (error) {
      console.warn('[MarketController] DB error:', error.message);
    }
  }

  const filtered = mockData.marketPrices.filter(p => p.crop.toLowerCase() === cropName.toLowerCase());
  return res.status(200).json({
    success: true,
    crop: cropName,
    count: filtered.length,
    dataSourceNotice: 'Indicative / Demo Market Data (e-NAM format)',
    data: filtered.length > 0 ? filtered : mockData.marketPrices
  });
};
