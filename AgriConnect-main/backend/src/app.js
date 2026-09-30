require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');

// Route imports
const authRoutes = require('./routes/authRoutes');
const farmerRoutes = require('./routes/farmerRoutes');
const cropRoutes = require('./routes/cropRoutes');
const diagnosisRoutes = require('./routes/diagnosisRoutes');
const marketRoutes = require('./routes/marketRoutes');
const buyerFpoRoutes = require('./routes/buyerFpoRoutes');
const storageLogisticsRoutes = require('./routes/storageLogisticsRoutes');
const sellingRoutes = require('./routes/sellingRoutes');
const syncRoutes = require('./routes/syncRoutes');
const adminRoutes = require('./routes/adminRoutes');
const aiRoutes = require('./routes/aiRoutes');

const app = express();

// CORS Configuration
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      'https://khaja2988.github.io/AgriHub',  // GitHub Pages production
      'http://localhost:3000',                 // Local React dev
      'http://localhost:5000',                 // Local backend
      'http://localhost:5173',                 // Vite dev server
      'http://127.0.0.1:3000',                 // Alternative localhost
      'http://127.0.0.1:5000',                 // Alternative localhost
      'http://127.0.0.1:5173',                 // Alternative Vite
    ];

    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('CORS policy: Origin not allowed'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  optionsSuccessStatus: 200
};

// Middlewares
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Serve uploaded leaf images statically
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    platform: 'AGRIHUB API',
    version: '1.0.0',
    subtitle: 'Smart Crop Care & Direct Market Access for Farmers',
    timestamp: new Date().toISOString()
  });
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/farmers', farmerRoutes);
app.use('/api/crops', cropRoutes);
app.use('/api/diagnosis', diagnosisRoutes);
app.use('/api/diagnose', diagnosisRoutes);
app.use('/api/treatments', diagnosisRoutes); // also maps /api/treatments/:condition
app.use('/api/market-prices', marketRoutes);
app.use('/api', buyerFpoRoutes); // mounts /api/buyers and /api/fpos
app.use('/api', storageLogisticsRoutes); // mounts /api/storage and /api/logistics
app.use('/api', sellingRoutes); // mounts /api/selling/calculate and /api/selling-requests
app.use('/api/sync', syncRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/ai', aiRoutes);

// 404 Handler
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `API Route Not Found: ${req.method} ${req.originalUrl}`
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[AGRIHUB Server Error]', err.stack || err.message);
  
  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

module.exports = app;
