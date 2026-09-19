/**
 * AI Krishi Advisory Service (అగ్రి AI సలహాదారు / कृषी AI सलाहकार)
 * Comprehensive multilingual agricultural advisory engine for Indian farmers.
 * Supports Gemini API (if GEMINI_API_KEY is configured) and includes an extensive
 * offline-resilient agricultural agronomy engine for Telugu, English, and Hindi.
 */

// Native fetch is built into Node.js 18+

// Curated crop knowledge base for common Indian agricultural queries
const CROP_KNOWLEDGE = {
  tomato: {
    diseases: [
      {
        name: 'Early Blight (Alternaria solani)',
        teluguName: 'ముందస్తు మాడ తెగులు',
        symptoms: 'Brown-black concentric target-board spots on older leaves, yellowing around rings.',
        organic: 'Spray 5% Neem seed kernel extract (NSKE) or Trichoderma viride (5g/L). Prune lower diseased leaves.',
        chemical: 'Mancozeb 75% WP @ 2.5g/L or Copper Oxychloride 50% WP @ 3g/L. In severe cases, Azoxystrobin + Difenoconazole @ 1ml/L.',
        prevention: 'Avoid overhead sprinkler watering, keep 2-3 feet spacing, stake plants off the ground.'
      },
      {
        name: 'Tomato Leaf Curl Virus (ToLCV)',
        teluguName: 'ఆకు ముడుత తెగులు (వైరస్)',
        symptoms: 'Curling of leaves upwards, stunted growth, bushy appearance, reduced fruit size.',
        vector: 'Transmitted by Whiteflies (Bemisia tabaci).',
        organic: 'Install yellow sticky traps (15-20 per acre). Spray 2% Neem oil (10,000 ppm) regularly.',
        chemical: 'Control whitefly vector: Spray Imidacloprid 17.8% SL @ 0.5ml/L or Diafenthiuron 50% WP @ 1g/L.',
        prevention: 'Use border crops like maize/sorghum (3-4 rows) around the tomato field to physically block whiteflies.'
      }
    ],
    fertilizer: 'Base dose: 25-30 tons Farmyard Manure + 40kg N, 60kg P, 40kg K per acre. Top dress Nitrogen in 2 splits during flowering and fruit setting.'
  },
  chilli: {
    diseases: [
      {
        name: 'Chilli Leaf Curl & Thrips / Mites Complex',
        teluguName: 'బొబ్బర తెగులు / నల్లి & తామర పురుగులు',
        symptoms: 'Upward leaf curling (Thrips) or downward boat-shaped curling (Mites), bronzing of leaves.',
        organic: 'Neem oil 10,000 ppm @ 3ml/L + soap solution. Blue sticky traps (for thrips) and yellow traps (for whiteflies).',
        chemical: 'For thrips: Fipronil 5% SC @ 2ml/L or Spinetoram 11.7% SC @ 1ml/L. For mites: Spiromesifen 22.9% SC @ 1ml/L or Propargite 57% EC @ 2ml/L.',
        prevention: 'Intercrop with cowpea or maize, avoid excessive Nitrogen fertilizer which attracts sucking pests.'
      },
      {
        name: 'Die-back & Anthracnose (Fruit Rot)',
        teluguName: 'కొమ్మ ఎండు తెగులు మరియు కాయ కుళ్లు',
        symptoms: 'Drying of twigs from top downwards, circular sunken spots on ripe fruits.',
        organic: 'Spray Pseudomonas fluorescens (5g/L) during early vegetative and flowering stages.',
        chemical: 'Spray Propiconazole 25% EC @ 1ml/L or Tebuconazole + Trifloxystrobin @ 0.7g/L.',
        prevention: 'Collect and burn dry twigs, seed treatment with Thiram or Trichoderma before sowing.'
      }
    ],
    fertilizer: 'Balanced application of 60kg N, 40kg P2O5, 50kg K2O per acre. Foliar spray of Micronutrients (Formula-4) at 45 & 75 days.'
  },
  rice: {
    diseases: [
      {
        name: 'Paddy Blast (Pyricularia oryzae)',
        teluguName: 'అగ్గి తెగులు',
        symptoms: 'Spindle-shaped eye lesions with grey centers and brown margins on leaves and neck.',
        organic: 'Spray fermented butter milk with asafoetida or Panchagavya (30ml/L).',
        chemical: 'Tricyclazole 75% WP @ 0.6g/L or Isoprothiolane 40% EC @ 1.5ml/L.',
        prevention: 'Do not apply excess Urea/Nitrogen during overcast humid weather; treat seed with Tricyclazole @ 2g/kg.'
      },
      {
        name: 'Brown Plant Hopper (BPH)',
        teluguName: 'సుడి దోమ',
        symptoms: 'Circular patches of drying plants appearing scorched (hopper burn) near ground level.',
        organic: 'Drain standing water for 3-4 days (alternate wetting and drying). Form alleyways (alley cropping).',
        chemical: 'Triflumuron + Ethiprole @ 1g/L or Pymetrozine 50% WDG @ 0.6g/L or Dinotefuran 20% SG @ 0.4g/L directly targeting plant base.',
        prevention: 'Alley formation (1 foot gap every 2 meters) allows sunlight and fresh air into canopy.'
      }
    ],
    fertilizer: 'N:P:K 40:24:20 kg/acre. Apply full P as basal; apply N and K in 3 equal splits: basal, tillering, and panicle initiation.'
  },
  cotton: {
    diseases: [
      {
        name: 'Pink Bollworm (Pectinophora gossypiella)',
        teluguName: 'గులాబీ రంగు కాయ తొలుచు పురుగు',
        symptoms: 'Rosetted flowers, double seeds inside open bolls, internal staining of lint.',
        organic: 'Install Pheromone traps @ 8-10 per acre. Release Trichogramma egg parasitoids.',
        chemical: 'Spray Chlorantraniliprole 18.5% SC @ 0.3ml/L or Emamectin Benzoate 5% SG @ 0.4g/L or Profenofos 50% EC @ 2ml/L.',
        prevention: 'Do not extend crop beyond 150-160 days; destroy stubbles after final picking.'
      }
    ]
  }
};

class AIAdvisoryService {
  /**
   * Main chat advisory entry point
   */
  async getAdvisory({ query, language = 'te', cropContext = null, farmerData = null }) {
    if (!query || typeof query !== 'string' || query.trim().length === 0) {
      throw new Error('Query is required for AI advisory');
    }

    const cleanQuery = query.trim();
    const lang = ['te', 'hi', 'en'].includes(language) ? language : 'te';

    // 1. If GEMINI_API_KEY is configured in backend/.env, call Gemini API
    if (process.env.GEMINI_API_KEY) {
      try {
        const geminiResponse = await this.callGeminiApi(cleanQuery, lang, cropContext, farmerData);
        if (geminiResponse) {
          return {
            success: true,
            provider: 'Gemini-Flash-AI',
            language: lang,
            query: cleanQuery,
            response: geminiResponse,
            timestamp: new Date().toISOString()
          };
        }
      } catch (err) {
        console.warn(`[AI Advisory] Gemini API request failed: ${err.message}. Falling back to agronomy expert engine.`);
      }
    }

    // 2. Comprehensive Agronomy Expert Engine
    const localizedResponse = this.generateAgronomyResponse(cleanQuery, lang, cropContext, farmerData);
    return {
      success: true,
      provider: 'AGRIHUB-Agronomy-AI',
      language: lang,
      query: cleanQuery,
      response: localizedResponse,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Calls Google Gemini REST API
   */
  async callGeminiApi(query, language, cropContext, farmerData) {
    const apiKey = process.env.GEMINI_API_KEY;
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const langPrompt = {
      te: 'Respond fluently in clear, polite Telugu (తెలుగు) with English technical terms in parentheses for pesticide/fertilizer chemical names.',
      hi: 'Respond fluently in respectful, clear Hindi (हिन्दी) with chemical names in English.',
      en: 'Respond in clear, encouraging English tailored for an Indian farmer.'
    }[language] || 'Respond in clear Telugu and English.';

    const systemPrompt = `You are "Krishi AI" (అగ్రి AI / कृषी AI), an expert Indian agronomist assistant at AGRIHUB.
You advise small and marginal farmers on crop protection, organic & chemical treatments, exact dosages, fertilizer ratios, market selling vs cold storage timing, and mandi trends.
${langPrompt}
Formatting:
- Use bullet points, bold key chemicals/dosages, and highlight safety precautions.
- Always include both Organic/Bio options and Chemical options where applicable.
- Conclude with a warm, encouraging note for the farmer.`;

    const userMessage = `Farmer Query: "${query}"
${cropContext ? `Crop Context: ${cropContext}` : ''}
${farmerData?.district ? `Farmer Location: ${farmerData.district}, ${farmerData.state || 'Andhra Pradesh'}` : 'Location: Andhra Pradesh / South India'}
Provide practical, direct advice with exact spray dosage per liter of water.`;

    const payload = {
      contents: [
        {
          role: 'user',
          parts: [{ text: `${systemPrompt}\n\n${userMessage}` }]
        }
      ],
      generationConfig: {
        temperature: 0.3,
        maxOutputTokens: 800
      }
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await response.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    return text || null;
  }

  /**
   * Agricultural agronomy knowledge engine with rich Telugu, Hindi, and English responses
   */
  generateAgronomyResponse(query, lang, cropContext, farmerData) {
    const qLower = query.toLowerCase().trim();
    const cleanWords = qLower.replace(/[.,?!;:()[\]{}]/g, '').split(/\s+/).filter(Boolean);

    // Identify Crop
    const isTomato = qLower.includes('tomato') || qLower.includes('tomatoes') || qLower.includes('టమోటా') || qLower.includes('టమాట') || qLower.includes('टमाटर') || cropContext === 'Tomato';
    const isChilli = qLower.includes('chilli') || qLower.includes('chillies') || qLower.includes('mirchi') || qLower.includes('మిరప') || qLower.includes('మిర్చి') || qLower.includes('मिर्च') || cropContext === 'Chilli';
    const isRice = qLower.includes('rice') || qLower.includes('paddy') || qLower.includes('వరి') || qLower.includes('ధాన్యం') || qLower.includes('धान') || qLower.includes('चावल') || cropContext === 'Rice';
    const isCotton = qLower.includes('cotton') || qLower.includes('ప్రత్తి') || qLower.includes('పత్తి') || qLower.includes('కપાસ') || qLower.includes('कपास') || cropContext === 'Cotton';
    const isMaize = qLower.includes('maize') || qLower.includes('corn') || qLower.includes('మొక్కజొన్న') || qLower.includes('మక్క') || qLower.includes('मक्का') || cropContext === 'Maize';
    const isGroundnut = qLower.includes('groundnut') || qLower.includes('peanut') || qLower.includes('వేరుశనగ') || qLower.includes('వేరుసెనగ') || qLower.includes('मूंगफली') || cropContext === 'Groundnut';

    // Topic Flags
    const isLeafCurl = qLower.includes('curl') || qLower.includes('thrip') || qLower.includes('mite') || qLower.includes('నల్లి') || qLower.includes('ముడుత') || qLower.includes('బొబ్బర') || qLower.includes('మొగ్గ') || qLower.includes('मरोड़िया') || qLower.includes('सफेद मक्खी') || qLower.includes('whitefly');
    const isBlight = qLower.includes('blight') || qLower.includes('spot') || qLower.includes('rot') || qLower.includes('మాడ') || qLower.includes('తెగులు') || qLower.includes('మచ్చ') || qLower.includes('కుళ్లు') || qLower.includes('झुलसा') || qLower.includes('धब्बा');
    const isPest = qLower.includes('pest') || qLower.includes('worm') || qLower.includes('borer') || qLower.includes('bug') || qLower.includes('పురుగు') || qLower.includes('కీటకం') || qLower.includes('దోమ') || qLower.includes('कीट') || qLower.includes('इल्ली');
    const isMarket = qLower.includes('market') || qLower.includes('price') || qLower.includes('sell') || qLower.includes('rate') || qLower.includes('cost') || qLower.includes('ధర') || qLower.includes('మండి') || qLower.includes('భావం') || qLower.includes('storage') || qLower.includes('దాచుకో') || qLower.includes('కోల్డ్') || qLower.includes('भाव') || qLower.includes('मंडी') || qLower.includes('बिक्री');
    const isFertilizer = qLower.includes('fertilizer') || qLower.includes('urea') || qLower.includes('dap') || qLower.includes('potash') || qLower.includes('npk') || qLower.includes('micronutrient') || qLower.includes('zinc') || qLower.includes('ఎరువు') || qLower.includes('యూరియా') || qLower.includes('ఖాద్') || qLower.includes('खाद') || qLower.includes('उर्वरक');

    // Check if query is a single keyword or pure crop name query (e.g. "tomatoes", "tomato", "టమోటా", "टमाटर")
    const isPureCropQuery = cleanWords.length <= 2 && (isTomato || isChilli || isRice || isCotton || isMaize || isGroundnut) && !isLeafCurl && !isBlight && !isPest && !isMarket && !isFertilizer;

    // ==========================================
    // 1. PURE CROP 360° INTELLIGENCE DOSSIER
    // ==========================================
    if (isPureCropQuery || (isTomato && cleanWords.length === 1)) {
      if (isTomato) {
        if (lang === 'te') {
          return `🍅 **టమోటా పంట 360° సమగ్ర AI వ్యవసాయ నివేదిక (Tomato Crop Intelligence Dossier):**

1. ⚠️ **ప్రస్తుత సీజన్ తెగుళ్ల హెచ్చరిక & తక్షణ రసాయన నివారణ:**
   - **ముందస్తు మాడ తెగులు (Early Blight):** ఆకులపై ఉంగరాల నల్లటి మచ్చలు.
     👉 *స్ప్రే:* మాంకోజెబ్ 75% WP @ 2.5 గ్రా/లీ లేదా కాపర్ ఆక్సిక్లోరైడ్ 50% WP @ 3 గ్రా/లీ.
   - **ఆకుముడుత తెగులు (Tomato Leaf Curl / తెల్లదోమ):** ఆకులు పైకి ముడుచుకుపోవడం, ఎదుగుదల లోపించడం.
     👉 *స్ప్రే:* పసుపు జిగురు అట్టలు (15-20/ఎకరా) + ఇమిడాక్లోప్రిడ్ 17.8% SL @ 0.5 మి.లీ/లీ లేదా వేపనూనె 10,000 ppm @ 3 మి.లీ/లీ.
   - **కాయ తొలుచు పురుగు (Fruit Borer):** కాయలకు రంధ్రాలు చేయడం.
     👉 *స్ప్రే:* క్లోరాంట్రానిలిప్రోల్ 18.5% SC (Coragen) @ 0.3 మి.లీ/లీ లేదా ఇమామెక్టిన్ బెంజోయేట్ 5% SG @ 4 గ్రా/15 లీటర్ల పంప్.

2. 🧪 **ఎకరాకు సమతుల్య ఎరువుల షెడ్యూల్ (NPK & పోషకాలు):**
   - **దుక్కిలో (Basal):** 25 బండ్ల పశువుల ఎరువు + 50 కేజీల DAP + 30 కేజీల పొటాష్ (MOP).
   - **పైపాటుగా (Top Dressing):** నాటిన 25, 45 రోజులకు యూరియా 20 కేజీలు + పొటాష్ 10 కేజీలు 2 విడతల్లో వేయండి.
   - **పూత & పిందె రాలకుండా:** 13-0-45 (పొటాషియం నైట్రేట్) 5 గ్రా/లీ + బోరాన్ 1 గ్రా/లీ పిచికారీ చేయండి.

3. 📈 **మండి ధరల విశ్లేషణ & విక్రయ సూచన (Market & Selling Timing):**
   - **ప్రస్తుత సూచిక ధర:** ₹1,400 - ₹2,350 / క్వింటాల్.
   - **అమ్మకపు వ్యూహం:** టమోటా త్వరగా పాడయ్యే పంట (Highly Perishable). ధర క్వింటాలుకు ₹1,700 కంటే ఎక్కువ ఉంటే నిల్వ చేయకుండా నేరుగా స్థానిక మార్కెట్ లేదా FPO ద్వారా అమ్మడం లాభదాయకం.

4. 💧 **నీటి యాజమాన్యం & స్ప్రే సమయం:**
   - బిందు సేద్యం ద్వారా 2-3 రోజులకు ఒకసారి తేమ ఉండేలా నీరు పెట్టండి.
   - మందుల పిచికారీ ఉదయం 7:00 - 9:30 మధ్య లేదా సాయంత్రం 4:30 తర్వాత మాత్రమే చేయాలి.

💡 **త్వరిత సమాధానం కోసం నొక్కండి:** "టమోటా ఆకుముడత నివారణ", "టమోటా మండి ధర", "టమోటా ఎరువుల మోతాదు"`;
        } else if (lang === 'hi') {
          return `🍅 **टमाटर फसल 360° संपूर्ण AI कृषि डोजियर (Tomato Crop Intelligence Dossier):**

1. ⚠️ **प्रमुख कीट एवं रोग रोकथाम (Key Diseases & Spray Dosages):**
   - **अगेती झुलसा (Early Blight):** पत्तियों पर गोल छल्लेदार गहरे काले धब्बे।
     👉 *दवा:* मैंकोजेब 75% WP @ 2.5 ग्राम/लीटर अथवा कॉपर ऑक्सीक्लोराइड 50% WP @ 3 ग्राम/लीटर।
   - **पत्ती मरोड़ रोग (Leaf Curl / सफेद मक्खी):** पत्तियां ऊपर की ओर मुड़ना, पौधा बौना होना।
     👉 *दवा:* पीले चिपचिपे कार्ड (15-20/एकड़) + इमिडाक्लोप्रिड 17.8% SL @ 0.5 मिली/लीटर अथवा नीम तेल 10,000 ppm @ 3 मिली/लीटर।
   - **फल छेदक कीट (Fruit Borer):** फलों में छेद कर गूदा खाना।
     👉 *दवा:* कोराजन (क्लोरेंट्रानिलिप्रोल 18.5% SC) @ 0.3 मिली/लीटर या इमामेक्टिन बेंजोएट 5% SG @ 4 ग्राम/15 लीटर पंप।

2. 🧪 **प्रति एकड़ खाद एवं उर्वरक प्रबंधन:**
   - **रोपाई के समय (Basal):** 5-8 टन सड़ी गोबर खाद + 50 किग्रा DAP + 30 किग्रा पोटाश।
   - **टॉप ड्रेसिंग:** रोपाई के 25 और 50 दिनों बाद 20-20 किग्रा यूरिया और 10 किग्रा पोटाश दें।
   - **फूल व फल झड़ने से रोकने हेतु:** 13-0-45 @ 5 ग्राम + बोरॉन 1 ग्राम प्रति लीटर पानी में स्प्रे करें।

3. 📈 **मंडी भाव एवं बिक्री सलाह:**
   - **वर्तमान मंडी भाव:** ₹1,400 - ₹2,350 प्रति क्विंटल।
   - **रणनीति:** टमाटर शीघ्र खराब होने वाली फसल है। यदि भाव ₹1,700/क्विंटल से अधिक है तो बिना देरी किए सीधे स्थानीय मंडी या FPO को बेचें।

4. 💧 **सिंचाई एवं स्प्रे का सही समय:**
   - ड्रिप द्वारा 2-3 दिन में हल्की सिंचाई करें।
   - स्प्रे हमेशा सुबह 7-9 बजे या शाम 4 बजे के बाद करें।

💡 **त्वरित प्रश्न:** "टमाटर पत्ती मरोड़", "टमाटर खाद की मात्रा", "टमाटर का मंडी भाव"`;
        } else {
          return `🍅 **Tomato 360° Comprehensive AI Crop Intelligence Dossier:**

1. ⚠️ **Top Disease & Pest Alerts & Exact Chemical Sprays:**
   - **Early Blight (Alternaria solani):** Concentric dark target spots on older leaves.
     👉 *Spray:* Mancozeb 75% WP @ 2.5g/L OR Copper Oxychloride 50% WP @ 3g/L.
   - **Tomato Leaf Curl Virus (Whitefly vector):** Upward curling, stunted bushy growth.
     👉 *Spray:* Yellow sticky traps (15-20/acre) + Imidacloprid 17.8% SL @ 0.5ml/L OR Neem Oil 10,000 ppm @ 3ml/L.
   - **Fruit Borer (Helicoverpa armigera):** Circular bore holes in ripening tomatoes.
     👉 *Spray:* Chlorantraniliprole 18.5% SC (Coragen) @ 0.3ml/L OR Emamectin Benzoate 5% SG @ 4g/15L pump.

2. 🧪 **Fertilizer & Nutrition Schedule (per Acre):**
   - **Basal Dose:** 25 cartloads well-rotted FYM + 50kg DAP + 30kg Muriate of Potash (MOP).
   - **Top Dressing:** Split Urea into 2 doses (20kg at 25 days, 20kg at 50 days) + 10kg Potash.
   - **Blossom Drop & Fruit Setting:** Foliar spray 13-0-45 (Potassium Nitrate) @ 5g/L + Boron 20% @ 1g/L.

3. 📈 **Mandi Price Forecast & Selling vs Storage Timing:**
   - **Indicative Price Range:** ₹1,400 - ₹2,350 / Quintal.
   - **Action Strategy:** Tomato is highly perishable. If local mandi rate is above ₹1,700/Qtl, sell immediately to avoid transit damage and storage rot.

4. 💧 **Irrigation & Spray Window:**
   - Irrigate every 2-3 days via drip directly to the root zone; keep foliage dry.
   - Spray fungicides between 7:00 AM - 9:30 AM or after 4:30 PM.

💡 **Quick Follow-ups:** "Tomato leaf curl cure", "Tomato fertilizer dosage", "Tomato mandi prices"`;
        }
      }

      if (isChilli) {
        if (lang === 'te') {
          return `🌶️ **మిరప పంట 360° సమగ్ర AI వ్యవసాయ నివేదిక (Chilli Crop Intelligence Dossier):**

1. ⚠️ **మిరపలో ముఖ్యమైన తెగుళ్లు & నివారణ మందుల మోతాదు:**
   - **తామర పురుగులు (Thrips - పై ముడుత):** ఆకులు పైకి దోనెలా ముడుచుకుపోవడం.
     👉 *స్ప్రే:* ఫిప్రోనిల్ 5% SC @ 2 మి.లీ/లీ లేదా స్పైనిటోరమ్ 11.7% SC @ 1 మి.లీ/లీ.
   - **తెల్ల నల్లి (Mites - కింది ముడుత):** ఆకులు కిందికి ముడుచుకుపోయి వెనుకభాగం ముదురు కాంస్య రంగులోకి మారడం.
     👉 *స్ప్రే:* స్పైరోమెసిఫెన్ 22.9% SC (Oberon) @ 1 మి.లీ/లీ లేదా ప్రొపర్గైట్ 57% EC @ 2 మి.లీ/లీ.
   - **కొమ్మ ఎండు మరియు కాయ కుళ్లు (Die-back & Anthracnose):** కొమ్మలు పైనుండి కిందికి ఎండటం, పండ్లపై గుండ్రని మచ్చలు.
     👉 *స్ప్రే:* అజోక్సిస్ట్రోబిన్ + డైఫెనోకోనజోల్ (Amistar Top) @ 1 మి.లీ/లీ లేదా కాపర్ హైడ్రాక్సైడ్ @ 2 గ్రా/లీ.

2. 🧪 **ఎకరాకు ఎరువుల యాజమాన్యం:**
   - ఎకరాకు 60 కేజీల నత్రజని, 40 కేజీల భాస్వరం, 50 కేజీల పొటాష్.
   - అధిక నత్రజని (యూరియా) వాడకండి, ఇది రసం పీల్చే పురుగుల ఉధృతిని పెంచుతుంది.

3. 📈 **మార్కెట్ & కోల్డ్ స్టోరేజ్ విశ్లేషణ:**
   - ఎండు మిరపను వెంటనే అమ్మకుండా కోల్డ్ స్టోరేజ్‌లో 3-5 నెలలు నిల్వ చేస్తే క్వింటాలుకు ₹2,500 నుండి ₹4,500 వరకు అదనపు లాభం పొందే అవకాశం ఉంది.`;
        } else if (lang === 'hi') {
          return `🌶️ **मिर्च फसल 360° संपूर्ण AI कृषि रिपोर्ट (Chilli Intelligence Dossier):**

1. ⚠️ **प्रमुख कीट एवं रोग नियंत्रण (Key Diseases & Dosages):**
   - **थ्रिप्स (ऊपरी मरोड़):** पत्तियां ऊपर की ओर नाव जैसी मुड़ना।
     👉 *दवा:* फिप्रोनिल 5% SC @ 2 मिली/लीटर अथवा स्पिनेटोरम 11.7% SC @ 1 मिली/लीटर।
   - **माइट्स / जुएं (निचली मरोड़):** पत्तियां नीचे की ओर मुड़ना।
     👉 *दवा:* स्पाइरोमेसिफेन 22.9% SC (ओबेरॉन) @ 1 मिली/लीटर।
   - **फल सड़न व डाई-बैक (Anthracnose):** शाखाओं का ऊपर से सूखना।
     👉 *दवा:* एमिस्टार टॉप @ 1 मिली/लीटर अथवा प्रोपिकोनाजोल 25% EC @ 1 मिली/लीटर।

2. 🧪 **उर्वरक एवं पोषण:**
   - प्रति एकड़ 60 किग्रा नाइट्रोजन, 40 किग्रा फास्फोरस, 50 किग्रा पोटाश। अधिक यूरिया का प्रयोग न करें।

3. 📈 **मंडी एवं कोल्ड स्टोरेज:**
   - सूखी मिर्च को कोल्ड स्टोरेज में 3-5 महीने रखने पर ₹2,500 - ₹4,000/क्विंटल तक अतिरिक्त लाभ मिल सकता है।`;
        } else {
          return `🌶️ **Chilli 360° Comprehensive AI Crop Intelligence Dossier:**

1. ⚠️ **Top Disease & Pest Controls:**
   - **Thrips (Upward Curling):** Fipronil 5% SC @ 2ml/L OR Spinetoram 11.7% SC @ 1ml/L.
   - **Mites (Downward Curling):** Spiromesifen 22.9% SC @ 1ml/L OR Propargite 57% EC @ 2ml/L.
   - **Die-back & Anthracnose Fruit Rot:** Azoxystrobin + Difenoconazole @ 1ml/L OR Copper Hydroxide @ 2g/L.

2. 🧪 **Fertilizer Guidance:**
   - 60kg N, 40kg P2O5, 50kg K2O per acre. Avoid excessive Urea which invites sucking pests.

3. 📈 **Market & Storage Strategy:**
   - Dry chilli has high cold-storage suitability. Storing for 3-5 months typically yields ₹2,500 - ₹4,500/Qtl premium during off-season.`;
        }
      }

      if (isRice) {
        if (lang === 'te') {
          return `🌾 **వరి పంట 360° సమగ్ర AI వ్యవసాయ నివేదిక (Paddy Crop Intelligence Dossier):**

1. ⚠️ **ముఖ్యమైన తెగుళ్లు & నివారణ చర్యలు:**
   - **అగ్గి తెగులు (Blast):** ఆకులు మరియు మెడపై కండె ఆకారపు మచ్చలు.
     👉 *స్ప్రే:* ట్రైసైక్లాజోల్ 75% WP @ 0.6 గ్రా/లీ లేదా ఐసోప్రోథియోలేన్ 40% EC @ 1.5 మి.లీ/లీ.
   - **సుడి దోమ (BPH):** దుబ్బుల మొదళ్ల వద్ద రసం పీల్చి మొక్కలు ఎండిపోవడం.
     👉 *స్ప్రే:* పైనోట్రోజైన్ 50% WDG @ 0.6 గ్రా/లీ లేదా డైనోటెఫురాన్ 20% SG @ 0.4 గ్రా/లీ మొక్కల మొదళ్లపై పడేలా పిచికారీ చేయండి.
   - **కాండం తొలుచు పురుగు (Stem Borer):** తెల్ల కంకులు ఏర్పడటం.
     👉 *నివారణ:* కార్టాప్ హైడ్రోక్లోరైడ్ 4G గుళికలు ఎకరాకు 10 కేజీలు చల్లండి.

2. 🧪 **ఎరువుల సమతుల్యత:**
   - ఎకరాకు నత్రజని 40 కేజీలు, భాస్వరం 24 కేజీలు, పొటాష్ 20 కేజీలు. భాస్వరం మొత్తాన్ని ఆఖరి దుక్కిలో వేయాలి; నత్రజని మరియు పొటాష్‌ను 3 విడతల్లో వేయాలి.`;
        } else if (lang === 'hi') {
          return `🌾 **धान (चावल) फसल 360° संपूर्ण AI कृषि रिपोर्ट (Paddy Intelligence Dossier):**

1. ⚠️ **प्रमुख रोग एवं कीट प्रबंधन:**
   - **ब्लास्ट / झोंका रोग:** पत्तियों और बाली के गर्दन पर आँख के आकार के धब्बे।
     👉 *दवा:* ट्राइसाइक्लाजोल 75% WP @ 0.6 ग्राम/लीटर अथवा आइसोप्रोथियोलेन 40% EC @ 1.5 मिली/लीटर।
   - **भूरा फुदका (BPH):** पौधों के आधार पर रस चूसना।
     👉 *दवा:* पाइमेट्रोजिन 50% WDG @ 0.6 ग्राम/लीटर अथवा डाइनोटेफ्यूरॉन 20% SG @ 0.4 ग्राम/लीटर।
   - **तना छेदक कीट:** सफेद बालियां बनना।
     👉 *दवा:* कारटाप हाइड्रोक्लोराइड 4G @ 10 किग्रा/एकड़।

2. 🧪 **खाद प्रबंधन:**
   - नत्रजन 40 किग्रा, फास्फोरस 24 किग्रा, पोटाश 20 किग्रा प्रति एकड़ 3 चरणों में दें।`;
        } else {
          return `🌾 **Paddy (Rice) 360° Comprehensive AI Crop Intelligence Dossier:**

1. ⚠️ **Top Diseases & Scientific Cures:**
   - **Blast (Pyricularia oryzae):** Spindle-shaped lesions on leaves/neck. Spray Tricyclazole 75% WP @ 0.6g/L.
   - **Brown Plant Hopper (BPH):** Hopper burn at plant base. Spray Pymetrozine 50% WDG @ 0.6g/L or Dinotefuran 20% SG @ 0.4g/L.
   - **Stem Borer:** Dead hearts & white ears. Apply Cartap Hydrochloride 4G granules @ 10kg/acre.

2. 🧪 **Nutrient Schedule:**
   - N:P:K @ 40:24:20 kg/acre. Apply full P as basal, split N and K into 3 equal splits.`;
        }
      }

      if (isCotton) {
        if (lang === 'te') {
          return `☁️ **ప్రత్తి (పత్తి) పంట 360° సమగ్ర AI వ్యవసాయ నివేదిక (Cotton Intelligence Dossier):**

1. ⚠️ **గులాబీ రంగు కాయ తొలుచు పురుగు (Pink Bollworm) & రసం పీల్చే పురుగులు:**
   - రోజెట్ పువ్వులు, కాయలకు రంధ్రాలు నివారించడానికి ఎకరాకు 8-10 లింగాకర్షక బుట్టలు (Pheromone traps) అమర్చండి.
   - *స్ప్రే:* క్లోరాంట్రానిలిప్రోల్ 18.5% SC @ 0.3 మి.లీ/లీ లేదా ప్రొఫెనోఫాస్ 50% EC @ 2 మి.లీ/లీ.
   - *రసం పీల్చే పురుగులకు (దోమ, పేనుబంక):* ఫ్లోనికామిడ్ 50% WG @ 0.3 గ్రా/లీ.

2. 🧪 **పోషకాల సలహా:**
   - మెగ్నీషియం లోపం రాకుండా 45 మరియు 65 రోజులకు మెగ్నీషియం సల్ఫేట్ (10 గ్రా/లీ) పిచికారీ చేయండి.`;
        } else if (lang === 'hi') {
          return `☁️ **कपास फसल 360° संपूर्ण AI कृषि रिपोर्ट (Cotton Intelligence Dossier):**

1. ⚠️ **गुलाबी सुंडी (Pink Bollworm) एवं कीट नियंत्रण:**
   - प्रति एकड़ 8-10 फेरोमोन ट्रैप लगाएं।
   - *दवा:* क्लोरेंट्रानिलिप्रोल 18.5% SC @ 0.3 मिली/लीटर या प्रोफेनोफॉस 50% EC @ 2 मिली/लीटर।
   - *रस चूसक कीट:* फ्लोनिकामिड 50% WG @ 0.3 ग्राम/लीटर।

2. 🧪 **पोषण सलाह:** मैग्नीशियम सल्फेट @ 10 ग्राम/लीटर का पर्णीय छिड़काव करें।`;
        } else {
          return `☁️ **Cotton 360° Comprehensive AI Crop Intelligence Dossier:**

1. ⚠️ **Pink Bollworm & Sucking Pest Management:**
   - Install 8-10 Pheromone traps per acre.
   - Spray Chlorantraniliprole 18.5% SC @ 0.3ml/L OR Profenofos 50% EC @ 2ml/L.
   - For sucking pests: Flonicamid 50% WG @ 0.3g/L.

2. 🧪 **Micronutrients:** Spray Magnesium Sulphate @ 10g/L at 45 & 65 days to prevent leaf reddening.`;
        }
      }
    }

    // ==========================================
    // 2. SPECIFIC TOPIC HANDLERS
    // ==========================================

    // Chilli with leaf curl / pests
    if (isChilli && (isLeafCurl || isPest || isBlight || qLower.includes('spray') || qLower.includes('cure'))) {
      if (lang === 'te') {
        return `🌿 **మిరపలో ఆకు ముడుత మరియు తామర పురుగుల (Thrips / Mites) సమగ్ర నివారణ:**

1. **సేంద్రీయ / సహజ పద్ధతులు:**
   - ఎకరాకు 15-20 నీలిరంగు (తామర పురుగుల కోసం) మరియు పసుపు రంగు (తెల్లదోమ కోసం) జిగురు అట్టలను అమర్చండి.
   - వేపనూనె (Neem Oil 10,000 ppm) 3 మి.లీ + అర టీస్పూన్ సర్ఫ్ పౌడర్ లీటరు నీటికి కలిపి సాయంత్రం వేళ పిచికారీ చేయండి.

2. **రసాయనిక మందుల మోతాదు (లీటరు నీటికి):**
   - **పై ముడుతకు (తామర పురుగులు / Thrips):** ఫిప్రోనిల్ 5% SC (Fipronil) @ 2 మి.లీ లేదా స్పైనిటోరమ్ 11.7% SC @ 1 మి.లీ.
   - **కింది ముడుతకు (నల్లి / Mites):** స్పైరోమెసిఫెన్ 22.9% SC (Oberon) @ 1 మి.లీ లేదా ప్రొపర్గైట్ 57% EC @ 2 మి.లీ.

3. **ముఖ్యమైన సూచన:**
   - అధిక మోతాదులో యూరియా వాడకండి, ఇది రసం పీల్చే పురుగులను ఆకర్షిస్తుంది. పొలం గట్లపై కలుపు మొక్కలను నివారించండి.`;
      } else if (lang === 'hi') {
        return `🌿 **मिर्च में पत्ती मरोड़ एवं थ्रिप्स (Leaf Curl & Thrips) का नियंत्रण:**

1. **जैविक प्रबंधन:**
   - प्रति एकड़ 15-20 नीले और पीले चिपचिपे कार्ड लगाएं।
   - नीम का तेल (10,000 ppm) 3 मिली प्रति लीटर पानी में मिलाकर छिड़काव करें।

2. **रासायनिक उपचार (प्रति लीटर पानी):**
   - **ऊपरी मरोड़ (थ्रिप्स):** फिप्रोनिल 5% SC @ 2 मिली या स्पिनेटोरम 11.7% SC @ 1 मिली।
   - **निचली मरोड़ (माइट्स):** स्पाइरोमेसिफेन 22.9% SC @ 1 मिली।

3. **सावधानी:** खेत में जरूरत से ज्यादा यूरिया का प्रयोग न करें।`;
      } else {
        return `🌿 **Chilli Leaf Curl & Thrips / Mites Integrated Management:**

1. **Bio & Organic Measures:**
   - Install 15-20 Blue sticky traps (for Thrips) and Yellow sticky traps (for Whiteflies) per acre.
   - Spray Neem Oil 10,000 ppm @ 3ml/L water mixed with a pinch of detergent in the evening.

2. **Recommended Chemical Sprays (per liter of water):**
   - **Upward Curling (Thrips):** Fipronil 5% SC @ 2ml/L OR Spinetoram 11.7% SC @ 1ml/L.
   - **Downward Curling (Mites):** Spiromesifen 22.9% SC @ 1ml/L OR Propargite 57% EC @ 2ml/L.

3. **Key Farmer Advisory:**
   - Avoid excessive Urea application as tender succulent leaves attract sap-sucking pests. Maintain clean field borders.`;
      }
    }

    // Tomato with blight or spots
    if (isTomato && (isBlight || qLower.includes('leaf') || qLower.includes('yellow') || qLower.includes('ఆకు') || qLower.includes('మచ్చ'))) {
      if (lang === 'te') {
        return `🍅 **టమోటాలో ముందస్తు మాడ తెగులు (Early Blight / ఆకుమచ్చల) నివారణ చర్యలు:**

1. **లక్షణాలు:**
   - ముదురు ఆకులపై ఉంగరాల వంటి గుండ్రటి నల్లటి మచ్చలు ఏర్పడి క్రమంగా పసుపు రంగులోకి మారి ఎండిపోతాయి.

2. **తక్షణ సేంద్రీయ చర్యలు:**
   - నేలకు తగిలే కింద ఆకులను కత్తిరించి తీసేయండి (Pruning).
   - ట్రైకోడెర్మా విరిడే (Trichoderma viride) 5 గ్రాములు లీటరు నీటికి కలిపి పిచికారీ చేయండి.

3. **రసాయనిక మందుల మోతాదు (లీటరు నీటికి):**
   - మాంకోజెబ్ 75% WP (Mancozeb) @ 2.5 గ్రాములు లేదా కాపర్ ఆక్సిక్లోరైడ్ 50% WP (COC) @ 3 గ్రాములు.
   - తెగులు ఉధృతి ఎక్కువగా ఉంటే: అజోక్సిస్ట్రోబిన్ + డైఫెనోకోనజోల్ (Amistar Top) @ 1 మి.లీ లీటరు నీటికి కలిపి పిచికారీ చేయండి.

4. **పంట సంరక్షణ సూచన:**
   - మొక్కల మొదళ్ల వద్ద మాత్రమే నీరు పెట్టండి, ఆకులపై నీరు పడకుండా చూసుకోండి.`;
      } else if (lang === 'hi') {
        return `🍅 **टमाटर में अगेती झुलसा एवं पत्ती धब्बा रोग प्रबंधन:**

1. **लक्षण:**
   - निचली पत्तियों पर गोल छल्लेदार गहरे काले धब्बे, जो धीरे-धीरे पूरे पत्ते को सुखा देते हैं।

2. **जैविक उपाय:**
   - रोगग्रस्त निचली पत्तियों को काटकर खेत से बाहर नष्ट करें।
   - ट्राइकोडर्मा विरिडी 5 ग्राम/लीटर का स्प्रे करें।

3. **रासायनिक उपचार (प्रति लीटर पानी):**
   - मैंकोजेब 75% WP @ 2.5 ग्राम अथवा कॉपर ऑक्सीक्लोराइड 50% WP @ 3 ग्राम।
   - तीव्र प्रकोप में: एमिस्टार टॉप (Azoxystrobin + Difenoconazole) @ 1 मिली प्रति लीटर।

4. **सिंचाई:** पौधों की पत्तियों पर पानी छिड़कने से बचें।`;
      } else {
        return `🍅 **Tomato Early Blight & Leaf Spot Management:**

1. **Immediate Actions:**
   - Prune and destroy infected lower leaves that touch the soil to stop fungal spores.
   - Apply Trichoderma viride @ 5g/L or 5% Neem Seed Kernel Extract (NSKE).

2. **Chemical Control (per liter of water):**
   - Mancozeb 75% WP @ 2.5g/L OR Copper Oxychloride 50% WP @ 3g/L.
   - For high disease pressure: Azoxystrobin + Difenoconazole @ 1ml/L.

3. **Irrigation Tip:**
   - Avoid overhead sprinklers; water directly at the plant root zone via drip or furrow to keep foliage dry.`;
      }
    }

    // Rice with Blast or BPH
    if (isRice) {
      if (lang === 'te') {
        return `🌾 **వరిలో అగ్గి తెగులు (Paddy Blast) మరియు సుడి దోమ (BPH) నివారణ:**

1. **అగ్గి తెగులు (Blast) నివారణ:**
   - ట్రైసైక్లాజోల్ 75% WP (Beam / Baan) @ 0.6 గ్రాములు లీటరు నీటికి కలిపి పిచికారీ చేయండి.
   - మబ్బులు పట్టిన సమయంలో యూరియాను ఎక్కువగా వేయకండి.

2. **సుడి దోమ (BPH) నివారణ:**
   - పొలంలో నిల్వ ఉన్న నీటిని 3-4 రోజుల పాటు బయటకు తీసి ఆరబెట్టండి (Alternate Wetting and Drying).
   - ప్రతి 2 మీటర్లకు బాటలు తీయడం (Alley formation) వల్ల గాలి, వెలుతురు సోకి దోమ ఉధృతి తగ్గుతుంది.
   - మందు: పైనోట్రోజైన్ 50% WDG @ 0.6 గ్రాములు లేదా డైనోటెఫురాన్ 20% SG @ 0.4 గ్రాములు మొక్కల మొదళ్లపై పడేలా పిచికారీ చేయండి.`;
      } else if (lang === 'hi') {
        return `🌾 **धान में ब्लास्ट रोग एवं भूरा फुदका (BPH) प्रबंधन:**

1. **ब्लास्ट (झोंका) रोग:**
   - ट्राइसाइक्लाजोल 75% WP @ 0.6 ग्राम/लीटर अथवा आइसोप्रोथियोलेन 40% EC @ 1.5 मिली/लीटर स्प्रे करें।
   - मौसम में नमी व बादल रहने पर यूरिया का अधिक प्रयोग न करें।

2. **भूरा फुदका (BPH):**
   - खेत से 3-4 दिन के लिए पानी निकाल दें ताकि पौधों की जड़ें सूखें।
   - पाइमेट्रोजिन 50% WDG @ 0.6 ग्राम/लीटर का छिड़काव सीधे तने के आधार पर करें।`;
      } else {
        return `🌾 **Paddy Blast & Brown Plant Hopper (BPH) Management:**

1. **Paddy Blast (Leaf & Neck Blast):**
   - Spray Tricyclazole 75% WP @ 0.6g/L OR Isoprothiolane 40% EC @ 1.5ml/L.
   - Suspend nitrogenous top-dressing during cloudy, high-humidity weather.

2. **Brown Plant Hopper (BPH):**
   - Practice Alternate Wetting & Drying (drain field for 3-4 days).
   - Create 30cm walking alleys every 2 meters for sunlight and ventilation.
   - Spray Pymetrozine 50% WDG @ 0.6g/L or Dinotefuran 20% SG @ 0.4g/L targeting plant base.`;
      }
    }

    // Market Prices, Selling vs Storage Advice
    if (isMarket) {
      if (lang === 'te') {
        return `📊 **అగ్రిహబ్ మార్కెట్ మరియు అమ్మకాల నిర్ణయ సలహా (Market & Storage Decision):**

1. **ఇప్పుడే అమ్మాలా లేక కోల్డ్ స్టోరేజ్‌లో దాచుకోవాలా?**
   - **టమోటా:** ఇది త్వరగా పాడయ్యే పంట (Highly Perishable). ధర క్వింటాలుకు ₹1,800 కంటే ఎక్కువ ఉంటే నేరుగా సమీప మండిలో లేదా FPO కి అమ్మడం లాభదాయకం.
   - **మిరప (ఎండుమిరప):** కోల్డ్ స్టోరేజ్‌లో 3-6 నెలలు భద్రపరిస్తే నాణ్యత తగ్గకుండా, పీక్ సీజన్ దాటాక క్వింటాలుకు ₹2,000 నుండి ₹4,000 అదనపు లాభం పొందవచ్చు.

2. **రవాణా & మధ్యవర్తులు:**
   - అగ్రిహబ్ యొక్క 'డెసిషన్ ఇంజిన్' (Farm-to-Market Engine) ఉపయోగించి నికర లాభం (Net Profit = Mandi Price - Transport - Commission) లెక్కించండి.
   - నేరుగా ధృవీకరించబడిన కొనుగోలుదారులు మరియు FPO లతో సంప్రదించి కమీషన్ దళారుల భారాన్ని తగ్గించుకోండి.`;
      } else if (lang === 'hi') {
        return `📊 **मंडी भाव एवं कोल्ड स्टोरेज निर्णय सलाह:**

1. **अभी बेचें या कोल्ड स्टोरेज में रखें?**
   - **टमाटर:** अत्यधिक संवेदनशील फसल। यदि मंडी भाव ₹1,800/क्विंटल से अधिक है, तो तुरंत बिक्री करना सबसे सुरक्षित है।
   - **मिर्च (सूखी मिर्च):** कोल्ड स्टोरेज में 3-5 महीने रखने से सीजन समाप्त होने पर ₹2,500 से ₹4,500/क्विंटल अतिरिक्त लाभ मिलता है।

2. **शुद्ध लाभ गणना:**
   - शुद्ध आय = (मंडी भाव × मात्रा) - (परिवहन + भंडारण किराया + मंडी शुल्क)।`;
      } else {
        return `📊 **AGRIHUB Market Selling vs. Cold Storage Advisory:**

1. **Perishable vs. Non-Perishable Timing:**
   - **Tomato & Green Vegetables:** High perishability. If current Mandi rate covers production costs + fair profit (e.g. >₹1,800/Qtl), sell immediately to minimize transit loss.
   - **Dry Chilli & Grain:** High storage suitability. Storing in certified cold storage for 3-5 months during harvest glut typically fetches ₹2,500 - ₹4,500 higher margin per quintal during lean season.

2. **Net Realization Formula:**
   - Always calculate: Net Profit = (Mandi Price × Quantity) - (Freight Logistics + Storage Rent + Mandi Cess).
   - Use our **Direct Market Access** tab to connect directly with FPOs and institutional buyers.`;
      }
    }

    // Fertilizer & Soil Advisory
    if (isFertilizer) {
      if (lang === 'te') {
        return `🌱 **సమతుల్య ఎరువుల యాజమాన్యం మరియు పోషకాల సలహా:**

1. **ప్రాథమిక మోతాదు (Basal Application):**
   - ఎకరాకు 5-8 టన్నుల బాగా చివికిన పశువుల ఎరువు + ట్రైకోడెర్మా 2 కేజీలు కలిపి దుక్కిలో వేయండి.
   - భాస్వరం (DAP / SSP) మరియు పొటాష్ (MOP) ఎరువులను విత్తే సమయంలోనే పూర్తిగా వేయాలి.

2. **నత్రజని (యూరియా) విడతల వారీగా:**
   - యూరియాను ఒకేసారి వేయకుండా 3 సమాన భాగాలుగా (మొలక దశ, పూత దశ, కాయ/గింజ దశ) విభజించి వేయండి.

3. **సూక్ష్మ పోషకాలు (Micronutrients):**
   - జింక్ లోపం రాకుండా ఉండటానికి ఎకరాకు 10-15 కేజీల జింక్ సల్ఫేట్ భూమిలో వేయండి లేదా పూతకు ముందు చిలేటెడ్ జింక్ (1 గ్రా/లీ) పిచికారీ చేయండి.`;
      } else if (lang === 'hi') {
        return `🌱 **संतुलित खाद एवं उर्वरक प्रबंधन सलाह:**

1. **बुवाई के समय (Basal):**
   - 5-8 टन सड़ी गोबर खाद + 2 किग्रा ट्राइकोडर्मा खेत में मिलाएं।
   - फास्फोरस (DAP/SSP) और पोटाश (MOP) की पूरी मात्रा बुवाई के समय ही दें।

2. **यूरिया का विभाजन:**
   - यूरिया को एक साथ न डालें, इसे 3 समान खुराकों (शुरुआती वृद्धि, फूल आते समय, और फल/दाना बनते समय) में विभाजित करें।

3. **सूक्ष्म पोषक तत्व:** जिंक की कमी दूर करने के लिए चिलेटेड जिंक @ 1 ग्राम/लीटर स्प्रे करें।`;
      } else {
        return `🌱 **Balanced Fertilizer & Nutrient Advisory:**

1. **Basal Application:**
   - Apply 5-8 tons of well-decomposed Farm Yard Manure (FYM) fortified with 2kg Trichoderma per acre during final plowing.
   - Apply all Phosphorus (DAP/SSP) and 50% Potash (MOP) at sowing time.

2. **Split Nitrogen Application:**
   - Split Urea into 3 equal doses (Vegetative, Flowering, and Fruit/Grain filling) rather than single heavy application.

3. **Micronutrient Correction:**
   - For leaf chlorosis and flower drop, spray Formula-4 Micronutrient mixture @ 2g/L at 30 and 60 days after sowing.`;
      }
    }

    // Default general welcome advisory
    if (lang === 'te') {
      return `🌾 **నమస్కారం! అగ్రిహబ్ AI కిసాన్ సలహాదారు మిమ్మల్ని స్వాగతిస్తోంది.**

మీరు క్రింది విషయాలపై నన్ను అడగవచ్చు:
- 🍅 **పంట తెగుళ్లు & నివారణ:** టమోటా, మిరప, వరి, ప్రత్తి మొదలైన పంటల్లో ఆకుముడుత, మచ్చల తెగులు, పురుగుల నివారణకు మందుల మోతాదు.
- 🧪 **సేంద్రీయ & రసాయన చిట్కాలు:** వేపనూనె, జీవామృతం లేదా సరైన రసాయన పురుగుమందుల మోతాదు.
- 📈 **మార్కెట్ & కోల్డ్ స్టోరేజ్:** ఎప్పుడు అమ్మితే ఎక్కువ లాభం వస్తుంది, నిల్వ చేసుకునే విధానం.
- 💧 **ఎరువుల షెడ్యూల్:** నత్రజని, భాస్వరం, పొటాష్ సరైన సమయంలో వేసే పద్ధతి.

దయచేసి మీ పంట పేరు (ఉదా: "టమోటా" లేదా "మిరప") మరియు సమస్యను అడగండి!`;
    } else if (lang === 'hi') {
      return `🌾 **नमस्ते! AGRIHUB AI किसान सलाहकार में आपका स्वागत है।**

आप हमसे इन विषयों पर सलाह ले सकते हैं:
- 🍅 **फसल रोग एवं कीट नियंत्रण:** टमाटर, मिर्च, धान, कपास आदि में लगने वाले रोगों का जैविक व रासायनिक समाधान।
- 📈 **मंडी भाव एवं कोल्ड स्टोरेज:** अपनी उपज को कब और कहाँ बेचना सबसे अधिक लाभदायक होगा।
- 🌱 **संतुलित खाद एवं उर्वरक:** यूरिया, डीएपी, पोटाश एवं सूक्ष्म पोषक तत्वों की सही मात्रा।

कृपया अपनी फसल (जैसे: "टमाटर" अथवा "मिर्च") और समस्या का विवरण लिखें!`;
    } else {
      return `🌾 **Welcome to AGRIHUB AI Krishi Advisor!**

I am your 24/7 smart farming agronomy expert. You can ask me about:
- 🍅 **Crop Health & Disease Cure:** Scientific treatment & exact dosages for Tomato, Chilli, Rice, Cotton, Maize, and Groundnut.
- 🧪 **Organic & Chemical Solutions:** Neem formulations, biocontrol agents, and certified fungicides/insecticides.
- 📊 **Market Timing & Storage:** Whether to store produce in cold storage or sell immediately at current mandi prices.
- 🌱 **Fertilizer & Nutrition Schedule:** Recommended N-P-K splits, drip fertigation, and micronutrient sprays.

Please type a crop keyword (e.g. "tomato" or "chilli") or ask your specific question!`;
    }
  }
}

module.exports = new AIAdvisoryService();
