import React, { useState } from 'react';
import Link from 'next/link';
import Container from '../grid/Container';
import { useTheme, THEMES } from '@/context/ThemeContext';
import { themes } from '../../config';

const ModernTopbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const currentTheme = themes[theme] || themes[THEMES.DARK];

  if (!currentTheme) {
    console.error(`Theme not found for key: ${theme} in ModernTopbar. Falling back to dark theme.`);
    return <nav className="h-16 bg-[#16181c] border-b border-gray-800 w-full"></nav>;
  }

  // Ensure visibility with explicit styling
  const navStyles = {
    backgroundColor: currentTheme.secondary || '#1a1c21',
    borderColor: currentTheme.border || '#2d3748',
    width: '100%',
    height: '4rem',
    zIndex: 50
  };

  const linkStyles = {
    color: currentTheme?.text?.primary || '#ffffff',
  };
  
  const menuStyle = {
    backgroundColor: currentTheme?.dropdown?.background || '#1a1a1a',
    borderColor: currentTheme?.border || '#2d3748',
  };

  return (
    <nav className="border-b shadow-md w-full" style={navStyles}>
      <Container>
        <div className="h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold hover:text-pink-500" style={linkStyles}>
            MistressWorld
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link 
              href="/girls" 
              className="hover:text-pink-500 transition-colors"
              style={linkStyles}
            >
              Girls
            </Link>
            <Link 
              href="/trans" 
              className="hover:text-pink-500 transition-colors"
              style={linkStyles}
            >
              Trans
            </Link>
            
            <Link 
              href="/videos" 
              className="hover:text-pink-500 transition-colors"
              style={linkStyles}
            >
              Videos
            </Link>
            <Link 
              href="/blog" 
              className="hover:text-pink-500 transition-colors"
              style={linkStyles}
            >
              Blog
            </Link>
            
            {/* Theme Switcher Buttons */}
            {/* 
            <div className="flex space-x-1 bg-gray-800 p-1 rounded ml-2">
              <button
                onClick={() => changeTheme(THEMES.DARK)}
                className={`p-1 rounded ${theme === THEMES.DARK ? 'bg-gray-700' : ''}`}
                title="Modern Dark Theme"
              >
                🌙
              </button>
              <button
                onClick={() => changeTheme(THEMES.LIGHT)}
                className={`p-1 rounded ${theme === THEMES.LIGHT ? 'bg-gray-700' : ''}`}
                title="Modern Light Theme"
              >
                🌞
              </button>
              <button
                onClick={() => changeTheme(THEMES.LEGACY_DARK)}
                className={`p-1 rounded ${theme === THEMES.LEGACY_DARK ? 'bg-gray-700' : ''}`}
                title="Legacy Dark Theme"
              >
                🏛️
              </button>
            </div>
            */}
            
            <Link 
              href="/join" 
              className="bg-pink-600 hover:bg-pink-700 text-white px-6 py-2 rounded-md transition-colors"
            >
              Join Now
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-4">
            {/* Mobile Theme Switcher */}
            {/*
            <div className="flex space-x-1 bg-gray-800 p-1 rounded ml-2">
              <button
                onClick={() => changeTheme(THEMES.DARK)}
                className={`p-1 rounded ${theme === THEMES.DARK ? 'bg-gray-700' : ''}`}
                title="Modern Dark Theme"
              >
                🌙
              </button>
              <button
                onClick={() => changeTheme(THEMES.LIGHT)}
                className={`p-1 rounded ${theme === THEMES.LIGHT ? 'bg-gray-700' : ''}`}
                title="Modern Light Theme"
              >
                🌞
              </button>
              <button
                onClick={() => changeTheme(THEMES.LEGACY_DARK)}
                className={`p-1 rounded ${theme === THEMES.LEGACY_DARK ? 'bg-gray-700' : ''}`}
                title="Legacy Dark Theme"
              >
                🏛️
              </button>
            </div>
            */}

            <button 
              className="p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              style={linkStyles}
            >
              {/* SVG Icon */}
              <svg 
                className="w-6 h-6" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                {isMenuOpen ? (
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M6 18L18 6M6 6l12 12" 
                  />
                ) : (
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M4 6h16M4 12h16M4 18h16" 
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 absolute left-0 right-0 bg-[#1a1c21] z-50 border-b border-gray-800">
            <div className="flex flex-col space-y-4 px-4">
              <Link 
                href="/girls" 
                className="hover:text-pink-500 px-4 py-2"
                style={linkStyles}
                onClick={() => setIsMenuOpen(false)}
              >
                Girls
              </Link>
              <Link 
                href="/trans" 
                className="hover:text-pink-500 px-4 py-2"
                style={linkStyles}
                onClick={() => setIsMenuOpen(false)}
              >
                Trans
              </Link>
              <Link 
                href="/videos" 
                className="hover:text-pink-500 px-4 py-2"
                style={linkStyles}
                onClick={() => setIsMenuOpen(false)}
              >
                Videos
              </Link>
              <Link 
                href="/blog" 
                className="hover:text-pink-500 px-4 py-2"
                style={linkStyles}
                onClick={() => setIsMenuOpen(false)}
              >
                Blog
              </Link>
              <Link 
                href="/join" 
                className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-md transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Join Now
              </Link>
            </div>
          </div>
        )}
      </Container>
    </nav>
  );
};

export default ModernTopbar;