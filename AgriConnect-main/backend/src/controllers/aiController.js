const aiAdvisoryService = require('../services/aiAdvisoryService');

// @desc    Get AI Agricultural Advice
// @route   POST /api/ai/chat
// @access  Public (Optionally authenticated)
exports.chat = async (req, res) => {
  try {
    const { query, language = 'te', cropContext } = req.body;

    if (!query) {
      return res.status(400).json({
        success: false,
        message: 'Query is required for AI advisory'
      });
    }

    const result = await aiAdvisoryService.getAdvisory({
      query,
      language,
      cropContext,
      farmerData: req.user || null
    });

    return res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('AI Advisory error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Error generating AI agricultural advice'
    });
  }
};

// @desc    Get Quick Agricultural Topics & Chips
// @route   GET /api/ai/topics
// @access  Public
exports.getTopics = async (req, res) => {
  const language = req.query.lang || 'te';

  const topics = {
    te: [
      { id: 1, label: '🍅 టమోటా ఆకుముడత & మచ్చల నివారణ', query: 'టమోటాలో ఆకుముడత మరియు ముందస్తు మాడ తెగులు నివారణకు మందుల మోతాదు ఏమిటి?', crop: 'Tomato' },
      { id: 2, label: '🌶️ మిరపలో నల్లి & తామర పురుగులు', query: 'మిరపలో తామర పురుగులు మరియు నల్లి నివారణకు సరైన పిచికారీ మందులు ఏమిటి?', crop: 'Chilli' },
      { id: 3, label: '🌾 వరిలో అగ్గి తెగులు & సుడిదోమ', query: 'వరిలో అగ్గి తెగులు మరియు సుడిదోమ రాకుండా ఎలాంటి చర్యలు తీసుకోవాలి?', crop: 'Rice' },
      { id: 4, label: '📊 మార్కెట్ అమ్మకం vs కోల్డ్ స్టోరేజ్', query: 'మిరప లేదా టమోటా పంటను ఇప్పుడే మండీలో అమ్మాలా లేక కోల్డ్ స్టోరేజ్‌లో దాచుకోవాలా?', crop: 'Market' },
      { id: 5, label: '🌱 సమతుల్య యూరియా & ఎరువుల మోతాదు', query: 'పంట ఎదుగుదలకు యూరియా, డీఏపీ మరియు పొటాష్ ఎరువులు ఎలా వాడాలి?', crop: 'Fertilizer' }
    ],
    en: [
      { id: 1, label: '🍅 Tomato Blight & Leaf Spot Cure', query: 'What is the dosage for curing Early Blight and leaf spots in Tomato?', crop: 'Tomato' },
      { id: 2, label: '🌶️ Chilli Leaf Curl & Thrips Control', query: 'How to control Thrips, Mites, and leaf curl disease in Chilli crop?', crop: 'Chilli' },
      { id: 3, label: '🌾 Paddy Blast & BPH Prevention', query: 'What are the recommended fungicides for Blast disease in Paddy?', crop: 'Rice' },
      { id: 4, label: '📊 Sell Now vs Cold Storage Timing', query: 'Should I sell my harvest now or store in cold storage for higher margins?', crop: 'Market' },
      { id: 5, label: '🌱 N-P-K Fertilizer & Nutrient Schedule', query: 'What is the recommended fertilizer schedule and micronutrient dosage?', crop: 'Fertilizer' }
    ],
    hi: [
      { id: 1, label: '🍅 टमाटर झुलसा रोग नियंत्रण', query: 'टमाटर में पत्ती धब्बा और अगेती झुलसा का सही उपचार क्या है?', crop: 'Tomato' },
      { id: 2, label: '🌶️ मिर्च में पत्ती मरोड़ एवं थ्रिप्स', query: 'मिर्च में थ्रिप्स और मरोड़िया रोग के लिए कौन सी दवा स्प्रे करें?', crop: 'Chilli' },
      { id: 3, label: '🌾 धान में झोंका रोग (ब्लास्ट)', query: 'धान में ब्लास्ट रोग और भूरा फुदका की रोकथाम कैसे करें?', crop: 'Rice' },
      { id: 4, label: '📊 मंडी भाव और कोल्ड स्टोरेज सलाह', query: 'फसल को अभी मंडी में बेचना चाहिए या कोल्ड स्टोरेज में रखना चाहिए?', crop: 'Market' },
      { id: 5, label: '🌱 संतुलित खाद एवं यूरिया का प्रयोग', query: 'फसल में यूरिया और डीएपी का सही अनुपात और समय क्या होना चाहिए?', crop: 'Fertilizer' }
    ]
  };

  return res.status(200).json({
    success: true,
    data: topics[language] || topics.te
  });
};
