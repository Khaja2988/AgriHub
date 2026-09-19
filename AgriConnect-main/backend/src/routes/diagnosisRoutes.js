const express = require('express');
const router = express.Router();
const diagnosisController = require('../controllers/diagnosisController');
const upload = require('../middleware/upload');
const { optionalAuth } = require('../middleware/auth');

router.post('/', optionalAuth, upload.single('image'), diagnosisController.diagnoseCrop);
router.get('/history', optionalAuth, diagnosisController.getDiagnosisHistory);
router.get('/treatment/:condition', diagnosisController.getTreatmentGuidance);
router.get('/:condition', diagnosisController.getTreatmentGuidance);

module.exports = router;
