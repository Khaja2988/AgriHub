const express = require('express');
const router = express.Router();
const marketController = require('../controllers/marketController');

router.get('/', marketController.getMarketPrices);
router.get('/:crop', marketController.getPricesByCrop);

module.exports = router;
