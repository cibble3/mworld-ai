import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useTheme } from '@/context/ThemeContext';
import Image from 'next/image';
import { useLanguage } from "@/context/LanguageContext";
import useCategories from '@/hooks/useCategories';
import { capitalizeString, slugify } from '@/utils/string-helpers';

// Helper function to format filter names (e.g., 'body_size' -> 'Body Size')
const formatFilterName = (name) => {
  return capitalizeString(name.replace(/_/g, ' '));
};

const LegacySidebar = ({ onClose }) => {
  // --- HOOKS MUST BE CALLED AT THE TOP LEVEL --- 
  const router = useRouter();
  const { themeConfig } = useTheme();
  const { translations } = useLanguage();
  const { categories, isLoading, isError, error: categoryError } = useCategories();
  const [expandedFilters, setExpandedFilters] = useState({});

  // --- EFFECTS --- 
  useEffect(() => {
    // Initialize expanded filters state once categories are loaded
    if (categories.length > 0) {
      const initialExpansion = {};
      categories.forEach(cat => {
        initialExpansion[cat.slug] = {};
        cat.filters?.forEach(filter => {
          initialExpansion[cat.slug][filter.type] = ['ethnicity', 'category'].includes(filter.type);
        });
      });
      setExpandedFilters(initialExpansion);
    }
  }, [categories]); // Only re-run if categories change

  // --- EARLY RETURNS for loading/error states --- 
  if (isLoading || (!categories && !isError)) {
    // Show loading indicator if loading OR if data isn't available yet and there's no error
    return (
      <div 
        style={{
          backgroundColor: themeConfig?.palette?.background?.dark || '#1a1a1a',
          borderRight: `1px solid ${themeConfig?.palette?.border || '#333'}`
        }}
        className="fixed top-16 left-0 h-[calc(100vh-4rem)] lg:flex hidden w-64 items-center justify-center animate-pulse"
      >
        <p style={{ color: themeConfig?.palette?.text?.primary || '#fff' }}>Loading Nav...</p>
      </div>
    );
  }
  
  // --- Early return for error state --- 
  if (isError) {
    console.error("Error loading categories:", categoryError);
    return (
      <div 
        style={{
          backgroundColor: themeConfig?.palette?.background?.dark || '#1a1a1a',
          borderRight: `1px solid ${themeConfig?.palette?.border || '#333'}`
        }}
        className="fixed top-16 left-0 h-[calc(100vh-4rem)] lg:flex hidden w-64 items-center justify-center"
      >
        <p className="text-red-500">Error loading navigation.</p>
      </div>
    );
  }
  
  // --- If we reach here, data is loaded and there's no error --- 

  // Extract the first path segment for determining the current category
  const firstPathSegment = router.pathname.split('/')[1] || '';
  const currentMainCategorySlug = firstPathSegment || 'home'; 

  const currentTheme = themeConfig.palette;
  const currentNavTheme = themeConfig.navigation || {};

  // Find the current category object
  const currentCategory = categories.find(cat => cat.slug === currentMainCategorySlug);

  // Function to toggle filter sections
  const toggleFilterSection = (categorySlug, filterType) => {
    setExpandedFilters(prev => ({
      ...prev,
      [categorySlug]: {
        ...prev[categorySlug],
        [filterType]: !prev[categorySlug]?.[filterType]
      }
    }));
  };

  // Function to handle mobile sidebar close
  const handleClick = () => {
    if (onClose) {
      onClose();
    }
  };

  if (!translations || !currentTheme) {
    return <div className="fixed top-16 left-0 h-[calc(100vh-4rem)] lg:block hidden w-64 bg-gray-800 animate-pulse"></div>;
  }

  const sidebarStyle = {
    backgroundColor: currentNavTheme.sidebar || currentTheme.background?.dark || currentTheme.primary || '#1a1a1a',
    color: currentTheme.text?.primary || '#ffffff',
    borderRight: `1px solid ${currentTheme.border || '#333'}`,
  };

  const activeLinkStyle = {
    backgroundColor: currentTheme.navigation?.active || currentTheme.button?.primary || '#e0006c',
    color: '#fff',
  };

  const buttonStyle = {
    backgroundColor: currentTheme.navigation?.sectionHeader || '#333',
    color: currentTheme.text?.primary || '#ffffff',
  };

  const linkStyle = {
    color: currentTheme.text?.secondary || '#ccc',
  };

  const activeFilterLinkStyle = {
    backgroundColor: currentTheme.navigation?.activeSubtle || 'rgba(224, 0, 108, 0.2)',
    color: currentTheme.text?.primary || '#ffffff',
    fontWeight: 'bold',
  };

  return (
    <aside
      className="h-full fixed left-0 top-0 pt-16 w-64 overflow-y-auto z-50"
      style={sidebarStyle}
    >
      {/* Logo */}
      <div className="flex justify-center py-4">
        <Link href="/" className="block" onClick={handleClick}>
          <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center overflow-hidden">
            <span className="text-black font-bold text-xl">MW</span>
          </div>
        </Link>
      </div>

      {/* Main Category Links */}
      <div className="flex flex-col mb-4">
        {categories && Array.isArray(categories) && categories.map((cat) => {
          // Only render categories that should appear as main links
          const shouldRenderLink = ['girls', 'trans', 'fetish', 'videos'].includes(cat.slug);
          if (shouldRenderLink) { 
            const href = `/${cat.slug}`;
            const isActive = currentMainCategorySlug === cat.slug;
            return (
              <Link
                key={cat.slug}
                href={href}
                className={`py-3 px-4 text-left transition-colors ${isActive ? 'text-white' : 'hover:bg-gray-700'}`}
                style={isActive ? activeLinkStyle : linkStyle}
                onClick={handleClick}
              >
                {cat.name || cat.title}
              </Link>
            );
          }
          return null;
        })}
      </div>

      {/* Filters for the Current Main Category */}
      <div className="px-2">
        {currentCategory && currentCategory.filters && currentCategory.filters.length > 0 && (
          <h3 className="px-4 py-2 text-sm font-semibold uppercase tracking-wider" style={{ color: currentTheme.text?.secondary || '#aaa' }}>
            Filters
          </h3>
        )}
        {currentCategory?.filters?.map((filter) => {
          const isExpanded = expandedFilters[currentCategory.slug]?.[filter.type];

          return (
          <div key={`${currentCategory.slug}-${filter.type}`} className="mb-2">
            <button
              className="w-full px-4 py-2 text-left flex justify-between items-center rounded text-sm"
              onClick={() => toggleFilterSection(currentCategory.slug, filter.type)}
              style={buttonStyle}
            >
              <span>{formatFilterName(filter.name)}</span>
              <span>{isExpanded ? '▲' : '▼'}</span>
            </button>
            {isExpanded && (
              <div className="mt-1 pl-4">
                {filter.optionsWithUrls && filter.optionsWithUrls.map((optionObj) => {
                  const href = optionObj.url;
                  const displayName = optionObj.displayName;
                  const optionName = optionObj.name;

                  // Check active state using router.query
                  const isActive = router.query[filter.type] === optionName;
                  
                  return (
                    <Link
                      key={`${filter.type}-${optionName}`}
                      href={href}
                      className={`block px-2 py-1.5 rounded transition-colors text-xs ${ 
                        isActive ? '' : 'hover:bg-gray-700'
                      }`}
                      style={isActive ? { ...linkStyle, ...activeFilterLinkStyle } : linkStyle}
                      onClick={handleClick}
                    >
                      {displayName.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        );
        })}

        {/* Static Links */}
        <div className="mt-6 border-t pt-4" style={{ borderColor: currentTheme.border || '#333' }}>
          <Link
            href={"/blog"}
            className={`block px-4 py-2 rounded transition-colors ${router.asPath.startsWith('/blog') ? 'text-white' : 'hover:bg-gray-700'}`}
            style={router.asPath.startsWith('/blog') ? activeLinkStyle : linkStyle}
            onClick={handleClick}
          >
            Blog
          </Link>
          <Link
            href={"/models-wanted"}
            className={`block px-4 py-2 rounded transition-colors ${router.asPath === '/models-wanted' ? 'text-white' : 'hover:bg-gray-700'}`}
            style={router.asPath === '/models-wanted' ? activeLinkStyle : linkStyle}
            onClick={handleClick}
          >
            Models Wanted
          </Link>
        </div>
      </div>
    </aside>
  );
};

export default LegacySidebar;