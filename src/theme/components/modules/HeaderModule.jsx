import React from 'react';
import LegacyTopbar from '../navigation/LegacyTopbar';

/**
 * HeaderModule - Unified header component.
 * Always renders the LegacyTopbar for consistency.
 */
const HeaderModule = ({ 
  logoOnly = false,
  hideSearch = false,
  customClass = '',
  isMobileMenuOpen = false,
  toggleMobileMenu = () => {}
}) => {
  // No theme check needed, always use LegacyTopbar
  const HeaderComponent = LegacyTopbar; 
  
  return (
    <header
      data-mw-module="header"
      className={`fixed top-0 left-0 right-0 z-50 ${customClass}`}
    >
      <HeaderComponent
        logoOnly={logoOnly}
        hideSearch={hideSearch}
        isMobileMenuOpen={isMobileMenuOpen}
        toggleMobileMenu={toggleMobileMenu}
      />
    </header>
  );
};

export default HeaderModule; 