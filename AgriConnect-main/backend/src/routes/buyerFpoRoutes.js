const express = require('express');
const router = express.Router();
const buyerFpoController = require('../controllers/buyerFpoController');
const { optionalAuth } = require('../middleware/auth');

// Buyers routes
router.get('/buyers', buyerFpoController.getBuyers);
router.get('/buyers/:id', buyerFpoController.getBuyerById);
router.post('/buyers/inquiry', optionalAuth, buyerFpoController.sendInquiry);

// FPOs routes
router.get('/fpos', buyerFpoController.getFpos);
router.get('/fpos/:id', buyerFpoController.getFpoById);
router.post('/fpos/inquiry', optionalAuth, buyerFpoController.sendInquiry);

module.exports = router;
