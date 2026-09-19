const mongoose = require('mongoose');
const diagnosisService = require('../services/diagnosisService');
const Treatment = require('../models/Treatment');
const Diagnosis = require('../models/Diagnosis');

// Fallback treatment database
const FALLBACK_TREATMENTS = {
  'early blight': {
    condition: 'Early Blight (Alternaria solani)',
    crop: 'Tomato',
    severity: 'Medium',
    symptoms: 'Dark brown to black concentric ring lesions on older leaves, yellow chlorotic halo, foliage drying.',
    actionSteps: [
      'Prune and destroy heavily affected lower leaves immediately to halt spore spread.',
      'Water at the base of the plant only; avoid wet foliage.',
      'Ensure proper spacing (60cm x 45cm) and staking for maximum sunlight and airflow.',
      'Apply Copper Oxychloride 50 WP (3g/L) or Mancozeb 75 WP (2g/L) on affected foliage.',
      'Repeat spray every 7-10 days during cloudy/humid conditions.'
    ],
    prevention: [
      'Practice 2-3 year crop rotation away from solanaceous crops.',
      'Use certified disease-free seeds and apply organic straw mulch.'
    ],
    expertAdvisoryContact: 'Kisan Call Centre: 1800-180-1551 (Toll-free) | Mandal Agriculture Officer (Guntur)'
  },
  'chilli leaf curl': {
    condition: 'Chilli Leaf Curl Virus',
    crop: 'Chilli',
    severity: 'Medium',
    symptoms: 'Upward puckering and curling of leaves, stunted plant height, flower dropping.',
    actionSteps: [
      'Install yellow sticky traps (15 per acre) to catch whiteflies.',
      'Uproot and burn severely infected viral plants.',
      'Spray Neem seed kernel extract (NSKE 5%) or Diafenthiuron 50 WP (1.25g/L).'
    ],
    prevention: [
      'Plant 2-3 border rows of maize or jowar as barrier crops.',
      'Use silver/black reflective mulching to repel insect vectors.'
    ],
    expertAdvisoryContact: 'Rythu Bharosa Kendram (RBK), Guntur | Toll-free: 1800-180-1551'
  }
};

// @desc    Diagnose crop condition from image
// @route   POST /api/diagnosis
// @access  Public
exports.diagnoseCrop = async (req, res) => {
  try {
    const { crop = 'Tomato' } = req.body;
    const imageFile = req.file;
    const farmerId = req.user ? req.user._id : null;

    const diagnosisResult = await diagnosisService.runDiagnosis({
      crop,
      imageFile,
      farmerId,
      metadata: req.body
    });

    return res.status(200).json({
      success: true,
      data: diagnosisResult
    });
  } catch (error) {
    console.error('Diagnosis error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Error processing crop diagnosis'
    });
  }
};

// @desc    Get diagnosis history for farmer
// @route   GET /api/diagnosis/history
// @access  Public
exports.getDiagnosisHistory = async (req, res) => {
  if (mongoose.connection.readyState === 1) {
    try {
      const query = req.user ? { farmer: req.user._id } : {};
      const history = await Diagnosis.find(query).sort({ createdAt: -1 }).limit(20);
      return res.status(200).json({
        success: true,
        count: history.length,
        data: history
      });
    } catch (error) {
      console.warn('[DiagnosisController] DB error:', error.message);
    }
  }

  // Fallback demo diagnosis history
  return res.status(200).json({
    success: true,
    count: 1,
    data: [
      {
        _id: 'diag-demo-1',
        crop: 'Tomato',
        condition: 'Early Blight (Alternaria solani)',
        type: 'Disease',
        confidence: 89,
        severity: 'Medium',
        symptoms: 'Dark brown concentric ring lesions on older leaves, yellow halo.',
        provider: 'DemoDiagnosisProvider (AI-assisted Demo Diagnosis)',
        isDemo: true,
        createdAt: new Date()
      }
    ]
  });
};

// @desc    Get treatment guidance for a specific condition
// @route   GET /api/treatments/:condition
// @access  Public
exports.getTreatmentGuidance = async (req, res) => {
  const conditionParam = decodeURIComponent(req.params.condition).toLowerCase();

  if (mongoose.connection.readyState === 1) {
    try {
      const treatment = await Treatment.findOne({
        condition: { $regex: new RegExp(conditionParam, 'i') }
      });
      if (treatment) {
        return res.status(200).json({
          success: true,
          data: treatment
        });
      }
    } catch (error) {
      console.warn('[TreatmentController] DB error:', error.message);
    }
  }

  let matched = FALLBACK_TREATMENTS['early blight'];
  if (conditionParam.includes('chilli') || conditionParam.includes('curl')) {
    matched = FALLBACK_TREATMENTS['chilli leaf curl'];
  }

  return res.status(200).json({
    success: true,
    data: matched
  });
};
