const express = require('express');
const router = express.Router();
const cropController = require('../controllers/cropController');

router.get('/', cropController.getCrops);
router.get('/:name', cropController.getCropByName);

module.exports = router;
