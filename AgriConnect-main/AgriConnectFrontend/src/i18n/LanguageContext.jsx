import React, { createContext, useContext, useState, useEffect } from 'react';
import { en } from './translations/en';
import { te } from './translations/te';
import { hi } from './translations/hi';

const translations = { en, te, hi };

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  // Default to Telugu ('te') for demo, or read from localStorage
  const [currentLanguage, setCurrentLanguage] = useState(() => {
    return localStorage.getItem('agrihub_lang') || localStorage.getItem('krishisetu_lang') || 'te';
  });

  useEffect(() => {
    localStorage.setItem('agrihub_lang', currentLanguage);
  }, [currentLanguage]);

  const changeLanguage = (langCode) => {
    if (['en', 'te', 'hi'].includes(langCode)) {
      setCurrentLanguage(langCode);
    }
  };

  const t = (key, params = {}) => {
    const langDict = translations[currentLanguage] || translations.en;
    let text = langDict[key] || translations.en[key] || key;

    // Parameter interpolation, e.g. {name}
    Object.keys(params).forEach((paramKey) => {
      text = text.replace(new RegExp(`\\{${paramKey}\\}`, 'g'), params[paramKey]);
    });

    return text;
  };

  return (
    <LanguageContext.Provider value={{ currentLanguage, changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
