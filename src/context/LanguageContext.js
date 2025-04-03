import { useRouter } from "next/router";
import React, { createContext, useState, useEffect, useContext } from "react";

// Language options with names in their native language
const LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Español' },
  { code: 'fr', name: 'Français' },
  { code: 'de', name: 'Deutsch' },
  { code: 'it', name: 'Italiano' },
  { code: 'pt', name: 'Português' },
  { code: 'ru', name: 'Русский' },
  { code: 'zh', name: '中文' },
  { code: 'ja', name: '日本語' },
  { code: 'ko', name: '한국어' },
  { code: 'ar', name: 'العربية' },
  { code: 'hi', name: 'हिन्दी' },
];

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const router = useRouter();
  const { locale } = router;
  
  const [language, setLanguage] = useState(locale || 'en');
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
  
  // For backward compatibility with existing code
  const selectedLanguage = language.toUpperCase();
  const handleLanguageChange = (newLang) => {
    const langCode = newLang.toLowerCase();
    changeLanguage(langCode);
  };

  const contextValue = {
    language,
    changeLanguage,
    isTranslating,
    isEnglish: language === 'en',
    
    // For backward compatibility
    selectedLanguage,
    handleLanguageChange,
    
    // Available languages
    languages: LANGUAGES
  };

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);

export default LanguageContext;
