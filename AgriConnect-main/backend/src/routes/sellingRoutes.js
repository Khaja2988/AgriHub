const express = require('express');
const router = express.Router();
const sellingController = require('../controllers/sellingController');
const { optionalAuth } = require('../middleware/auth');

router.post('/selling/calculate', sellingController.calculateDecision);
router.post('/selling-requests', optionalAuth, sellingController.createSellingRequest);
router.get('/selling-requests', optionalAuth, sellingController.getSellingRequests);
router.get('/selling-requests/:id', sellingController.getRequestById);
router.put('/selling-requests/:id/status', sellingController.updateRequestStatus);

module.exports = router;
