// In-memory fallback repository for resilient demo and offline resilience
const mockData = {
  crops: [
    {
      _id: 'crop-1',
      name: 'Tomato',
      localNames: { en: 'Tomato', te: 'టమోటా (Tomato)', hi: 'टमाटर (Tomato)' },
      category: 'Vegetable',
      season: 'Rabi & Kharif',
      commonDiseases: ['Early Blight', 'Late Blight', 'Leaf Curl'],
      commonPests: ['Fruit Borer', 'Whitefly']
    },
    {
      _id: 'crop-2',
      name: 'Chilli',
      localNames: { en: 'Chilli', te: 'మిరప (Mirapa)', hi: 'मिर्च (Mirch)' },
      category: 'Cash Crop / Spice',
      season: 'Kharif',
      commonDiseases: ['Chilli Leaf Curl', 'Anthracnose / Fruit Rot', 'Powdery Mildew'],
      commonPests: ['Thrips', 'Mites', 'Whitefly']
    },
    {
      _id: 'crop-3',
      name: 'Rice',
      localNames: { en: 'Rice / Paddy', te: 'వరి (Vari)', hi: 'धान / चावल (Dhan)' },
      category: 'Cereal / Grain',
      season: 'Kharif & Rabi',
      commonDiseases: ['Rice Blast', 'Bacterial Leaf Blight', 'Sheath Blight'],
      commonPests: ['Stem Borer', 'Brown Planthopper']
    },
    {
      _id: 'crop-4',
      name: 'Cotton',
      localNames: { en: 'Cotton', te: 'ప్రత్తి (Pratti)', hi: 'కపాస్ (Kapas)' },
      category: 'Cash Crop / Fiber',
      season: 'Kharif',
      commonDiseases: ['Bacterial Blight', 'Grey Mildew'],
      commonPests: ['Pink Bollworm', 'Aphids']
    },
    {
      _id: 'crop-5',
      name: 'Maize',
      localNames: { en: 'Maize / Corn', te: 'మొక్కజొన్న (Mokkajonna)', hi: 'मक्का (Makka)' },
      category: 'Cereal / Grain',
      season: 'Kharif & Rabi',
      commonDiseases: ['Turcicum Leaf Blight', 'Common Rust'],
      commonPests: ['Fall Armyworm']
    },
    {
      _id: 'crop-6',
      name: 'Groundnut',
      localNames: { en: 'Groundnut / Peanut', te: 'వేరుశనగ (Verusanaga)', hi: 'मूंगफली (Moongphali)' },
      category: 'Oilseed',
      season: 'Kharif & Rabi',
      commonDiseases: ['Tikka Leaf Spot', 'Rust'],
      commonPests: ['Leaf Miner', 'White Grub']
    }
  ],
  marketPrices: [
    {
      _id: 'mp-1',
      crop: 'Tomato',
      market: 'Guntur Market Yard',
      district: 'Guntur',
      state: 'Andhra Pradesh',
      minPrice: 18,
      modalPrice: 22,
      maxPrice: 26,
      unit: '₹/kg',
      sourceType: 'DEMO',
      updatedAt: new Date()
    },
    {
      _id: 'mp-2',
      crop: 'Tomato',
      market: 'Tenali AMC',
      district: 'Guntur',
      state: 'Andhra Pradesh',
      minPrice: 17,
      modalPrice: 21,
      maxPrice: 25,
      unit: '₹/kg',
      sourceType: 'DEMO',
      updatedAt: new Date()
    },
    {
      _id: 'mp-3',
      crop: 'Tomato',
      market: 'Bowenpally Rythu Bazaar',
      district: 'Hyderabad',
      state: 'Telangana',
      minPrice: 20,
      modalPrice: 24,
      maxPrice: 28,
      unit: '₹/kg',
      sourceType: 'DEMO',
      updatedAt: new Date()
    },
    {
      _id: 'mp-4',
      crop: 'Chilli',
      market: 'Guntur Mirchi Yard',
      district: 'Guntur',
      state: 'Andhra Pradesh',
      minPrice: 145,
      modalPrice: 165,
      maxPrice: 185,
      unit: '₹/kg',
      sourceType: 'DEMO',
      updatedAt: new Date()
    },
    {
      _id: 'mp-5',
      crop: 'Rice',
      market: 'Miryalaguda Mandi',
      district: 'Nalgonda',
      state: 'Telangana',
      minPrice: 23,
      modalPrice: 27,
      maxPrice: 30,
      unit: '₹/kg',
      sourceType: 'DEMO',
      updatedAt: new Date()
    },
    {
      _id: 'mp-6',
      crop: 'Cotton',
      market: 'Warangal Enumamula Mandi',
      district: 'Warangal',
      state: 'Telangana',
      minPrice: 68,
      modalPrice: 74,
      maxPrice: 79,
      unit: '₹/kg',
      sourceType: 'DEMO',
      updatedAt: new Date()
    }
  ],
  buyers: [
    {
      _id: 'b-1',
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
      _id: 'b-2',
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
      _id: 'b-3',
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
  ],
  fpos: [
    {
      _id: 'fpo-1',
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
      _id: 'fpo-2',
      name: 'Krishna Delta Organic Farmers Producer Society',
      crops: ['Tomato', 'Rice', 'Vegetables'],
      location: 'Tenali Rural, Guntur',
      district: 'Guntur',
      state: 'Andhra Pradesh',
      procurementCapacity: 35000,
      contact: '08644-245678',
      verified: true
    }
  ],
  storageFacilities: [
    {
      _id: 'st-1',
      name: 'Guntur Central Cold Chain Warehouse',
      location: 'NH-16 Bypass, Kaza Junction',
      district: 'Guntur',
      state: 'Andhra Pradesh',
      latitude: 16.3210,
      longitude: 80.4420,
      totalCapacity: 50000,
      availableCapacity: 18500,
      storageType: 'Multi-Commodity Cold Storage (4°C - 10°C)',
      estimatedCost: 2,
      costUnit: '₹/kg/month',
      contact: '9848077889',
      supportedCrops: ['Tomato', 'Chilli', 'Vegetables']
    },
    {
      _id: 'st-2',
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
  ],
  logisticsProviders: [
    {
      _id: 'log-1',
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
      _id: 'log-2',
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
  ],
  sellingRequests: [
    {
      _id: 'sr-demo-1',
      farmerName: 'Ravi Kumar',
      crop: 'Tomato',
      quantity: 1000,
      harvestDate: '2026-09-20',
      expectedPrice: 22,
      targetType: 'BUYER',
      buyerName: 'Sri Krishna Agro Traders',
      storageName: 'Guntur Central Cold Chain Warehouse',
      logisticsName: 'Kisan Rural Logistics (Ashok Leyland Dost)',
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
      createdAt: new Date()
    }
  ]
};

module.exports = mockData;
