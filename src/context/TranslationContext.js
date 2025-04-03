import React, { createContext, useState, useEffect, useContext } from 'react';

const TranslationContext = createContext();

export const TranslationProvider = ({ children }) => {
  const [language, setLanguage] = useState('en');
  const [isTranslating, setIsTranslating] = useState(false);
  
  // Load language preference from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedLanguage = localStorage.getItem('preferredLanguage');
      if (savedLanguage) {
        setLanguage(savedLanguage);
      } else {
        // Detect browser language
        try {
          const browserLang = navigator.language.split('-')[0];
          setLanguage(browserLang || 'en');
        } catch (e) {
          // Fallback to English if detection fails
          setLanguage('en');
        }
      }
    }
  }, []);
  
  // Save language preference when it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('preferredLanguage', language);
    }
  }, [language]);
  
  const changeLanguage = (newLanguage) => {
    setIsTranslating(true);
    setLanguage(newLanguage);
    // Add a small delay to show translation is happening
    setTimeout(() => setIsTranslating(false), 500);
  };
  
  return (
    <TranslationContext.Provider 
      value={{ 
        language, 
        changeLanguage, 
        isTranslating,
        isEnglish: language === 'en'
      }}
    >
      {children}
    </TranslationContext.Provider>
  );
};

export const useTranslation = () => useContext(TranslationContext);

export default TranslationContext; 