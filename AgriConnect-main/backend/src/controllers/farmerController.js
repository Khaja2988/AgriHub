const FarmerProfile = require('../models/FarmerProfile');
const User = require('../models/User');

// @desc    Get logged in farmer profile
// @route   GET /api/farmers/profile
// @access  Private
exports.getProfile = async (req, res) => {
  try {
    let profile = await FarmerProfile.findOne({ user: req.user._id });
    if (!profile) {
      profile = await FarmerProfile.create({
        user: req.user._id,
        name: req.user.name,
        email: req.user.email,
        phone: req.user.phone || '9848012345',
        village: 'Kaza',
        district: 'Guntur',
        state: 'Andhra Pradesh',
        preferredLanguage: req.user.preferredLanguage || 'te',
        farmSize: '2 acres',
        cropsGrown: ['Tomato', 'Chilli']
      });
    }

    return res.status(200).json({
      success: true,
      data: profile
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error fetching farmer profile'
    });
  }
};

// @desc    Update farmer profile
// @route   PUT /api/farmers/profile
// @access  Private
exports.updateProfile = async (req, res) => {
  try {
    const { name, phone, village, district, state, preferredLanguage, farmSize, cropsGrown, coordinates } = req.body;

    let profile = await FarmerProfile.findOne({ user: req.user._id });
    if (!profile) {
      profile = new FarmerProfile({ user: req.user._id });
    }

    if (name) profile.name = name;
    if (phone) profile.phone = phone;
    if (village) profile.village = village;
    if (district) profile.district = district;
    if (state) profile.state = state;
    if (preferredLanguage) {
      profile.preferredLanguage = preferredLanguage;
      await User.findByIdAndUpdate(req.user._id, { preferredLanguage });
    }
    if (farmSize) profile.farmSize = farmSize;
    if (cropsGrown) profile.cropsGrown = cropsGrown;
    if (coordinates) profile.coordinates = coordinates;

    await profile.save();

    return res.status(200).json({
      success: true,
      data: profile
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error updating farmer profile'
    });
  }
};
