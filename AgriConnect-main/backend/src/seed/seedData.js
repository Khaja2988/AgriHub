require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const FarmerProfile = require('../models/FarmerProfile');
const Crop = require('../models/Crop');
const Treatment = require('../models/Treatment');
const MarketPrice = require('../models/MarketPrice');
const Buyer = require('../models/Buyer');
const FPO = require('../models/FPO');
const StorageFacility = require('../models/StorageFacility');
const LogisticsProvider = require('../models/LogisticsProvider');
const SellingRequest = require('../models/SellingRequest');

const seedAll = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/agrihub';
  console.log(`[Seed] Connecting to MongoDB at: ${uri}`);
  
  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 10000 });
    console.log('✅ [Seed] Database connected successfully to MongoDB Atlas.');
  } catch (err) {
    console.error(`[Seed Error] Could not connect to MongoDB: ${err.message}`);
    console.error('[Seed Error] Please ensure your MongoDB Atlas cluster URI is set in backend/.env');
    process.exit(1);
  }

  try {
    console.log('[Seed] Clearing existing demo collections...');
    await Promise.all([
      User.deleteMany({}),
      FarmerProfile.deleteMany({}),
      Crop.deleteMany({}),
      Treatment.deleteMany({}),
      MarketPrice.deleteMany({}),
      Buyer.deleteMany({}),
      FPO.deleteMany({}),
      StorageFacility.deleteMany({}),
      LogisticsProvider.deleteMany({}),
      SellingRequest.deleteMany({})
    ]);

    console.log('[Seed] Creating demo users...');
    const demoFarmer = await User.create({
      name: 'Ravi Kumar',
      email: 'ravi.kumar@agrihub.in',
      password: 'password123',
      role: 'FARMER',
      phone: '9848012345',
      preferredLanguage: 'te'
    });

    const demoAdmin = await User.create({
      name: 'AGRIHUB Admin',
      email: 'admin@agrihub.in',
      password: 'adminpassword123',
      role: 'ADMIN',
      phone: '9848099999',
      preferredLanguage: 'en'
    });

    console.log('[Seed] Creating Farmer Profile for Ravi Kumar...');
    await FarmerProfile.create({
      user: demoFarmer._id,
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
    });

    console.log('[Seed] Seeding Crops...');
    await Crop.insertMany([
      {
        name: 'Tomato',
        localNames: { en: 'Tomato', te: 'టమోటా (Tomato)', hi: 'टमाटर (Tomato)' },
        category: 'Vegetable',
        season: 'Rabi & Kharif',
        commonDiseases: ['Early Blight', 'Late Blight', 'Leaf Curl'],
        commonPests: ['Fruit Borer', 'Whitefly']
      },
      {
        name: 'Chilli',
        localNames: { en: 'Chilli', te: 'మిరప (Mirapa)', hi: 'मिर्च (Mirch)' },
        category: 'Cash Crop / Spice',
        season: 'Kharif',
        commonDiseases: ['Chilli Leaf Curl', 'Anthracnose / Fruit Rot', 'Powdery Mildew'],
        commonPests: ['Thrips', 'Mites', 'Whitefly']
      },
      {
        name: 'Rice',
        localNames: { en: 'Rice / Paddy', te: 'వరి (Vari)', hi: 'धान / चावल (Dhan)' },
        category: 'Cereal / Grain',
        season: 'Kharif & Rabi',
        commonDiseases: ['Rice Blast', 'Bacterial Leaf Blight', 'Sheath Blight'],
        commonPests: ['Stem Borer', 'Brown Planthopper', 'Gall Midge']
      },
      {
        name: 'Cotton',
        localNames: { en: 'Cotton', te: 'ప్రత్తి (Pratti)', hi: 'कपास (Kapas)' },
        category: 'Cash Crop / Fiber',
        season: 'Kharif',
        commonDiseases: ['Bacterial Blight', 'Grey Mildew', 'Alternaria Leaf Spot'],
        commonPests: ['Pink Bollworm', 'American Bollworm', 'Aphids']
      },
      {
        name: 'Maize',
        localNames: { en: 'Maize / Corn', te: 'మొక్కజొన్న (Mokkajonna)', hi: 'मक्का (Makka)' },
        category: 'Cereal / Grain',
        season: 'Kharif & Rabi',
        commonDiseases: ['Turcicum Leaf Blight', 'Common Rust', 'Downy Mildew'],
        commonPests: ['Fall Armyworm', 'Stem Borer']
      },
      {
        name: 'Groundnut',
        localNames: { en: 'Groundnut / Peanut', te: 'వేరుశనగ (Verusanaga)', hi: 'मूंगफली (Moongphali)' },
        category: 'Oilseed',
        season: 'Kharif & Rabi',
        commonDiseases: ['Tikka Leaf Spot', 'Rust', 'Collar Rot'],
        commonPests: ['Leaf Miner', 'Spodoptera', 'White Grub']
      }
    ]);

    console.log('[Seed] Seeding Treatment Knowledge Base...');
    await Treatment.insertMany([
      {
        condition: 'Early Blight (Alternaria solani)',
        crop: 'Tomato',
        severity: 'Medium',
        symptoms: 'Concentric dark brown circular rings on leaves, yellow chlorotic margin, defoliation.',
        actionSteps: [
          'Prune heavily infected lower leaves and destroy by deep burial.',
          'Water plants only at root level; keep foliage dry during irrigation.',
          'Ensure adequate spacing (60cm x 45cm) for airflow and sunlight.',
          'Spray Copper Oxychloride 50 WP (3g/L) or Mancozeb 75 WP (2g/L) on affected foliage.',
          'Repeat spray at 7-10 day intervals during humid weather.'
        ],
        prevention: [
          'Rotate with non-solanaceous crops (e.g. maize, legumes).',
          'Use certified blight-tolerant seeds.',
          'Apply organic straw mulching to prevent soil pathogen splash.'
        ],
        expertAdvisoryContact: 'Kisan Call Centre: 1800-180-1551 (Toll-free) | Mandal Agriculture Office, Guntur'
      },
      {
        condition: 'Chilli Leaf Curl Virus',
        crop: 'Chilli',
        severity: 'Medium',
        symptoms: 'Upward puckering of leaves, stunted bushy appearance, flower drop.',
        actionSteps: [
          'Install yellow sticky traps (15 traps per acre) to trap whitefly vectors.',
          'Uproot and burn severely infected viral plants.',
          'Spray Neem seed kernel extract (NSKE 5%) or Diafenthiuron 50 WP (1.25g/L).'
        ],
        prevention: [
          'Plant border rows of maize or sorghum as wind and pest barriers.',
          'Silver reflective mulch beds to repel vector thrips and whiteflies.'
        ],
        expertAdvisoryContact: 'Horticulture Officer, Guntur: 0863-2234567 | Toll-free: 1800-180-1551'
      }
    ]);

    console.log('[Seed] Seeding Indicative Mandi Market Prices...');
    await MarketPrice.insertMany([
      {
        crop: 'Tomato',
        market: 'Guntur Market Yard',
        district: 'Guntur',
        state: 'Andhra Pradesh',
        minPrice: 18,
        modalPrice: 22,
        maxPrice: 26,
        unit: '₹/kg',
        sourceType: 'DEMO'
      },
      {
        crop: 'Tomato',
        market: 'Tenali AMC',
        district: 'Guntur',
        state: 'Andhra Pradesh',
        minPrice: 17,
        modalPrice: 21,
        maxPrice: 25,
        unit: '₹/kg',
        sourceType: 'DEMO'
      },
      {
        crop: 'Tomato',
        market: 'Bowenpally Rythu Bazaar',
        district: 'Hyderabad',
        state: 'Telangana',
        minPrice: 20,
        modalPrice: 24,
        maxPrice: 28,
        unit: '₹/kg',
        sourceType: 'DEMO'
      },
      {
        crop: 'Chilli',
        market: 'Guntur Mirchi Yard (Asia largest)',
        district: 'Guntur',
        state: 'Andhra Pradesh',
        minPrice: 145,
        modalPrice: 165,
        maxPrice: 185,
        unit: '₹/kg',
        sourceType: 'DEMO'
      },
      {
        crop: 'Rice',
        market: 'Miryalaguda Mandi',
        district: 'Nalgonda',
        state: 'Telangana',
        minPrice: 23,
        modalPrice: 27,
        maxPrice: 30,
        unit: '₹/kg',
        sourceType: 'DEMO'
      },
      {
        crop: 'Cotton',
        market: 'Warangal Enumamula Mandi',
        district: 'Warangal',
        state: 'Telangana',
        minPrice: 68,
        modalPrice: 74,
        maxPrice: 79,
        unit: '₹/kg',
        sourceType: 'DEMO'
      }
    ]);

    console.log('[Seed] Seeding Verified Direct Buyers...');
    const buyers = await Buyer.insertMany([
      {
        name: 'Sri Krishna Agro Traders',
        crops: ['Tomato', 'Chilli'],
        requiredQuantity: 5000,
        indicativePrice: 22,
        location: 'Kaza Mandi Road, Guntur',
        district: 'Guntur',
        state: 'Andhra Pradesh',
        contact: '9848011223',
        verified: true
      },
      {
        name: 'Amaravati Fresh Agri Procurement',
        crops: ['Tomato', 'Vegetables', 'Chilli'],
        requiredQuantity: 10000,
        indicativePrice: 23,
        location: 'Mangalagiri Bypass, Guntur',
        district: 'Guntur',
        state: 'Andhra Pradesh',
        contact: '9848033445',
        verified: true
      },
      {
        name: 'Vijayawada Wholesale Agro Hub',
        crops: ['Tomato', 'Rice', 'Maize'],
        requiredQuantity: 8000,
        indicativePrice: 21,
        location: 'Gollapudi Market, Vijayawada',
        district: 'Krishna',
        state: 'Andhra Pradesh',
        contact: '9848055667',
        verified: true
      }
    ]);

    console.log('[Seed] Seeding Farmer Producer Organizations (FPOs)...');
    const fpos = await FPO.insertMany([
      {
        name: 'Guntur Rythu Mitra Farmer Producer Co. (FPC)',
        crops: ['Tomato', 'Chilli', 'Cotton'],
        location: 'Autonagar, Guntur',
        district: 'Guntur',
        state: 'Andhra Pradesh',
        procurementCapacity: 50000,
        contact: '0863-2288990',
        verified: true
      },
      {
        name: 'Krishna Delta Organic Farmers Producer Society',
        crops: ['Tomato', 'Rice', 'Vegetables'],
        location: 'Tenali Rural, Guntur',
        district: 'Guntur',
        state: 'Andhra Pradesh',
        procurementCapacity: 35000,
        contact: '08644-245678',
        verified: true
      }
    ]);

    console.log('[Seed] Seeding Cold Storage Facilities...');
    const storages = await StorageFacility.insertMany([
      {
        name: 'Guntur Central Cold Chain Warehouse',
        location: 'NH-16 Bypass, Kaza Junction',
        district: 'Guntur',
        state: 'Andhra Pradesh',
        latitude: 16.3210,
        longitude: 80.4420,
        totalCapacity: 50000,
        availableCapacity: 18500,
        storageType: 'Multi-Commodity Cold Storage (4°C - 10°C)',
        estimatedCost: 2, // ₹2/kg/month
        costUnit: '₹/kg/month',
        contact: '9848077889',
        supportedCrops: ['Tomato', 'Chilli', 'Vegetables', 'Potato']
      },
      {
        name: 'Amaravati Precision Agri Cold Store',
        location: 'Mangalagiri Industrial Park',
        district: 'Guntur',
        state: 'Andhra Pradesh',
        latitude: 16.4350,
        longitude: 80.5620,
        totalCapacity: 40000,
        availableCapacity: 12000,
        storageType: 'Controlled Atmosphere (CA) Storage',
        estimatedCost: 2.5,
        costUnit: '₹/kg/month',
        contact: '9848088990',
        supportedCrops: ['Tomato', 'Chilli', 'Fruits']
      }
    ]);

    console.log('[Seed] Seeding Rural Logistics Providers...');
    const logistics = await LogisticsProvider.insertMany([
      {
        provider: 'Kisan Rural Logistics (Ashok Leyland Dost)',
        vehicleType: 'Mini Truck (1.5 Ton)',
        capacity: 1500,
        serviceAreas: ['Guntur', 'Kaza', 'Mangalagiri', 'Tenali'],
        baseRate: 500,
        estimatedCost: 1500,
        ratePerKm: 15,
        estimatedTime: 'Within 2 hours',
        contact: '9848099112',
        available: true
      },
      {
        provider: 'Rythu Seva Transport (Tata 407)',
        vehicleType: 'Medium Truck (3.5 Ton)',
        capacity: 3500,
        serviceAreas: ['Guntur', 'Vijayawada', 'Tenali', 'Krishna District'],
        baseRate: 900,
        estimatedCost: 2400,
        ratePerKm: 20,
        estimatedTime: 'Within 3 hours',
        contact: '9848099334',
        available: true
      }
    ]);

    console.log('[Seed] Seeding Demo Selling Request for Ravi Kumar...');
    await SellingRequest.create({
      farmer: demoFarmer._id,
      farmerName: 'Ravi Kumar',
      crop: 'Tomato',
      quantity: 1000,
      harvestDate: new Date().toISOString().split('T')[0],
      expectedPrice: 22,
      targetType: 'BUYER',
      buyerId: buyers[0]._id,
      buyerName: buyers[0].name,
      storageId: storages[0]._id,
      storageName: storages[0].name,
      logisticsId: logistics[0]._id,
      logisticsName: logistics[0].provider,
      pickupLocation: 'Kaza Village Farm, Guntur',
      estimatedGrossValue: 22000,
      estimatedCosts: {
        storageCost: 2000,
        transportCost: 1500,
        otherCosts: 250,
        totalCost: 3750
      },
      estimatedNetValue: 18250,
      status: 'PENDING',
      notes: 'Demo selling request for 1000kg fresh grade-A tomatoes'
    });

    console.log('[Seed] SUCCESS: Realistic demo data seeded successfully!');
    process.exit(0);
  } catch (err) {
    console.error(`[Seed Error] Seeding failed: ${err.message}`);
    process.exit(1);
  }
};

seedAll();
