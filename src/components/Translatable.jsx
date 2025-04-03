import { useState, useEffect } from 'react';
import useTranslate from '@/hooks/useTranslate';
import { useLanguage } from '@/context/LanguageContext';

/**
 * Translatable component that translates its content to the currently selected language
 * @param {Object} props
 * @param {React.ReactNode} props.children - Content to translate
 * @param {boolean} props.html - Whether the content is HTML
 * @param {string} props.lang - Override the target language
 * @param {boolean} props.immediate - Whether to translate immediately (vs. on demand)
 * @param {Object} props.className - Additional CSS classes
 */
export default function Translatable({ 
  children, 
  html = false, 
  lang = null, 
  immediate = true,
  className = '',
  ...props 
}) {
  const { language, isTranslating, isEnglish } = useLanguage();
  const { translate, translateHtml } = useTranslate();
  const [translatedContent, setTranslatedContent] = useState(children);
  const [isLoading, setIsLoading] = useState(false);
  
  // Skip translation if content is empty or undefined
  const contentToTranslate = children || '';
  const targetLang = lang || language;
  
  useEffect(() => {
    // If not immediate, don't translate automatically
    if (!immediate) return;
    
    // Skip translation for English content
    if (targetLang === 'en') {
      setTranslatedContent(contentToTranslate);
      return;
    }
    
    async function translateContent() {
      setIsLoading(true);
      try {
        if (html) {
          const result = await translateHtml(contentToTranslate, targetLang);
          setTranslatedContent(result);
        } else {
          const result = await translate(contentToTranslate, targetLang);
          setTranslatedContent(result);
        }
      } catch (error) {
        console.error('Translation error:', error);
        // Fallback to original content
        setTranslatedContent(contentToTranslate);
      } finally {
        setIsLoading(false);
      }
    }
    
    translateContent();
  }, [contentToTranslate, targetLang, html, translate, translateHtml, immediate]);
  
  // On-demand translation function for non-immediate mode
  const handleTranslate = async () => {
    if (targetLang === 'en' || isLoading) return;
    
    setIsLoading(true);
    try {
      if (html) {
        const result = await translateHtml(contentToTranslate, targetLang);
        setTranslatedContent(result);
      } else {
        const result = await translate(contentToTranslate, targetLang);
        setTranslatedContent(result);
      }
    } catch (error) {
      console.error('On-demand translation error:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Add loading indicator if needed
  const content = isLoading ? (
    <span className="opacity-50">{translatedContent || contentToTranslate}</span>
  ) : translatedContent;
  
  // For HTML content, use dangerouslySetInnerHTML
  if (html) {
    return (
      <div 
        className={className}
        dangerouslySetInnerHTML={{ __html: content }} 
        onClick={!immediate ? handleTranslate : undefined}
        {...props}
      />
    );
  }
  
  // For text content, render directly
  return (
    <span 
      className={className} 
      onClick={!immediate ? handleTranslate : undefined}
      {...props}
    >
      {content}
    </span>
  );
} 