const User = require('../models/User');
const Crop = require('../models/Crop');
const MarketPrice = require('../models/MarketPrice');
const Buyer = require('../models/Buyer');
const FPO = require('../models/FPO');
const StorageFacility = require('../models/StorageFacility');
const LogisticsProvider = require('../models/LogisticsProvider');
const SellingRequest = require('../models/SellingRequest');
const Diagnosis = require('../models/Diagnosis');

// @desc    Get system administration statistics
// @route   GET /api/admin/stats
// @access  Public (admin view)
exports.getStats = async (req, res) => {
  try {
    const [
      farmersCount,
      cropsCount,
      pricesCount,
      buyersCount,
      fposCount,
      storageCount,
      logisticsCount,
      requestsCount,
      diagnosisCount
    ] = await Promise.all([
      User.countDocuments({ role: 'FARMER' }),
      Crop.countDocuments(),
      MarketPrice.countDocuments(),
      Buyer.countDocuments(),
      FPO.countDocuments(),
      StorageFacility.countDocuments(),
      LogisticsProvider.countDocuments(),
      SellingRequest.countDocuments(),
      Diagnosis.countDocuments()
    ]);

    const recentRequests = await SellingRequest.find().sort({ createdAt: -1 }).limit(5);

    return res.status(200).json({
      success: true,
      data: {
        counts: {
          farmers: farmersCount,
          crops: cropsCount,
          marketPrices: pricesCount,
          buyers: buyersCount,
          fpos: fposCount,
          storageFacilities: storageCount,
          logisticsProviders: logisticsCount,
          sellingRequests: requestsCount,
          diagnoses: diagnosisCount
        },
        recentRequests
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Error fetching admin statistics'
    });
  }
};
