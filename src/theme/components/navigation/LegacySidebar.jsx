import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useTheme } from '@/context/ThemeContext';
import { themes } from '../../config';
import Image from 'next/image';
import { useLanguage } from "@/context/LanguageContext";
import useCategories from '@/hooks/useCategories';
import { capitalizeString, slugify } from '@/utils/string-helpers';
import axios from 'axios';

// Helper function to format filter names (e.g., 'body_size' -> 'Body Size')
// Consider moving this to string-helpers if used elsewhere
const formatFilterName = (name) => {
  return capitalizeString(name.replace(/_/g, ' '));
};

const LegacySidebar = () => {
  const router = useRouter();
  const { theme } = useTheme();
  const { translations } = useLanguage();

  // Use the new hook to fetch categories
  const { categories, isLoading, isError, error: categoryError } = useCategories();

  // Determine the current main category based on the route
  // Example: /girls/asian -> mainCategorySlug = 'girls'
  // Example: /videos -> mainCategorySlug = 'videos'
  const currentPathSegments = router.asPath.split('/').filter(Boolean);
  const currentMainCategorySlug = currentPathSegments[0] || 'girls'; // Default to 'girls' if root path

  const currentTheme = themes[theme] || themes["legacyDark"];

  // State for expanded filter sections (e.g., { girls: { ethnicity: true, age: false }, videos: { category: true } })
  const [expandedFilters, setExpandedFilters] = useState({});

  const fetchData = async () => {
    try {
      const res = await axios.get('/api/models?extractAttributes=true')
      console.log('resdata :>> ', res);
    } catch (error) {
      console.log('error :>> ', error);
    }
  }
  useEffect(() => {
    fetchData()
  }, [])
  // Initialize expanded state when categories load
  useEffect(() => {
    if (categories.length > 0) {
      const initialExpansion = {};
      categories.forEach(cat => {
        initialExpansion[cat.slug] = {}; // Initialize category expansion object
        // Optionally pre-expand certain filter types
        cat.filters?.forEach(filter => {
          // Example: Pre-expand 'ethnicity' and 'category' filters
          initialExpansion[cat.slug][filter.type] = ['ethnicity', 'category'].includes(filter.type);
        });
      });
      setExpandedFilters(initialExpansion);
    }
  }, [categories]);

  // Toggle filter sections within a category
  const toggleFilterSection = (categorySlug, filterType) => {
    setExpandedFilters(prev => ({
      ...prev,
      [categorySlug]: {
        ...prev[categorySlug],
        [filterType]: !prev[categorySlug]?.[filterType]
      }
    }));
  };

  // Handle loading state or missing config
  if (!translations || !currentTheme) {
    return <div className="fixed top-16 left-0 h-[calc(100vh-4rem)] lg:block hidden w-64 bg-gray-800 animate-pulse"></div>;
  }

  // Style variables
  const sidebarStyle = {
    backgroundColor: currentTheme.navigation?.sidebar || currentTheme.primary || '#1a1a1a',
    color: currentTheme.text?.primary || '#ffffff',
    borderRight: `1px solid ${currentTheme.border || '#333'}`,
  };

  const activeLinkStyle = {
    backgroundColor: currentTheme.navigation?.active || currentTheme.button?.primary || '#e0006c',
    color: '#fff',
  };

  const buttonStyle = {
    backgroundColor: currentTheme.navigation?.sectionHeader || '#333', // Use a theme color
    color: currentTheme.text?.primary || '#ffffff', // Ensure text is visible
  };

  const linkStyle = {
    color: currentTheme.text?.secondary || '#ccc', // Use a secondary text color for links
  };

  const activeFilterLinkStyle = { // Specific style for active filter options
    // Example: Add a background or bolder text
    backgroundColor: currentTheme.navigation?.activeSubtle || 'rgba(224, 0, 108, 0.2)', // Lighter active background
    color: currentTheme.text?.primary || '#ffffff', // Ensure text remains visible
    fontWeight: 'bold', // Example: Make active filter bold
  };

  // --- Render Logic ---
  if (isLoading) {
    return <div style={sidebarStyle} className="fixed top-16 left-0 h-[calc(100vh-4rem)] lg:flex hidden w-64  items-center justify-center animate-pulse"><p>Loading Nav...</p></div>;
  }
  if (isError) {
    console.error("Error loading categories:", categoryError);
    return <div style={sidebarStyle} className="fixed top-16 left-0 h-[calc(100vh-4rem)] lg:flex hidden w-64  items-center justify-center"><p className="text-red-500">Error loading navigation.</p></div>;
  }

  // Find the current category object based on the slug
  const currentCategory = categories.find(cat => cat.slug === currentMainCategorySlug);
  console.log('currentCategory :>> ', currentCategory);
  return (
    <aside
      className="h-full fixed left-0 top-0 pt-16 w-64 overflow-y-auto z-10"
      style={sidebarStyle}
    >
      {/* Logo */}
      <div className="flex justify-center py-4">
        <Link href="/" className="block">
          <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center overflow-hidden">
            <span className="text-black font-bold text-xl">MW</span>
          </div>
        </Link>
      </div>

      {/* Main Category Links */}
      <div className="flex flex-col mb-4">
        {categories.map((cat) => {
          // Skip categories we don't want to show in sidebar
          if (['girls', 'trans', 'fetish', 'videos'].includes(cat.slug)) { // Adjust as needed
            const href = `/${cat.slug}`;
            const isActive = currentMainCategorySlug === cat.slug;
            return (
              <Link
                key={cat.id}
                href={href}
                className={`py-3 px-4 text-left transition-colors ${isActive ? 'text-white' : 'hover:bg-gray-700'
                  }`}
                style={isActive ? activeLinkStyle : linkStyle}
              >
                {cat.name}
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
        {currentCategory?.filters?.map((filter) => (
          <div key={filter.type} className="mb-2">
            <button
              className="w-full px-4 py-2 text-left flex justify-between items-center rounded text-sm" // Smaller text for filters
              onClick={() => toggleFilterSection(currentCategory.slug, filter.type)}
              style={buttonStyle}
            >
              <span>{formatFilterName(filter.name)}</span>
              <span>{expandedFilters[currentCategory.slug]?.[filter.type] ? '▲' : '▼'}</span>
            </button>
            {expandedFilters[currentCategory.slug]?.[filter.type] && (
              <div className="mt-1 pl-4"> {/* Indent filter options */}
                {filter.options.map((option) => {
                  // Construct href: /girls/ethnicity/asian
                  const filterSlug = slugify(filter.type); // e.g. ethnicity
                  const optionSlug = slugify(option); // e.g. asian
                  const href = `/${currentCategory.slug}/${filterSlug}/${optionSlug}`;

                  // Check if this specific filter option is active in the URL
                  // Example URL: /girls/ethnicity/asian/age/teen
                  const urlSegments = router.asPath.split('/');
                  const isActive = urlSegments.includes(filterSlug) && urlSegments.includes(optionSlug);

                  return (
                    <Link
                      key={optionSlug}
                      href={href}
                      className={`block px-2 py-1.5 rounded transition-colors text-xs ${ // Even smaller text for options
                        isActive ? '' : 'hover:bg-gray-700' // Apply hover only if not active
                        }`}
                      style={isActive ? { ...linkStyle, ...activeFilterLinkStyle } : linkStyle} // Combine base link style with active style
                    >
                      {capitalizeString(option)}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        ))}

        {/* Static Links (can be adjusted or moved) */}
        <div className="mt-6 border-t pt-4" style={{ borderColor: currentTheme.border || '#333' }}>
          <Link
            href={"/blog"}
            className={`block px-4 py-2 rounded transition-colors ${router.asPath.startsWith('/blog') ? 'text-white' : 'hover:bg-gray-700'
              }`}
            style={router.asPath.startsWith('/blog') ? activeLinkStyle : linkStyle}
          >
            Blog
          </Link>
          <Link
            href={"/models-wanted"}
            className={`block px-4 py-2 rounded transition-colors ${router.asPath === '/models-wanted' ? 'text-white' : 'hover:bg-gray-700'
              }`}
            style={router.asPath === '/models-wanted' ? activeLinkStyle : linkStyle}
          >
            Models Wanted
          </Link>
          {/* Add other static links like Affiliates */}
        </div>

      </div>
    </aside>
  );
};

export default LegacySidebar; 