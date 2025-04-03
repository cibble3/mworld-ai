import { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';

export default function LanguageSelector() {
  const { language, changeLanguage, isTranslating, languages } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  
  // Find the current language
  const currentLanguage = languages.find(lang => lang.code === language) || languages[0];
  
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };
  
  const handleSelectLanguage = (langCode) => {
    changeLanguage(langCode);
    setIsOpen(false);
  };
  
  return (
    <div className="relative inline-block text-left">
      <div>
        <button
          type="button"
          className="inline-flex justify-between items-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
          onClick={toggleDropdown}
          aria-expanded={isOpen}
          aria-haspopup="true"
        >
          <span className="mr-2">{currentLanguage.name}</span>
          <span className="flex-shrink-0 h-4 w-4 text-gray-400">
            <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" className="h-4 w-4">
              <path
                fillRule="evenodd"
                d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                clipRule="evenodd"
              />
            </svg>
          </span>
        </button>
      </div>

      {isOpen && (
        <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
          <div className="py-1 max-h-64 overflow-auto" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleSelectLanguage(lang.code)}
                className={`${
                  lang.code === language ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                } flex items-center w-full text-left px-4 py-2 text-sm hover:bg-gray-100`}
                role="menuitem"
              >
                <span className="mr-2">{lang.name}</span>
                {lang.code === language && (
                  <svg className="h-5 w-5 text-pink-500" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
      
      {/* Translation indicator */}
      {isTranslating && (
        <div className="absolute -top-1 -right-1">
          <div className="animate-ping h-3 w-3 rounded-full bg-pink-400 opacity-75"></div>
        </div>
      )}
    </div>
  );
} 