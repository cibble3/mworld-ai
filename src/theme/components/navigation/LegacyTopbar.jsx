import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { THEMES, useTheme } from '@/context/ThemeContext';
import { themes } from '@/theme/config';
import Container from '../grid/Container';
import useCategories from '@/hooks/useCategories';
import { capitalizeString, slugify } from '@/utils/string-helpers';
import Drawer from "react-modern-drawer";
import "react-modern-drawer/dist/index.css";
import {
  IoLanguageOutline,
  IoMenuSharp,
  IoFemaleOutline,
  IoTransgenderOutline,
  IoVideocamOutline,
  IoLockOpenOutline,
  IoSearchOutline
} from 'react-icons/io5';
import { CiLogin } from "react-icons/ci";
import { FaUser } from 'react-icons/fa6';
import { IoMdClose } from 'react-icons/io';

const formatFilterName = (name) => {
  return capitalizeString(name.replace(/_/g, ' '));
};

const LegacyTopbar = () => {
  const { theme, setTheme, availableThemes } = useTheme();
  console.log('theme :>> ', theme);
  const router = useRouter();
  const { categories, isLoading, isError } = useCategories();

  const currentPathSegments = router.asPath.split('/').filter(Boolean);
  const currentMainCategorySlug = currentPathSegments[0];

  const defaultThemeKey = Object.keys(themes)[0];
  const currentThemeKey = availableThemes.includes(theme) ? theme : defaultThemeKey;
  const currentTheme = themes[currentThemeKey];

  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);

  const [isOpen, setIsOpen] = React.useState(false);
  const [openCategory, setOpenCategory] = useState(null);

  const getIcon = (slug) => {
    switch (slug) {
      case 'girls':
        return <IoFemaleOutline className="w-5 h-5 mr-2" />;
      case 'trans':
        return <IoTransgenderOutline className="w-5 h-5 mr-2" />;
      case 'free':
        return <IoLockOpenOutline className="w-5 h-5 mr-2" />;
      case 'videos':
        return <IoVideocamOutline className="w-5 h-5 mr-2" />;
      default:
        return null;
    }
  };

  const handleToggle = (slug) => {
    setOpenCategory(openCategory === slug ? null : slug);
  };

  const toggleDrawer = () => {
    setIsOpen((prevState) => !prevState);
  };

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
      className="fixed bg-background top-0 left-0 w-full h-16 z-20 shadow-md"
    // style={navStyle}
    >
      <Container fluid={true}>
        <div className="h-16 flex items-center justify-between gap-10">
          {/* Logo */}
          <div className="flex items-center ">
            <Link href="/" className="text-2xl font-bold flex items-center">
              <div className="w-10 text-textlight h-10 rounded-full bg-white flex items-center justify-center overflow-hidden mr-3">
                <span className="text-black font-bold text-lg">MW</span>
              </div>
              <span className="hidden md:block text-textblack">MistressWorld</span>
            </Link>
          </div>

          {/* Center Navigation & Search */}
          <div className="hidden text-textlight xl:flex flex-grow items-center justify-end xl:space-x-10 space-x-3">
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
                        className={`flex items-center px-3 py-2 text-sm font-medium transition-all duration-200 rounded-lg ${isActive
                          ? 'text-primary bg-primary/10'
                          : 'text-gray-300 hover:text-white hover:bg-gray-800/50'
                          }`}
                      >
                        {getIcon(cat.slug)}
                        {cat.name}
                        {hasFilters && (
                          <span className="ml-1.5 text-xs opacity-60 group-hover:opacity-100 transition-all duration-200 group-hover:rotate-180">▼</span>
                        )}
                      </Link>

                      {hasFilters && openDropdown === cat.slug && (
                        <div
                          className="absolute left-0 mt-2 w-72 rounded-xl shadow-2xl z-30 border border-gray-800/50 bg-gray-900/95 backdrop-blur-sm"
                          style={dropdownStyle}
                        >
                          {cat.filters.map((filter) => (
                            <div key={filter.type} className="py-2">
                              <span className="block px-4 pt-1 pb-2 text-xs font-semibold uppercase tracking-wider text-gray-400 border-b border-gray-800/50">
                                {formatFilterName(filter.name)}
                              </span>
                              <div className="grid grid-cols-2 gap-2 px-4 py-2">
                                {filter.options.map((option) => {
                                  const filterSlug = slugify(filter.type);
                                  const optionSlug = slugify(option);
                                  const href = `/${cat.slug}/${filterSlug}/${optionSlug}`;
                                  const isFilterActive = router.asPath.includes(href);
                                  return (
                                    <Link
                                      key={optionSlug}
                                      href={href}
                                      className={`block py-1.5 px-2 text-xs rounded-lg transition-all duration-200 ${isFilterActive
                                        ? 'bg-primary/10 text-primary font-medium ring-1 ring-primary/20'
                                        : 'text-gray-300 hover:text-white hover:bg-gray-800/30'
                                        }`}
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
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 rounded-xl bg-gray-800/50 text-gray-300 placeholder:text-gray-500 border border-gray-700/50 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 text-sm w-48 transition-all duration-200"
                />
                <IoSearchOutline className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              </div>
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center space-x-3">
            <div onClick={toggleDrawer} className="block xl:hidden text-textlight p-2 rounded-lg hover:bg-gray-800/50 transition-all duration-200">
              <IoMenuSharp fontSize={24} />
            </div>
            <Drawer
              open={isOpen}
              onClose={toggleDrawer}
              direction="left"
              className="!w-[280px] bg-gray-900/95 backdrop-blur-sm"
            >
              <div className="h-full flex flex-col">
                {/* Drawer Header */}
                <div className="p-4 border-b border-gray-800/50">
                  <div className="flex items-center justify-between">
                    <Link href="/" className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center overflow-hidden mr-3">
                        <span className="text-black font-bold text-lg">MW</span>
                      </div>
                      <span className="text-white font-bold">MistressWorld</span>
                    </Link>
                    <button
                      onClick={toggleDrawer}
                      className="p-2 rounded-lg hover:bg-gray-800/50 transition-all duration-200"
                    >
                      <IoMdClose className="text-white text-xl" />
                    </button>
                  </div>
                </div>

                {/* Drawer Content */}
                <div className="flex-1 overflow-y-auto p-4">
                  <ul className="space-y-2">
                    {isLoading ? (
                      <span className="text-sm text-gray-400">Loading Nav...</span>
                    ) : isError ? (
                      <span className="text-sm text-red-500">Error</span>
                    ) : (
                      categories
                        .filter((cat) => ["girls", "trans", "fetish", "free", "videos"].includes(cat.slug))
                        .map((cat) => {
                          const isActive = currentMainCategorySlug === cat.slug;
                          const hasFilters = cat.filters && cat.filters.length > 0;
                          const isOpen = openCategory === cat.slug;

                          return (
                            <div key={cat.slug} className="w-full">
                              <button
                                onClick={() => handleToggle(cat.slug)}
                                className={`flex items-center justify-between w-full px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${isActive
                                  ? 'text-primary bg-primary/10'
                                  : 'text-gray-300 hover:text-white hover:bg-gray-800/30'
                                  }`}
                              >
                                <div className="flex items-center">
                                  {getIcon(cat.slug)}
                                  {cat.name}
                                </div>
                                {hasFilters && (
                                  <span className={`text-xs transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>▼</span>
                                )}
                              </button>

                              {hasFilters && isOpen && (
                                <div className="mt-1 ml-4 space-y-2">
                                  {cat.filters.map((filter) => (
                                    <div key={filter.type} className="py-1">
                                      <span className="block px-3 py-1 text-xs font-semibold uppercase tracking-wider text-gray-400">
                                        {formatFilterName(filter.name)}
                                      </span>
                                      <div className="grid grid-cols-2 gap-2 px-3 py-2">
                                        {filter.options.map((option) => {
                                          const filterSlug = slugify(filter.type);
                                          const optionSlug = slugify(option);
                                          const href = `/${cat.slug}/${filterSlug}/${optionSlug}`;
                                          const isFilterActive = router.asPath.includes(href);

                                          return (
                                            <Link
                                              key={optionSlug}
                                              href={href}
                                              className={`block py-1.5 px-2 text-xs rounded-lg transition-all duration-200 ${isFilterActive
                                                ? 'bg-primary/10 text-primary font-medium'
                                                : 'text-gray-300 hover:text-white hover:bg-gray-800/30'
                                                }`}
                                              onClick={() => setOpenCategory(null)}
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
                  </ul>
                </div>

                {/* Drawer Footer */}
                <div className="p-4 border-t border-gray-800/50 space-y-3">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search..."
                      className="w-full pl-10 pr-4 py-2 rounded-xl bg-gray-800/30 text-gray-300 placeholder:text-gray-500 border border-gray-700/50 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 text-sm transition-all duration-200"
                    />
                    <IoSearchOutline className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  </div>
                  <div className="flex gap-2">
                    <Link
                      href="/login"
                      className="flex-1 px-4 py-2 text-sm font-medium rounded-xl border border-gray-700/50 bg-gray-800/30 text-gray-300 hover:bg-gray-800/50 hover:text-white transition-all duration-200 text-center"
                    >
                      Login
                    </Link>
                    <Link
                      href="/join"
                      className="flex-1 px-4 py-2 text-sm font-medium rounded-xl bg-primary text-white hover:bg-primary/90 transition-all duration-200 text-center"
                    >
                      Join Now
                    </Link>
                  </div>
                </div>
              </div>
            </Drawer>

            {/* Theme Dropdown */}
            {/* <div className="p-3 text-white">
              <select
                value={theme}
                onChange={(e) => setTheme(THEMES[e.target.value.toUpperCase()])}
                className="text-sm  p-1.5 rounded bg-primary"
              >
                {availableThemes.map((t) => (
                  <option key={t} value={t.toLowerCase()}>
                    {t}
                  </option>
                ))}
              </select>
            </div> */}

            {/* Language Selector */}
            <div className="relative">
              <button
                onClick={() => setIsLanguageOpen(!isLanguageOpen)}
                className="flex items-center justify-between px-4 py-2 text-sm font-medium rounded-xl border border-gray-700/50 bg-gray-800/50 text-gray-300 hover:bg-gray-800/80 hover:text-white transition-all duration-200 group"
              >
                <div className="flex items-center">
                  <IoLanguageOutline className="mr-2 text-lg" />
                </div>
                <span className="ml-2 text-xs opacity-60 group-hover:rotate-180 transition-all duration-200">▼</span>
              </button>

              {isLanguageOpen && (
                <div
                  className="absolute right-0 mt-2 w-48 rounded-xl shadow-2xl z-30 border border-gray-800/50 bg-gray-900/95 backdrop-blur-sm"
                  style={dropdownStyle}
                >
                  {languages.map((lang, index) => (
                    <button
                      key={lang.code}
                      className={`block w-full text-left px-4 py-2.5 text-sm transition-all duration-200 ${index === 0 ? 'rounded-t-xl' : index === languages.length - 1 ? 'rounded-b-xl' : ''
                        } text-gray-300 hover:text-white hover:bg-gray-800/30`}
                      onClick={() => setIsLanguageOpen(false)}
                    >
                      <div className="flex items-center">
                        <span className="w-6 h-6 rounded-full bg-gray-800/30 flex items-center justify-center mr-3 text-xs font-medium">
                          {lang.code.toUpperCase()}
                        </span>
                        {lang.name}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Login Button */}
            <Link
              href="/login"
              className="px-4 py-2 text-sm font-medium rounded-xl border border-gray-700/50 bg-gray-800/50 text-gray-300 hover:bg-gray-800/80 hover:text-white transition-all duration-200"
            >
              <div className="hidden md:block">Login</div>
              <div className="md:hidden block">
                <CiLogin className="text-lg" />
              </div>
            </Link>

            {/* Join Now Button */}
            <Link
              href="/join"
              className="px-4 py-2 text-sm font-medium rounded-xl bg-primary text-white hover:bg-primary/90 transition-all duration-200"
            >
              <div className="hidden 2xl:block">Join Now for FREE</div>
              <div className="2xl:hidden block">
                <FaUser className="text-lg" />
              </div>
            </Link>
          </div>
        </div>
      </Container>
    </nav>
  );
};

export default LegacyTopbar; 