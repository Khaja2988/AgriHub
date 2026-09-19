const express = require('express');
const router = express.Router();
const syncController = require('../controllers/syncController');
const { optionalAuth } = require('../middleware/auth');

router.post('/queue', optionalAuth, syncController.queueSync);
router.get('/status', syncController.getSyncStatus);

module.exports = router;
