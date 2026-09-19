import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { aiApi } from '../services/api';

export const AiAssistant = () => {
  const { currentLanguage } = useLanguage();

  const getGreeting = (lang) => {
    if (lang === 'te') {
      return '🌾 నమస్కారం! నేను మీ అగ్రిహబ్ AI కిసాన్ శాస్త్రవేత్తను (Krishi AI Advisor). పంట తెగుళ్లు, మందుల మోతాదు, పంపుల లెక్కలు, ఎరువుల సమయం లేదా మార్కెట్ ధరలపై ఏదైనా అడగండి లేదా కింద ఉన్న మైక్ నొక్కి మాట్లాడండి!';
    }
    if (lang === 'hi') {
      return '🌾 नमस्ते! मैं आपका AGRIHUB AI कृषि विशेषज्ञ (Krishi AI Advisor) हूँ। फसल रोग, सटीक स्प्रे खुराक, पंप मात्रा, जैविक उपचार अथवा मंडी भाव पर कुछ भी पूछें या माइक से बोलें!';
    }
    return '🌾 Welcome! I am your AGRIHUB Enterprise AI Krishi Advisor. Ask me anything about crop diseases, exact knapsack chemical/bio spray dosages, pump calculators, fertilizer schedules, or market timing!';
  };

  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'ai',
      text: getGreeting(currentLanguage),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const [inputQuery, setInputQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [topics, setTopics] = useState([]);
  const [selectedCrop, setSelectedCrop] = useState('');
  const [speakingMessageId, setSpeakingMessageId] = useState(null);
  const [isListening, setIsListening] = useState(false);
  const [showCalculator, setShowCalculator] = useState(false);

  // Dosage Calculator State
  const [calcAcreage, setCalcAcreage] = useState(1.0);
  const [calcTankCapacity, setCalcTankCapacity] = useState(16); // 16L knapsack default
  const [calcCategory, setCalcCategory] = useState('fungicide');

  const messagesEndRef = useRef(null);
  const speechRecognitionRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  // Update greeting when language changes if no active conversation
  useEffect(() => {
    setMessages((prev) => {
      if (prev.length === 1 && prev[0].sender === 'ai') {
        return [{
          id: 1,
          sender: 'ai',
          text: getGreeting(currentLanguage),
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }];
      }
      return prev;
    });
  }, [currentLanguage]);

  // Fetch recommended topics
  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const res = await aiApi.getTopics(currentLanguage);
        if (res.data?.success) {
          setTopics(res.data.data);
        }
      } catch (err) {
        console.warn('Could not fetch AI topics:', err);
      }
    };
    fetchTopics();
  }, [currentLanguage]);

  // Cleanup speech on unmount
  useEffect(() => {
    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      if (speechRecognitionRef.current) {
        speechRecognitionRef.current.stop();
      }
    };
  }, []);

  // Text-To-Speech (TTS) Voice playback
  const handleSpeak = (messageId, textToSpeak) => {
    if (!window.speechSynthesis) {
      alert('Speech synthesis is not supported in this browser.');
      return;
    }

    if (speakingMessageId === messageId) {
      window.speechSynthesis.cancel();
      setSpeakingMessageId(null);
      return;
    }

    window.speechSynthesis.cancel();

    // Clean markdown characters for smooth speech
    const cleanText = textToSpeak
      .replace(/[*#_`~]/g, '')
      .replace(/[⚠️💡🌾🤖🧪🌱💰📋]/g, ' ')
      .trim();

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 0.92;
    utterance.pitch = 1.0;

    // Set voice language code
    if (currentLanguage === 'te') {
      utterance.lang = 'te-IN';
    } else if (currentLanguage === 'hi') {
      utterance.lang = 'hi-IN';
    } else {
      utterance.lang = 'en-IN';
    }

    // Try finding matching voice
    const voices = window.speechSynthesis.getVoices();
    const matchedVoice = voices.find(v => v.lang && v.lang.startsWith(currentLanguage));
    if (matchedVoice) {
      utterance.voice = matchedVoice;
    }

    utterance.onend = () => {
      setSpeakingMessageId(null);
    };

    utterance.onerror = () => {
      setSpeakingMessageId(null);
    };

    setSpeakingMessageId(messageId);
    window.speechSynthesis.speak(utterance);
  };

  // Speech-To-Text (Voice input via microphone)
  const toggleListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert(
        currentLanguage === 'te'
          ? 'మీ బ్రౌజర్‌లో వాయిస్ రికగ్నిషన్ సపోర్ట్ లేదు. దయచేసి Chrome లేదా Edge బ్రౌజర్ ఉపయోగించండి.'
          : currentLanguage === 'hi'
          ? 'आपके ब्राउज़र में वॉइस टाइपिंग सपोर्ट नहीं है। कृपया Chrome अथवा Edge का प्रयोग करें।'
          : 'Speech recognition is not supported in this browser. Please use Chrome or Edge.'
      );
      return;
    }

    if (isListening) {
      if (speechRecognitionRef.current) {
        speechRecognitionRef.current.stop();
      }
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = currentLanguage === 'te' ? 'te-IN' : currentLanguage === 'hi' ? 'hi-IN' : 'en-IN';
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setInputQuery((prev) => (prev ? prev + ' ' + transcript : transcript));
        }
        setIsListening(false);
      };

      recognition.onerror = (err) => {
        console.warn('Speech recognition error:', err);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      speechRecognitionRef.current = recognition;
      recognition.start();
    } catch (e) {
      console.error('Failed to start speech recognition:', e);
      setIsListening(false);
    }
  };

  const handleSend = async (queryText) => {
    const q = queryText || inputQuery;
    if (!q || !q.trim() || loading) return;

    const userMessage = {
      id: Date.now(),
      sender: 'user',
      text: q.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputQuery('');
    setLoading(true);

    try {
      const res = await aiApi.chat({
        query: q.trim(),
        language: currentLanguage,
        cropContext: selectedCrop || null
      });

      if (res.data?.success) {
        const aiMessage = {
          id: Date.now() + 1,
          sender: 'ai',
          text: res.data.data.response,
          provider: res.data.data.provider || 'AGRIHUB Agronomy AI',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages((prev) => [...prev, aiMessage]);
      } else {
        throw new Error('Could not get response from AI advisor');
      }
    } catch (err) {
      console.error('AI chat error:', err);
      const errorMessage = {
        id: Date.now() + 1,
        sender: 'ai',
        isError: true,
        text: currentLanguage === 'te'
          ? '⚠️ క్షమించండి, ప్రస్తుతం AI సర్వర్ స్పందించడం లేదు. దయచేసి మళ్లీ ప్రయత్నించండి లేదా కిసాన్ కాల్ సెంటర్ 1800-180-1551 సంప్రదించండి.'
          : currentLanguage === 'hi'
          ? '⚠️ क्षमा करें, AI सर्वर से संपर्क नहीं हो पाया। कृपया पुनः प्रयास करें अथवा किसान कॉल सेंटर 1800-180-1551 पर संपर्क करें।'
          : '⚠️ Could not fetch response. Please ensure backend server is running or try asking again.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const clearChat = () => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setSpeakingMessageId(null);
    setMessages([
      {
        id: 1,
        sender: 'ai',
        text: currentLanguage === 'te'
          ? '🌾 చాట్ క్లియర్ చేయబడింది. మీ కొత్త ప్రశ్నను అడగండి!'
          : currentLanguage === 'hi'
          ? '🌾 चैट रीसेट हो गई है। अपना नया प्रश्न पूछें!'
          : '🌾 Chat cleared. Ask your new farming question!',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  // Calculations for Spray Dosage Engine
  const calculateDosage = () => {
    const totalWaterLitres = Math.round(calcAcreage * 200); // 200 Litres per acre standard
    const numberOfPumps = Math.ceil(totalWaterLitres / calcTankCapacity);

    let chemicalName = '';
    let dosePerLitre = '';
    let dosePerTank = '';
    let totalChemicalNeeded = '';
    let marketPacking = '';
    let safetyNotes = '';

    if (calcCategory === 'fungicide') {
      if (currentLanguage === 'te') {
        chemicalName = 'కాపర్ ఆక్సిక్లోరైడ్ 50 WP (Copper Oxychloride) లేదా మాంకోజెబ్ 75 WP';
        dosePerLitre = '3 గ్రాములు / 1 లీటరు నీటికి';
        dosePerTank = `${calcTankCapacity * 3} గ్రాములు (${calcTankCapacity}L ట్యాంక్‌కు)`;
        totalChemicalNeeded = `${Math.round(totalWaterLitres * 3)} గ్రాములు (${(totalWaterLitres * 3 / 1000).toFixed(2)} కేజీలు)`;
        marketPacking = `${Math.ceil((totalWaterLitres * 3) / 500)} x 500g ప్యాకెట్లు`;
        safetyNotes = 'ఉదయం 7-10 గంటల మధ్య లేదా సాయంత్రం 4 గంటల తర్వాత స్ప్రే చేయండి. మాస్క్, చేతి తొడుగులు తప్పనిసరి.';
      } else if (currentLanguage === 'hi') {
        chemicalName = 'कॉपर ऑक्सीक्लोराइड 50 WP (Copper Oxychloride) अथवा मैंकोजेब 75 WP';
        dosePerLitre = '3 ग्राम / 1 लीटर पानी';
        dosePerTank = `${calcTankCapacity * 3} ग्राम (${calcTankCapacity}L टैंक हेतु)`;
        totalChemicalNeeded = `${Math.round(totalWaterLitres * 3)} ग्राम (${(totalWaterLitres * 3 / 1000).toFixed(2)} किग्रा)`;
        marketPacking = `${Math.ceil((totalWaterLitres * 3) / 500)} x 500g पैकेट`;
        safetyNotes = 'सुबह 7-10 बजे या शाम 4 बजे के बाद ही छिड़काव करें। मास्क व दस्ताने पहनें। तेज धूप में न छिड़कें।';
      } else {
        chemicalName = 'Copper Oxychloride 50 WP or Mancozeb 75 WP (Broad-Spectrum Fungicide)';
        dosePerLitre = '3.0 grams / 1 Litre water';
        dosePerTank = `${calcTankCapacity * 3} grams (for ${calcTankCapacity}L Knapsack)`;
        totalChemicalNeeded = `${Math.round(totalWaterLitres * 3)} grams (${(totalWaterLitres * 3 / 1000).toFixed(2)} kg)`;
        marketPacking = `${Math.ceil((totalWaterLitres * 3) / 500)} x 500g pouches`;
        safetyNotes = 'Spray between 6:30 AM - 10:00 AM or after 4:30 PM. Wear protective mask and gloves.';
      }
    } else if (calcCategory === 'insecticide') {
      if (currentLanguage === 'te') {
        chemicalName = 'ఇమిడాక్లోప్రిడ్ 17.8 SL (తామర పురుగులు/దోమ నివారణకు)';
        dosePerLitre = '0.5 మి.లీ / 1 లీటరు నీటికి';
        dosePerTank = `${(calcTankCapacity * 0.5).toFixed(1)} మి.లీ (${calcTankCapacity}L ట్యాంక్‌కు)`;
        totalChemicalNeeded = `${Math.round(totalWaterLitres * 0.5)} మి.లీ`;
        marketPacking = `${Math.ceil((totalWaterLitres * 0.5) / 100)} x 100ml బాటిళ్లు`;
        safetyNotes = 'పూత దశలో తేనెటీగలకు హాని కలగకుండా సాయంత్రం వేళ మాత్రమే స్ప్రే చేయండి.';
      } else if (currentLanguage === 'hi') {
        chemicalName = 'इमिडाक्लोप्रिड 17.8 SL (रस चूसक कीट, थ्रिप्स व माहू नियंत्रण)';
        dosePerLitre = '0.5 मिली / 1 लीटर पानी';
        dosePerTank = `${(calcTankCapacity * 0.5).toFixed(1)} मिली (${calcTankCapacity}L टैंक हेतु)`;
        totalChemicalNeeded = `${Math.round(totalWaterLitres * 0.5)} मिली`;
        marketPacking = `${Math.ceil((totalWaterLitres * 0.5) / 100)} x 100ml बोतल`;
        safetyNotes = 'मधुमक्खियों की सुरक्षा हेतु फूल खिलने की अवस्था में केवल शाम के समय छिड़काव करें।';
      } else {
        chemicalName = 'Imidacloprid 17.8 SL (Systemic Insecticide for Thrips & Sucking Pests)';
        dosePerLitre = '0.5 ml / 1 Litre water';
        dosePerTank = `${(calcTankCapacity * 0.5).toFixed(1)} ml (for ${calcTankCapacity}L Knapsack)`;
        totalChemicalNeeded = `${Math.round(totalWaterLitres * 0.5)} ml`;
        marketPacking = `${Math.ceil((totalWaterLitres * 0.5) / 100)} x 100ml bottles`;
        safetyNotes = 'Avoid spraying during active bee foraging hours. Spray in late evening.';
      }
    } else if (calcCategory === 'nutrition') {
      if (currentLanguage === 'te') {
        chemicalName = '19:19:19 NPK నీటిలో కరిగే ఎరువు + సూక్ష్మపోషకాలు (Foliar Nutrition)';
        dosePerLitre = '5 గ్రాములు / 1 లీటరు నీటికి';
        dosePerTank = `${calcTankCapacity * 5} గ్రాములు (${calcTankCapacity}L ట్యాంక్‌కు)`;
        totalChemicalNeeded = `${Math.round(totalWaterLitres * 5)} గ్రాములు (${(totalWaterLitres * 5 / 1000).toFixed(2)} కేజీలు)`;
        marketPacking = `${Math.ceil((totalWaterLitres * 5) / 1000)} x 1kg ప్యాకెట్లు`;
        safetyNotes = 'మొక్కల ఏపుగా పెరగడానికి మరియు కాయల పరిమాణం పెరగడానికి ఉత్తమం.';
      } else if (currentLanguage === 'hi') {
        chemicalName = '19:19:19 घुलनशील NPK खाद + सूक्ष्म पोषक तत्व';
        dosePerLitre = '5 ग्राम / 1 लीटर पानी';
        dosePerTank = `${calcTankCapacity * 5} ग्राम (${calcTankCapacity}L टैंक हेतु)`;
        totalChemicalNeeded = `${Math.round(totalWaterLitres * 5)} ग्राम (${(totalWaterLitres * 5 / 1000).toFixed(2)} किग्रा)`;
        marketPacking = `${Math.ceil((totalWaterLitres * 5) / 1000)} x 1kg पैकेट`;
        safetyNotes = 'फसल की वानस्पतिक बढ़वार तथा फल चमक बढ़ाने हेतु सर्वोत्तम।';
      } else {
        chemicalName = '19:19:19 Soluble NPK Foliar Nutrition + Micronutrients';
        dosePerLitre = '5.0 grams / 1 Litre water';
        dosePerTank = `${calcTankCapacity * 5} grams (for ${calcTankCapacity}L Knapsack)`;
        totalChemicalNeeded = `${Math.round(totalWaterLitres * 5)} grams (${(totalWaterLitres * 5 / 1000).toFixed(2)} kg)`;
        marketPacking = `${Math.ceil((totalWaterLitres * 5) / 1000)} x 1kg packs`;
        safetyNotes = 'Boosts plant vigor, flowering intensity and fruit size.';
      }
    } else {
      // Bio Neem
      if (currentLanguage === 'te') {
        chemicalName = 'వేప నూనె (Neem Oil 10,000 ppm) + సబ్బు ద్రావణం';
        dosePerLitre = '3 మి.లీ / 1 లీటరు నీటికి';
        dosePerTank = `${calcTankCapacity * 3} మి.లీ (${calcTankCapacity}L ట్యాంక్‌కు)`;
        totalChemicalNeeded = `${Math.round(totalWaterLitres * 3)} మి.లీ (${(totalWaterLitres * 3 / 1000).toFixed(2)} లీటర్లు)`;
        marketPacking = `${Math.ceil((totalWaterLitres * 3) / 500)} x 500ml బాటిళ్లు`;
        safetyNotes = '100% సేంద్రీయం. మిత్ర పురుగులకు ఎటువంటి హాని కలగదు. ప్రతి 10 రోజులకు పునరావృతం చేయవచ్చు.';
      } else if (currentLanguage === 'hi') {
        chemicalName = 'नीम तेल (Neem Oil 10,000 ppm) + साबुन घोल';
        dosePerLitre = '3 मिली / 1 लीटर पानी';
        dosePerTank = `${calcTankCapacity * 3} मिली (${calcTankCapacity}L टैंक हेतु)`;
        totalChemicalNeeded = `${Math.round(totalWaterLitres * 3)} मिली (${(totalWaterLitres * 3 / 1000).toFixed(2)} लीटर)`;
        marketPacking = `${Math.ceil((totalWaterLitres * 3) / 500)} x 500ml बोतल`;
        safetyNotes = '100% जैविक समाधान। मित्र कीटों के लिए पूरी तरह सुरक्षित। हर 10 दिन में दोहराएं।';
      } else {
        chemicalName = 'Pure Cold-Pressed Neem Oil (10,000 ppm) + Emulsifier';
        dosePerLitre = '3.0 ml / 1 Litre water';
        dosePerTank = `${calcTankCapacity * 3} ml (for ${calcTankCapacity}L Knapsack)`;
        totalChemicalNeeded = `${Math.round(totalWaterLitres * 3)} ml (${(totalWaterLitres * 3 / 1000).toFixed(2)} Litres)`;
        marketPacking = `${Math.ceil((totalWaterLitres * 3) / 500)} x 500ml bottles`;
        safetyNotes = '100% Bio-safe organic IPM. Harmless to pollinators. Can repeat every 10 days.';
      }
    }

    return {
      totalWaterLitres,
      numberOfPumps,
      chemicalName,
      dosePerLitre,
      dosePerTank,
      totalChemicalNeeded,
      marketPacking,
      safetyNotes
    };
  };

  const dosageData = calculateDosage();

  // Helper to ask AI about current calculator output
  const queryCalculatedDosage = () => {
    const q = currentLanguage === 'te'
      ? `${calcAcreage} ఎకరాల ${selectedCrop || 'పంట'} కోసం ${dosageData.chemicalName} స్ప్రే చేసే సరైన పద్ధతి మరియు తీసుకోవాల్సిన జాగ్రత్తలు ఏమిటి?`
      : currentLanguage === 'hi'
      ? `${calcAcreage} एकड़ ${selectedCrop || 'फसल'} हेतु ${dosageData.chemicalName} छिड़काव की सही विधि व सावधानियां बताएं?`
      : `What is the exact spray schedule and safety guidelines for ${calcAcreage} acres using ${dosageData.chemicalName}?`;
    handleSend(q);
    setShowCalculator(false);
  };

  const cropsList = [
    { id: '', label: currentLanguage === 'te' ? 'అన్ని పంటలు' : currentLanguage === 'hi' ? 'सभी फसलें' : 'All Crops' },
    { id: 'Tomato', label: '🍅 ' + (currentLanguage === 'te' ? 'టమోటా' : currentLanguage === 'hi' ? 'टमाटर' : 'Tomato') },
    { id: 'Chilli', label: '🌶️ ' + (currentLanguage === 'te' ? 'మిరప' : currentLanguage === 'hi' ? 'मिर्च' : 'Chilli') },
    { id: 'Rice', label: '🌾 ' + (currentLanguage === 'te' ? 'వరి' : currentLanguage === 'hi' ? 'धान' : 'Paddy / Rice') },
    { id: 'Cotton', label: '☁️ ' + (currentLanguage === 'te' ? 'ప్రత్తి' : currentLanguage === 'hi' ? 'कपास' : 'Cotton') }
  ];

  return (
    <div style={{ maxWidth: '1080px', margin: '20px auto', padding: '0 16px', minHeight: '85vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* Top Banner with Glassmorphism */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(14, 38, 20, 0.95) 0%, rgba(27, 94, 32, 0.92) 100%)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        color: '#ffffff',
        borderRadius: '20px',
        padding: '22px 28px',
        border: '1px solid rgba(245, 158, 11, 0.4)',
        boxShadow: '0 12px 32px rgba(0, 0, 0, 0.35)',
        marginBottom: '18px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
          <div style={{
            background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
            borderRadius: '50%',
            width: '62px',
            height: '62px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '2rem',
            boxShadow: '0 4px 16px rgba(245, 158, 11, 0.4)'
          }}>
            🤖
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
              <h1 style={{ margin: 0, fontSize: '1.65rem', fontWeight: '900', letterSpacing: '-0.5px' }}>
                {currentLanguage === 'te' ? 'అగ్రిహబ్ AI కిసాన్ శాస్త్రవేత్త' : currentLanguage === 'hi' ? 'AGRIHUB AI कृषि वैज्ञानिक' : 'AGRIHUB Enterprise AI Krishi Advisor'}
              </h1>
              <span style={{
                backgroundColor: 'rgba(52, 211, 153, 0.25)',
                border: '1px solid #34d399',
                color: '#6ee7b7',
                padding: '3px 10px',
                borderRadius: '12px',
                fontSize: '0.75rem',
                fontWeight: '800'
              }}>
                v3.5 PRO AGRONOMY
              </span>
            </div>
            <p style={{ margin: '6px 0 0 0', color: '#cbd5e1', fontSize: '0.92rem' }}>
              {currentLanguage === 'te'
                ? 'వాయిస్ ఆడియో సపోర్ట్ • ఎకరాలవారీగా పంపుల మోతాదు కాలిక్యులేటర్ • 24/7 శాస్త్రీయ పరిష్కారాలు'
                : currentLanguage === 'hi'
                ? 'वॉइस ऑडियो सपोर्ट • एकड़ अनुसार पंप व दवा खुराक कैलकुलेटर • 24/7 वैज्ञानिक समाधान'
                : 'Audio TTS Voice • Acreage Tank Dosage Calculator • 24/7 Precision Agronomy Guidance'}
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button
            onClick={() => setShowCalculator(!showCalculator)}
            style={{
              background: showCalculator ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' : 'rgba(255,255,255,0.12)',
              border: '1px solid rgba(245, 158, 11, 0.6)',
              color: showCalculator ? '#0f2913' : '#fef3c7',
              padding: '9px 16px',
              borderRadius: '24px',
              cursor: 'pointer',
              fontSize: '0.88rem',
              fontWeight: '700',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.2s ease',
              boxShadow: showCalculator ? '0 4px 14px rgba(245, 158, 11, 0.4)' : 'none'
            }}
          >
            <span>🧮</span>
            <span>{currentLanguage === 'te' ? 'మోతాదు కాలిక్యులేటర్' : currentLanguage === 'hi' ? 'स्प्रे खुराक कैलकुलेटर' : 'Dosage Calculator'}</span>
          </button>

          <button
            onClick={clearChat}
            style={{
              backgroundColor: 'rgba(255,255,255,0.12)',
              border: '1px solid rgba(255,255,255,0.3)',
              color: '#ffffff',
              padding: '9px 16px',
              borderRadius: '24px',
              cursor: 'pointer',
              fontSize: '0.88rem',
              fontWeight: '600',
              transition: 'background-color 0.2s ease'
            }}
          >
            🔄 {currentLanguage === 'te' ? 'కొత్త సంభాషణ' : currentLanguage === 'hi' ? 'नई बातचीत' : 'New Chat'}
          </button>
        </div>
      </div>

      {/* Interactive Acreage & Spray Dosage Calculator Drawer */}
      {showCalculator && (
        <div style={{
          background: 'rgba(12, 34, 18, 0.94)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderRadius: '18px',
          border: '1.5px solid #f59e0b',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.4)',
          padding: '24px',
          marginBottom: '20px',
          color: '#ffffff'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', borderBottom: '1px solid rgba(245, 158, 11, 0.3)', paddingBottom: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '1.6rem' }}>🧮</span>
              <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: '800', color: '#fef3c7' }}>
                {currentLanguage === 'te' ? 'స్మార్ట్ స్ప్రే డోసేజ్ & పంపుల కాలిక్యులేటర్' : currentLanguage === 'hi' ? 'स्मार्ट स्प्रे खुराक एवं पंप कैलकुलेटर' : 'Smart Spray Dosage & Tank Calculator'}
              </h3>
            </div>
            <button
              onClick={() => setShowCalculator(false)}
              style={{ background: 'transparent', border: 'none', color: '#f59e0b', fontSize: '1.4rem', cursor: 'pointer' }}
            >
              ✕
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '20px' }}>
            {/* Input 1: Acreage */}
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: '#a7f3d0', marginBottom: '6px' }}>
                🌾 {currentLanguage === 'te' ? 'పొలం విస్తీర్ణం (ఎకరాలు):' : currentLanguage === 'hi' ? 'खेत का क्षेत्रफल (एकड़):' : 'Farm Acreage (Acres):'}
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input
                  type="number"
                  step="0.25"
                  min="0.25"
                  max="50"
                  value={calcAcreage}
                  onChange={(e) => setCalcAcreage(Math.max(0.25, parseFloat(e.target.value) || 0.25))}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '10px',
                    border: '1px solid #34d399',
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    color: '#ffffff',
                    fontSize: '1rem',
                    fontWeight: '700',
                    outline: 'none'
                  }}
                />
              </div>
            </div>

            {/* Input 2: Sprayer Equipment */}
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: '#a7f3d0', marginBottom: '6px' }}>
                🎒 {currentLanguage === 'te' ? 'స్ప్రేయర్ ట్యాంక్ సామర్థ్యం:' : currentLanguage === 'hi' ? 'स्प्रेयर टैंक क्षमता:' : 'Sprayer Tank Capacity:'}
              </label>
              <select
                value={calcTankCapacity}
                onChange={(e) => setCalcTankCapacity(parseInt(e.target.value, 10))}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  border: '1px solid #34d399',
                  backgroundColor: '#0d2815',
                  color: '#ffffff',
                  fontSize: '0.92rem',
                  fontWeight: '600',
                  outline: 'none'
                }}
              >
                <option value={16}>16 Litres (బ్యాక్‌ప్యాక్ నాప్‌సాక్ / Backpack Knapsack)</option>
                <option value={20}>20 Litres (బ్యాటరీ పంప్ / Battery Pump)</option>
                <option value={200}>200 Litres (ట్రాక్టర్ ట్రాలీ డ్రమ్ / Tractor Drum)</option>
              </select>
            </div>

            {/* Input 3: Treatment Category */}
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: '#a7f3d0', marginBottom: '6px' }}>
                🧪 {currentLanguage === 'te' ? 'పిచికారీ రకం:' : currentLanguage === 'hi' ? 'दवा का प्रकार:' : 'Treatment Solution Type:'}
              </label>
              <select
                value={calcCategory}
                onChange={(e) => setCalcCategory(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  border: '1px solid #34d399',
                  backgroundColor: '#0d2815',
                  color: '#ffffff',
                  fontSize: '0.92rem',
                  fontWeight: '600',
                  outline: 'none'
                }}
              >
                <option value="fungicide">ఫంగిసైడ్ (Fungicide - Blight/Mildew)</option>
                <option value="insecticide">ఇన్సెక్టిసైడ్ (Insecticide - Thrips/Whitefly)</option>
                <option value="nutrition">ఫోలియర్ ఎరువు (Foliar NPK 19:19:19)</option>
                <option value="organic">సేంద్రీయ వేపనూనె (Organic Bio Neem)</option>
              </select>
            </div>
          </div>

          {/* Real-time Calculation Result Cards */}
          <div style={{
            background: 'rgba(0, 0, 0, 0.35)',
            border: '1px solid rgba(52, 211, 153, 0.4)',
            borderRadius: '14px',
            padding: '18px',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '14px',
            marginBottom: '16px'
          }}>
            <div style={{ borderRight: '1px solid rgba(255,255,255,0.1)', paddingRight: '12px' }}>
              <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>💧 Total Water Required</div>
              <div style={{ fontSize: '1.4rem', fontWeight: '900', color: '#38bdf8', marginTop: '4px' }}>
                {dosageData.totalWaterLitres} Litres
              </div>
              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Standard ~200L / Acre</div>
            </div>

            <div style={{ borderRight: '1px solid rgba(255,255,255,0.1)', paddingRight: '12px' }}>
              <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>🎒 Number of Sprayer Pumps</div>
              <div style={{ fontSize: '1.4rem', fontWeight: '900', color: '#facc15', marginTop: '4px' }}>
                {dosageData.numberOfPumps} Pumps / Tanks
              </div>
              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>({calcTankCapacity}L tank charges)</div>
            </div>

            <div style={{ borderRight: '1px solid rgba(255,255,255,0.1)', paddingRight: '12px' }}>
              <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>🧪 Dose Per Sprayer Tank</div>
              <div style={{ fontSize: '1.25rem', fontWeight: '900', color: '#4ade80', marginTop: '4px' }}>
                {dosageData.dosePerTank}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Rate: {dosageData.dosePerLitre}</div>
            </div>

            <div>
              <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>📦 Total Purchase Needed</div>
              <div style={{ fontSize: '1.15rem', fontWeight: '800', color: '#f43f5e', marginTop: '4px' }}>
                {dosageData.totalChemicalNeeded}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#fb7185' }}>Buy: {dosageData.marketPacking}</div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
            <div style={{ fontSize: '0.85rem', color: '#fef08a', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span>⚠️</span> <span>{dosageData.safetyNotes}</span>
            </div>

            <button
              onClick={queryCalculatedDosage}
              style={{
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                color: '#ffffff',
                border: 'none',
                borderRadius: '20px',
                padding: '9px 18px',
                fontWeight: '800',
                fontSize: '0.88rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 4px 12px rgba(16, 185, 129, 0.4)'
              }}
            >
              <span>💬</span>
              <span>{currentLanguage === 'te' ? 'పూర్తి షెడ్యూల్ కోసం AI ని అడగండి' : currentLanguage === 'hi' ? 'पूरा शेड्यूल AI से पूछें' : 'Ask AI for Full Schedule'}</span>
            </button>
          </div>
        </div>
      )}

      {/* Crop Filter Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        marginBottom: '14px',
        overflowX: 'auto',
        padding: '8px 12px',
        background: 'rgba(10, 26, 14, 0.75)',
        backdropFilter: 'blur(10px)',
        borderRadius: '14px',
        border: '1px solid rgba(255,255,255,0.15)'
      }}>
        <span style={{ fontSize: '0.85rem', fontWeight: '800', color: '#fef3c7', whiteSpace: 'nowrap' }}>
          {currentLanguage === 'te' ? 'పంట ఫిల్టర్:' : currentLanguage === 'hi' ? 'फसल फिल्टर:' : 'Crop Filter:'}
        </span>
        {cropsList.map((crop) => (
          <button
            key={crop.id}
            onClick={() => setSelectedCrop(crop.id)}
            style={{
              backgroundColor: selectedCrop === crop.id ? '#f59e0b' : 'rgba(255,255,255,0.1)',
              color: selectedCrop === crop.id ? '#0f2913' : '#ffffff',
              border: selectedCrop === crop.id ? '1px solid #f59e0b' : '1px solid rgba(255,255,255,0.2)',
              borderRadius: '20px',
              padding: '6px 14px',
              fontSize: '0.85rem',
              fontWeight: '700',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'all 0.2s ease'
            }}
          >
            {crop.label}
          </button>
        ))}
      </div>

      {/* Suggested Quick Question Chips */}
      {topics.length > 0 && (
        <div style={{ marginBottom: '14px' }}>
          <div style={{ fontSize: '0.82rem', fontWeight: '700', color: '#fef3c7', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span>💡</span>
            <span>{currentLanguage === 'te' ? 'రైతులు తరచుగా అడిగే ప్రశ్నలు (నొక్కండి):' : currentLanguage === 'hi' ? 'किसानों के मुख्य प्रश्न (क्लिक करें):' : 'Suggested Farmer Questions (Click to Ask):'}</span>
          </div>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {topics.map((t) => (
              <button
                key={t.id}
                onClick={() => handleSend(t.query)}
                disabled={loading}
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.15)',
                  backdropFilter: 'blur(8px)',
                  border: '1px solid rgba(245, 158, 11, 0.4)',
                  color: '#ffffff',
                  borderRadius: '16px',
                  padding: '7px 14px',
                  fontSize: '0.82rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.15s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(245, 158, 11, 0.3)';
                  e.currentTarget.style.borderColor = '#f59e0b';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.15)';
                  e.currentTarget.style.borderColor = 'rgba(245, 158, 11, 0.4)';
                }}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Main Chat Messages Container */}
      <div style={{
        flex: 1,
        background: 'rgba(12, 32, 17, 0.88)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderRadius: '20px',
        border: '1px solid rgba(245, 158, 11, 0.35)',
        boxShadow: '0 12px 40px rgba(0,0,0,0.3)',
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        minHeight: '440px',
        maxHeight: '62vh',
        overflowY: 'auto'
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {messages.map((msg) => (
            <div
              key={msg.id}
              style={{
                display: 'flex',
                justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start'
              }}
            >
              <div style={{
                maxWidth: msg.sender === 'user' ? '80%' : '90%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: msg.sender === 'user' ? 'flex-end' : 'flex-start'
              }}>
                <div style={{
                  background: msg.sender === 'user'
                    ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'
                    : (msg.isError ? 'rgba(127, 29, 29, 0.9)' : 'rgba(255, 255, 255, 0.96)'),
                  color: msg.sender === 'user' ? '#0f2913' : (msg.isError ? '#fee2e2' : '#0f172a'),
                  borderRadius: msg.sender === 'user' ? '20px 20px 4px 20px' : '20px 20px 20px 4px',
                  padding: '16px 20px',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.18)',
                  border: msg.sender === 'user' ? 'none' : '1px solid ' + (msg.isError ? '#f87171' : 'rgba(255,255,255,0.9)'),
                  whiteSpace: 'pre-wrap',
                  lineHeight: '1.65',
                  fontSize: '0.94rem'
                }}>
                  {msg.sender === 'ai' && (
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '12px',
                      borderBottom: '1px solid #e2e8f0',
                      paddingBottom: '8px'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '800', color: '#1b5e20', fontSize: '0.82rem' }}>
                        <span>🤖 AGRIHUB AI ADVISOR</span>
                        {msg.provider && (
                          <span style={{ backgroundColor: '#dcfce7', color: '#166534', padding: '2px 8px', borderRadius: '10px', fontSize: '0.72rem', fontWeight: '700' }}>
                            {msg.provider}
                          </span>
                        )}
                      </div>

                      {/* TTS Audio Listen Button */}
                      {!msg.isError && (
                        <button
                          onClick={() => handleSpeak(msg.id, msg.text)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            backgroundColor: speakingMessageId === msg.id ? '#fee2e2' : '#ecfdf5',
                            border: '1px solid ' + (speakingMessageId === msg.id ? '#ef4444' : '#10b981'),
                            color: speakingMessageId === msg.id ? '#b91c1c' : '#047857',
                            padding: '4px 10px',
                            borderRadius: '16px',
                            fontSize: '0.78rem',
                            fontWeight: '700',
                            cursor: 'pointer',
                            transition: 'all 0.15s ease'
                          }}
                        >
                          <span>{speakingMessageId === msg.id ? '⏹️' : '🔊'}</span>
                          <span>
                            {speakingMessageId === msg.id
                              ? (currentLanguage === 'te' ? 'ఆపండి' : currentLanguage === 'hi' ? 'रोकें' : 'Stop')
                              : (currentLanguage === 'te' ? 'వినండి' : currentLanguage === 'hi' ? 'सुनें' : 'Listen')}
                          </span>
                        </button>
                      )}
                    </div>
                  )}

                  {/* Message Content */}
                  <div>{msg.text}</div>

                  {/* Contextual Follow-up Action Chips under AI response */}
                  {msg.sender === 'ai' && !msg.isError && msg.id !== 1 && (
                    <div style={{
                      marginTop: '14px',
                      paddingTop: '10px',
                      borderTop: '1px dashed #cbd5e1',
                      display: 'flex',
                      gap: '8px',
                      flexWrap: 'wrap'
                    }}>
                      <button
                        onClick={() => setShowCalculator(true)}
                        style={{
                          backgroundColor: '#fef3c7',
                          border: '1px solid #f59e0b',
                          color: '#92400e',
                          padding: '4px 10px',
                          borderRadius: '12px',
                          fontSize: '0.76rem',
                          fontWeight: '700',
                          cursor: 'pointer'
                        }}
                      >
                        🧮 {currentLanguage === 'te' ? 'నాప్సాక్ పంపుల మోతాదు లెక్కించండి' : currentLanguage === 'hi' ? 'पंप खुराक कैलकुलेट करें' : 'Calculate Tank Dosage'}
                      </button>

                      <button
                        onClick={() => handleSend(
                          currentLanguage === 'te'
                            ? `${selectedCrop || 'ఈ పంట'}కు సేంద్రీయ/వేపనూనె లేదా ప్రకృతి వ్యవసాయ ప్రత్యామ్నాయాలు ఏమిటి?`
                            : currentLanguage === 'hi'
                            ? `${selectedCrop || 'इस फसल'} हेतु जैविक अथवा नीम आधारित प्राकृतिक उपचार क्या हैं?`
                            : `What is the organic / neem bio-pesticide alternative for ${selectedCrop || 'this crop'}?`
                        )}
                        style={{
                          backgroundColor: '#dcfce7',
                          border: '1px solid #10b981',
                          color: '#14532d',
                          padding: '4px 10px',
                          borderRadius: '12px',
                          fontSize: '0.76rem',
                          fontWeight: '700',
                          cursor: 'pointer'
                        }}
                      >
                        🌱 {currentLanguage === 'te' ? 'సేంద్రీయ ప్రత్యామ్నాయం' : currentLanguage === 'hi' ? 'जैविक उपचार' : 'Organic Alternative'}
                      </button>

                      <button
                        onClick={() => handleSend(
                          currentLanguage === 'te'
                            ? `స్ప్రే చేయడానికి ఉత్తమ సమయం, ఉష్ణోగ్రత మరియు వాతావరణ జాగ్రత్తలు ఏమిటి?`
                            : currentLanguage === 'hi'
                            ? `छिड़काव हेतु सर्वोत्तम समय, मौसम व तापमान की सावधानियां क्या हैं?`
                            : `What is the best spray weather timing and wind guidelines?`
                        )}
                        style={{
                          backgroundColor: '#e0f2fe',
                          border: '1px solid #0284c7',
                          color: '#0369a1',
                          padding: '4px 10px',
                          borderRadius: '12px',
                          fontSize: '0.76rem',
                          fontWeight: '700',
                          cursor: 'pointer'
                        }}
                      >
                        🌦️ {currentLanguage === 'te' ? 'స్ప్రే వాతావరణ సమయం' : currentLanguage === 'hi' ? 'स्प्रे मौसम व समय' : 'Spray Weather Window'}
                      </button>
                    </div>
                  )}
                </div>

                <span style={{ fontSize: '0.72rem', color: '#cbd5e1', marginTop: '5px', padding: '0 4px', fontWeight: '500' }}>
                  {msg.timestamp}
                </span>
              </div>
            </div>
          ))}

          {loading && (
            <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
              <div style={{
                background: 'rgba(255, 255, 255, 0.95)',
                borderRadius: '20px 20px 20px 4px',
                padding: '16px 24px',
                border: '1px solid #34d399',
                color: '#1b5e20',
                fontWeight: '700',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                fontSize: '0.92rem',
                boxShadow: '0 4px 16px rgba(0,0,0,0.15)'
              }}>
                <div style={{
                  width: '18px',
                  height: '18px',
                  border: '3px solid #1b5e20',
                  borderTopColor: 'transparent',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite'
                }} />
                {currentLanguage === 'te'
                  ? '🌾 AI శాస్త్రవేత్త పంట డాటాను విశ్లేషిస్తున్నారు...'
                  : currentLanguage === 'hi'
                  ? '🌾 AI कृषि वैज्ञानिक परामर्श तैयार कर रहा है...'
                  : '🌾 Enterprise AI Agronomist analyzing precision dossier...'}
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Voice Input Indicator */}
      {isListening && (
        <div style={{
          marginTop: '10px',
          background: 'rgba(239, 68, 68, 0.9)',
          color: '#ffffff',
          padding: '8px 16px',
          borderRadius: '12px',
          fontSize: '0.85rem',
          fontWeight: '700',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          boxShadow: '0 4px 12px rgba(239, 68, 68, 0.4)'
        }}>
          <span style={{ animation: 'pulseGlow 1s infinite' }}>🎙️</span>
          <span>
            {currentLanguage === 'te'
              ? 'వినబడుతోంది... మీ ప్రశ్నను మాట్లాడండి (Listening... speak now)'
              : currentLanguage === 'hi'
              ? 'सुन रहा हूँ... अपना प्रश्न बोलें (Listening... speak now)'
              : 'Listening... please speak your farming question now'}
          </span>
          <button
            onClick={toggleListening}
            style={{
              background: '#ffffff',
              color: '#dc2626',
              border: 'none',
              borderRadius: '8px',
              padding: '2px 8px',
              fontWeight: '800',
              cursor: 'pointer',
              marginLeft: '8px'
            }}
          >
            Stop
          </button>
        </div>
      )}

      {/* Input Area */}
      <div style={{
        marginTop: '14px',
        display: 'flex',
        gap: '10px',
        background: 'rgba(10, 26, 14, 0.92)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        padding: '10px',
        borderRadius: '18px',
        border: '1.5px solid rgba(245, 158, 11, 0.5)',
        boxShadow: '0 8px 24px rgba(0,0,0,0.3)'
      }}>
        {/* Mic Voice Button */}
        <button
          onClick={toggleListening}
          title={currentLanguage === 'te' ? 'మైక్ ద్వారా మాట్లాడండి' : currentLanguage === 'hi' ? 'माइक से बोलें' : 'Speak via Microphone'}
          style={{
            background: isListening ? '#ef4444' : 'rgba(255, 255, 255, 0.12)',
            border: isListening ? '2px solid #ffffff' : '1px solid rgba(245, 158, 11, 0.4)',
            color: '#ffffff',
            borderRadius: '14px',
            width: '46px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.25rem',
            transition: 'all 0.2s ease'
          }}
        >
          🎙️
        </button>

        {/* Text Area */}
        <textarea
          rows={2}
          value={inputQuery}
          onChange={(e) => setInputQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={
            currentLanguage === 'te'
              ? 'మీ ప్రశ్నను ఇక్కడ రాయండి లేదా మైక్ నొక్కండి (ఉదా: టమోటా ఆకుముడత, లేదా మిరపలో నల్లి నివారణకు ఏ మందు వాడాలి?)...'
              : currentLanguage === 'hi'
              ? 'अपना प्रश्न लिखें या माइक से बोलें (उदा: टमाटर, मिर्च में पत्ती मरोड़, अथवा खाद की सही मात्रा)...'
              : 'Type your farming question or click mic (e.g., tomatoes, chilli leaf curl spray dosage)...'
          }
          style={{
            flex: 1,
            border: 'none',
            outline: 'none',
            fontSize: '0.94rem',
            resize: 'none',
            padding: '8px 12px',
            fontFamily: 'inherit',
            backgroundColor: 'transparent',
            color: '#ffffff'
          }}
        />

        {/* Send Button */}
        <button
          onClick={() => handleSend()}
          disabled={!inputQuery.trim() || loading}
          style={{
            background: !inputQuery.trim() || loading
              ? 'rgba(255,255,255,0.2)'
              : 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
            color: !inputQuery.trim() || loading ? '#94a3b8' : '#0f2913',
            border: 'none',
            borderRadius: '14px',
            padding: '0 24px',
            fontWeight: '900',
            cursor: !inputQuery.trim() || loading ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            fontSize: '0.96rem',
            transition: 'all 0.2s ease',
            boxShadow: !inputQuery.trim() || loading ? 'none' : '0 4px 14px rgba(245, 158, 11, 0.4)'
          }}
        >
          <span>🚀</span>
          <span>{currentLanguage === 'te' ? 'పంపండి' : currentLanguage === 'hi' ? 'भेजें' : 'Send'}</span>
        </button>
      </div>
    </div>
  );
};

export default AiAssistant;
