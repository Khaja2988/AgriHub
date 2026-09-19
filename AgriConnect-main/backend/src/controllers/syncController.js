const SyncQueue = require('../models/SyncQueue');

// @desc    Queue offline operations for syncing when connection returns
// @route   POST /api/sync/queue
// @access  Public (optionalAuth)
exports.queueSync = async (req, res) => {
  try {
    const { actionType, payload } = req.body;

    const item = new SyncQueue({
      user: req.user ? req.user._id : null,
      actionType,
      payload,
      status: 'PROCESSED' // In hackathon mode, automatically process and acknowledge
    });

    await item.save();

    return res.status(200).json({
      success: true,
      message: 'Offline operation queued and synchronized successfully.',
      data: item
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Error processing offline sync'
    });
  }
};

// @desc    Get sync status
// @route   GET /api/sync/status
// @access  Public
exports.getSyncStatus = async (req, res) => {
  return res.status(200).json({
    success: true,
    serverTime: new Date().toISOString(),
    status: 'ONLINE',
    message: 'AGRIHUB cloud services are active.'
  });
};
