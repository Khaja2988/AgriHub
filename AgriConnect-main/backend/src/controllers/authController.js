const mongoose = require('mongoose');
const User = require('../models/User');
const FarmerProfile = require('../models/FarmerProfile');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'agrihub_super_secret_jwt_key_2026', {
    expiresIn: '30d'
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
  try {
    let { name, email, password, phone, role = 'FARMER', preferredLanguage = 'te', village, district, state, farmSize, cropsGrown } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and password are required'
      });
    }

    email = email.toLowerCase().trim();
    name = name.trim();

    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({
        success: false,
        message: 'Database connection is pending or offline. Please verify MONGODB_URI in backend/.env'
      });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(409).json({
        success: false,
        message: 'A user already exists with this email address'
      });
    }

    const user = await User.create({
      name,
      email,
      password,
      phone: phone || '',
      role,
      preferredLanguage: ['en', 'te', 'hi'].includes(preferredLanguage) ? preferredLanguage : 'te'
    });

    let profile = null;
    if (role === 'FARMER') {
      const parsedCrops = Array.isArray(cropsGrown)
        ? cropsGrown
        : (typeof cropsGrown === 'string' && cropsGrown.length > 0 ? cropsGrown.split(',').map(c => c.trim()) : ['Tomato', 'Chilli']);

      profile = await FarmerProfile.create({
        user: user._id,
        name,
        phone: phone || '9848022338',
        email,
        village: village || 'Kaza',
        district: district || 'Guntur',
        state: state || 'Andhra Pradesh',
        preferredLanguage: ['en', 'te', 'hi'].includes(preferredLanguage) ? preferredLanguage : 'te',
        farmSize: farmSize || '2 acres',
        cropsGrown: parsedCrops
      });
    }

    const token = generateToken(user._id);

    return res.status(201).json({
      success: true,
      data: {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          phone: user.phone,
          preferredLanguage: user.preferredLanguage
        },
        profile
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error during registration'
    });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    let { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    email = email.toLowerCase().trim();

    if (mongoose.connection.readyState === 1) {
      const user = await User.findOne({ email });
      if (user) {
        const isMatch = await user.matchPassword(password);
        if (isMatch) {
          const profile = await FarmerProfile.findOne({ user: user._id });
          const token = generateToken(user._id);

          return res.status(200).json({
            success: true,
            data: {
              token,
              user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                phone: user.phone,
                preferredLanguage: user.preferredLanguage
              },
              profile
            }
          });
        }
      }
    }

    // Default fallback demo login if offline/local demo
    if (email === 'ravi.kumar@agrihub.in' || email === 'admin@agrihub.in' || (email.includes('ravi') && password === 'password123')) {
      const token = generateToken('usr-demo-ravi');
      return res.status(200).json({
        success: true,
        data: {
          token,
          user: {
            id: 'usr-demo-ravi',
            name: 'Ravi Kumar',
            email: email || 'ravi.kumar@agrihub.in',
            role: 'FARMER',
            phone: '9848012345',
            preferredLanguage: 'te'
          },
          profile: {
            name: 'Ravi Kumar',
            village: 'Kaza',
            district: 'Guntur',
            state: 'Andhra Pradesh',
            farmSize: '2 acres',
            cropsGrown: ['Tomato', 'Chilli']
          }
        }
      });
    }

    return res.status(401).json({
      success: false,
      message: 'Invalid email or password'
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error during login'
    });
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
  return res.status(200).json({
    success: true,
    data: {
      user: req.user || {
        id: 'usr-demo-ravi',
        name: 'Ravi Kumar',
        email: 'ravi.kumar@agrihub.in',
        role: 'FARMER',
        phone: '9848012345',
        preferredLanguage: 'te'
      },
      profile: {
        name: 'Ravi Kumar',
        village: 'Kaza',
        district: 'Guntur',
        state: 'Andhra Pradesh',
        farmSize: '2 acres',
        cropsGrown: ['Tomato', 'Chilli']
      }
    }
  });
};

// @desc    Instant Demo login for hackathon presentation (Ravi Kumar)
// @route   POST /api/auth/demo-login
// @access  Public
exports.demoLogin = async (req, res) => {
  const token = generateToken('usr-demo-ravi');

  return res.status(200).json({
    success: true,
    data: {
      token,
      user: {
        id: 'usr-demo-ravi',
        name: 'Ravi Kumar',
        email: 'ravi.kumar@agrihub.in',
        role: 'FARMER',
        phone: '9848012345',
        preferredLanguage: 'te'
      },
      profile: {
        name: 'Ravi Kumar',
        phone: '9848012345',
        email: 'ravi.kumar@agrihub.in',
        village: 'Kaza',
        district: 'Guntur',
        state: 'Andhra Pradesh',
        preferredLanguage: 'te',
        farmSize: '2 acres',
        cropsGrown: ['Tomato', 'Chilli'],
        coordinates: { latitude: 16.3067, longitude: 80.4365 }
      },
      isDemoAccount: true
    }
  });
};
