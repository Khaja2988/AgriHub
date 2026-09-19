const express = require('express');
const router = express.Router();
const farmerController = require('../controllers/farmerController');
const { protect } = require('../middleware/auth');

router.get('/profile', protect, farmerController.getProfile);
router.put('/profile', protect, farmerController.updateProfile);

module.exports = router;
