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
import { IoLanguageOutline, IoMenuSharp } from 'react-icons/io5';
import { CiLogin } from "react-icons/ci";
import { FaUser } from 'react-icons/fa6';

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
          <div className="hidden text-textlight xl:flex flex-grow items-center justify-end xl:space-x-10  space-x-3">
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
                        className={`px-3 py-1 text-md transition-colors ${isActive ? 'text-primary' : 'hover:text-gray-300 text-textSecondary'}`}
                      // style={isActive ? activeLinkStyle : {}}
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
                              <span className="block px-4 pt-1 pb-0.5 text-xs font-semibold uppercase tracking-wider" style={{ color: currentTheme.text?.primary || '#fff' }}>{formatFilterName(filter.name)}</span>
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
                className="px-3 py-1 rounded-full bg-secondary text-textlight placeholder:text-textlight  border border-gray-700 focus:outline-none focus:border-primary text-sm w-40"
              />
            </div>
          </div>





          {/* Right Actions */}
          <div className="flex items-center space-x-2">
            <div onClick={toggleDrawer} className="block xl:hidden text-textlight">
              <IoMenuSharp fontSize={24} />
            </div>
            <Drawer
              open={isOpen}
              onClose={toggleDrawer}
              direction="left"
              className="bla bla bla"
            >
              <div>
                <ul className="flex flex-col items-start p-5 gap-5 text-xl h-full text-lightgray font-semibold">
                  {isLoading ? (
                    <span className="text-sm">Loading Nav...</span>
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
                              className={`flex justify-between w-full px-3 py-1 text-md transition-colors ${isActive ? "" : "hover:text-gray-300"}`}
                              style={isActive ? activeLinkStyle : {}}
                            >
                              {cat.name}
                              {hasFilters && <span className="ml-1 text-xs">{isOpen ? "▲" : "▼"}</span>}
                            </button>

                            {hasFilters && isOpen && (
                              <div className="mt-1 w-full rounded shadow-lg border p-2">
                                {cat.filters.map((filter) => (
                                  <div key={filter.type} className="py-1">
                                    <span className="block px-4 pt-1 pb-0.5 text-xs font-semibold uppercase tracking-wider">
                                      {formatFilterName(filter.name)}
                                    </span>
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
                                            className={`block py-0.5 text-xs rounded transition-colors ${isFilterActive ? "text-pink-500 font-semibold" : "hover:bg-gray-700"
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

            <div className="relative text-white ">
              <button
                onClick={() => setIsLanguageOpen(!isLanguageOpen)}
                className="text-sm flex items-center justify-between border border-gray-700 rounded px-2 py-1.5 2xl:min-w-[120px] "
                style={buttonStyle}
              >
                <span className='2xl:block hidden'>Select Language</span>
                <span className='2xl:hidden block'><IoLanguageOutline /></span>
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
              className="text-sm px-3 py-1.5 border text-white border-gray-700 rounded"
              style={buttonStyle}
            >
              <div className='md:block hidden' > Login</div>
              <div className='md:hidden block py-1' > <CiLogin /></div>
            </Link>

            {/* Join Now */}
            <Link
              href="/join"
              className="md:text-sm text-[10px] px-3 py-1.5 rounded text-white bg-primary"
            // style={primaryButtonStyle}
            >

              <div className='md:block hidden' >    Join Now for FREE</div>
              <div className='md:hidden block py-1.5' > <FaUser /></div>
            </Link>
          </div>
        </div>
      </Container>
    </nav>
  );
};

export default LegacyTopbar; 