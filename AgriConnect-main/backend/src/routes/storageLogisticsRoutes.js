const express = require('express');
const router = express.Router();
const storageLogisticsController = require('../controllers/storageLogisticsController');
const { optionalAuth } = require('../middleware/auth');

// Storage routes
router.get('/storage', storageLogisticsController.getStorageFacilities);
router.post('/storage/requests', optionalAuth, storageLogisticsController.createStorageRequest);

// Logistics routes
router.get('/logistics', storageLogisticsController.getLogisticsProviders);
router.post('/logistics/requests', optionalAuth, storageLogisticsController.createLogisticsRequest);

module.exports = router;
