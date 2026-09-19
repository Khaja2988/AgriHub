const app = require('./app');
const { connectDB } = require('./config/db');

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  // Connect to database (Atlas or local)
  await connectDB();

  app.listen(PORT, () => {
    console.log(`=======================================================`);
    console.log(`🌾 AGRIHUB Backend Server is running on port ${PORT}`);
    console.log(`🌾 Health Check: http://localhost:${PORT}/api/health`);
    console.log(`🌾 Role: Smart Crop Care & Direct Market Access`);
    console.log(`=======================================================`);
  });
};

startServer();
