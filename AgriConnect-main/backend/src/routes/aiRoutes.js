const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');
const { optionalAuth } = require('../middleware/auth');

// @route   POST /api/ai/chat
router.post('/chat', optionalAuth, aiController.chat);

// @route   GET /api/ai/topics
router.get('/topics', aiController.getTopics);

module.exports = router;
