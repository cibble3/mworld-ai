import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useTheme } from '@/context/ThemeContext';
import { themes } from '@/theme/config';
import Container from '../grid/Container';
import useCategories from '@/hooks/useCategories';
import { capitalizeString, slugify } from '@/utils/string-helpers';

const formatFilterName = (name) => {
  return capitalizeString(name.replace(/_/g, ' '));
};

const LegacyTopbar = () => {
  const { theme, setTheme, availableThemes } = useTheme();
  const router = useRouter();
  const { categories, isLoading, isError } = useCategories();

  const currentPathSegments = router.asPath.split('/').filter(Boolean);
  const currentMainCategorySlug = currentPathSegments[0];

  const defaultThemeKey = Object.keys(themes)[0];
  const currentThemeKey = availableThemes.includes(theme) ? theme : defaultThemeKey;
  const currentTheme = themes[currentThemeKey];

  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);

  if (!currentTheme) {
    console.error(`Theme not found for key: ${currentThemeKey} in LegacyTopbar. No themes available?`);
    return <nav className="fixed top-0 left-0 w-full h-16 z-20 shadow-md bg-gray-900 animate-pulse"></nav>;
  }
  
  const navStyle = {
    backgroundColor: currentTheme.navigation?.topbar || currentTheme.secondary || '#1a1a1a',
    borderBottom: `1px solid ${currentTheme.border || '#333'}`,
    color: currentTheme.text?.primary || '#ffffff',
  };
  const buttonStyle = {
    backgroundColor: currentTheme.button?.secondary || '#333'
  };
  const primaryButtonStyle = {
      backgroundColor: currentTheme.button?.primary || '#e0006c'
  };
  const dropdownStyle = {
     backgroundColor: currentTheme.secondary || '#222',
     borderColor: currentTheme.border || '#333',
     color: currentTheme.text?.secondary || '#ccc',
  };
  const activeLinkStyle = {
      color: currentTheme.button?.primary || '#e0006c',
      fontWeight: 'bold',
  };
  
  const languages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Español' },
    { code: 'de', name: 'Deutsch' },
    { code: 'fr', name: 'Français' },
  ];

  const handleMouseEnter = (slug) => {
    setOpenDropdown(slug);
  };

  const handleMouseLeave = () => {
    setOpenDropdown(null);
  };

  return (
    <nav 
      className="fixed top-0 left-0 w-full h-16 z-20 shadow-md"
      style={navStyle}
    >
      <Container>
        <div className="h-16 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold flex items-center">
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center overflow-hidden mr-3">
                <span className="text-black font-bold text-lg">MW</span>
              </div>
              <span className="hidden md:block">MistressWorld</span>
            </Link>
          </div>

          {/* Center Navigation & Search */}
          <div className="hidden md:flex flex-grow items-center justify-center space-x-4">
            {isLoading ? (
              <span className="text-sm">Loading Nav...</span>
            ) : isError ? (
              <span className="text-sm text-red-500">Error</span>
            ) : (
              categories
                .filter(cat => ['girls', 'trans', 'fetish', 'free', 'videos'].includes(cat.slug))
                .map((cat) => {
                  const isActive = currentMainCategorySlug === cat.slug;
                  const hasFilters = cat.filters && cat.filters.length > 0;
                  return (
                    <div
                      key={cat.slug}
                      className="relative group"
                      onMouseEnter={hasFilters ? () => handleMouseEnter(cat.slug) : undefined}
                      onMouseLeave={hasFilters ? handleMouseLeave : undefined}
                    >
                      <Link
                        href={`/${cat.slug}`}
                        className={`px-3 py-1 text-sm transition-colors ${isActive ? '' : 'hover:text-gray-300'}`}
                        style={isActive ? activeLinkStyle : {}}
                      >
                        {cat.name}
                        {hasFilters && <span className="ml-1 text-xs">▼</span>}
                      </Link>

                      {hasFilters && openDropdown === cat.slug && (
                        <div
                          className="absolute left-0 mt-1 w-64 rounded shadow-lg z-30 border"
                          style={dropdownStyle}
                        >
                          {cat.filters.map((filter) => (
                            <div key={filter.type} className="py-1">
                              <span className="block px-4 pt-1 pb-0.5 text-xs font-semibold uppercase tracking-wider" style={{ color: currentTheme.text?.primary || '#fff'}}>{formatFilterName(filter.name)}</span>
                              <div className="grid grid-cols-2 gap-x-2 px-4 pb-1">
                                {filter.options.map((option) => {
                                  const filterSlug = slugify(filter.type);
                                  const optionSlug = slugify(option);
                                  const href = `/${cat.slug}/${filterSlug}/${optionSlug}`;
                                  const isFilterActive = router.asPath.includes(href);
                                  return (
                                    <Link
                                      key={optionSlug}
                                      href={href}
                                      className={`block py-0.5 text-xs rounded transition-colors ${isFilterActive ? 'text-pink-500 font-semibold' : 'hover:bg-gray-700'}`}
                                      onClick={handleMouseLeave}
                                    >
                                      {capitalizeString(option)}
                                    </Link>
                                  );
                                })}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })
            )}

            <div className="relative ml-4">
              <input 
                type="text" 
                placeholder="Search..." 
                className="px-3 py-1 rounded-full bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-pink-500 text-sm w-40"
              />
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center space-x-2">
            {/* Language Dropdown */}
            <div className="relative">
              <button 
                onClick={() => setIsLanguageOpen(!isLanguageOpen)}
                className="text-sm flex items-center justify-between border border-gray-700 rounded px-2 py-1 min-w-[120px]"
                style={buttonStyle}
              >
                <span>Select Language</span>
                <span className="ml-2">▼</span>
              </button>
              
              {isLanguageOpen && (
                <div 
                  className="absolute right-0 mt-1 w-40 rounded shadow-lg z-30"
                  style={dropdownStyle}
                >
                  {languages.map(lang => (
                    <button
                      key={lang.code}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-700 text-sm"
                      onClick={() => setIsLanguageOpen(false)}
                    >
                      {lang.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Login */}
            <Link
              href="/login"
              className="text-sm px-3 py-1.5 border border-gray-700 rounded"
              style={buttonStyle}
            >
              Login
            </Link>

            {/* Join Now */}
            <Link
              href="/join"
              className="text-sm px-3 py-1.5 rounded text-white"
              style={primaryButtonStyle}
            >
              Join Now for FREE
            </Link>

            {/* Theme Switcher Dropdown */}
            {/*
            <div className="relative">
              <select 
                value={theme} 
                onChange={handleThemeChange}
                className="text-sm px-3 py-1.5 border border-gray-700 rounded appearance-none focus:outline-none focus:border-pink-500 cursor-pointer"
                style={dropdownStyle}
              >
                <option value="" disabled>Select Theme</option>
                {availableThemes.map((themeKey) => (
                  <option key={themeKey} value={themeKey}>
                    {themeKey.charAt(0).toUpperCase() + themeKey.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            */}
          </div>
        </div>
      </Container>
    </nav>
  );
};

export default LegacyTopbar; 