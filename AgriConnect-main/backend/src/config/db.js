const mongoose = require('mongoose');

let isConnected = false;

// Listen to connection state events
mongoose.connection.on('connected', () => {
  isConnected = true;
  console.log('✅ [AGRIHUB] MongoDB Atlas connected successfully.');
});

mongoose.connection.on('error', (err) => {
  isConnected = false;
  console.error('❌ [AGRIHUB] MongoDB connection error:', err.message);
});

mongoose.connection.on('disconnected', () => {
  isConnected = false;
  console.warn('⚠️ [AGRIHUB] MongoDB disconnected.');
});

const connectDB = async () => {
  // Re-read .env in case user updated credentials
  require('dotenv').config();
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/agrihub';

  if (!uri || uri.includes('YOUR_PASSWORD_HERE')) {
    isConnected = false;
    console.warn('⚠️ [AGRIHUB Warning] MONGODB_URI in backend/.env still contains placeholder YOUR_PASSWORD_HERE');
    return null;
  }
  
  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 8000,
    });
    isConnected = true;
    console.log(`🌾 [AGRIHUB] MongoDB Connected to host: ${conn.connection.host}, Database: ${conn.connection.name}`);
    return conn;
  } catch (error) {
    isConnected = false;
    console.error(`❌ [AGRIHUB Error] Could not connect to MongoDB: ${error.message}`);
    if (error.message.includes('bad auth') || error.message.includes('Authentication failed')) {
      console.error(`   👉 ACTION REQUIRED: Database user password does not match in backend/.env`);
    } else if (error.message.includes('ETIMEDOUT') || error.message.includes('ServerSelectionTimeout')) {
      console.error(`   👉 ACTION REQUIRED: IP address may not be allowed in MongoDB Atlas Network Access (0.0.0.0/0)`);
    }
    return null;
  }
};

// Automatic retry connection loop every 6 seconds if not connected
setInterval(async () => {
  if (mongoose.connection.readyState !== 1) {
    await connectDB();
  }
}, 6000);

const getIsConnected = () => isConnected || mongoose.connection.readyState === 1;

module.exports = { connectDB, getIsConnected };

