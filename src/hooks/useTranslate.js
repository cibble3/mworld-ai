import { useState, useEffect, useCallback } from 'react';
import { useLanguage } from '@/context/LanguageContext';

// Local in-memory cache for faster access
const translationCache = {};

export default function useTranslate() {
  const { language, isEnglish } = useLanguage();
  const [translationQueue, setTranslationQueue] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Process the translation queue
  useEffect(() => {
    const processQueue = async () => {
      if (translationQueue.length === 0 || isProcessing) return;
      
      setIsProcessing(true);
      
      const [{ text, targetLang, resolve, reject }] = translationQueue;
      setTranslationQueue(prev => prev.slice(1));
      
      try {
        // Check cache first
        const cacheKey = `${text}|${targetLang}`;
        if (translationCache[cacheKey]) {
          resolve(translationCache[cacheKey]);
          setIsProcessing(false);
          return;
        }
        
        const response = await fetch('/api/translate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text, targetLang })
        });
        
        if (!response.ok) {
          throw new Error('Translation failed');
        }
        
        const data = await response.json();
        
        // Cache the result
        translationCache[cacheKey] = data.translatedText;
        
        resolve(data.translatedText);
      } catch (error) {
        console.error('Translation error:', error);
        reject(error);
      } finally {
        setIsProcessing(false);
      }
    };
    
    processQueue();
  }, [translationQueue, isProcessing]);
  
  // Add a translation request to the queue
  const translate = useCallback((text, targetLang = language) => {
    // Skip translation for English
    if (targetLang === 'en' || !text) {
      return Promise.resolve(text);
    }
    
    return new Promise((resolve, reject) => {
      setTranslationQueue(prev => [...prev, { text, targetLang, resolve, reject }]);
    });
  }, [language]);
  
  // Translate HTML content, preserving HTML tags
  const translateHtml = useCallback(async (html, targetLang = language) => {
    if (targetLang === 'en' || !html) {
      return html;
    }
    
    try {
      return await translate(html, targetLang);
    } catch (error) {
      console.error('HTML translation error:', error);
      return html; // Fallback to original HTML
    }
  }, [language, translate]);
  
  return { 
    translate,
    translateHtml,
    isProcessing,
    queueLength: translationQueue.length
  };
} 