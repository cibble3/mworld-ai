import React, { useState, useEffect } from 'react';
import { useTheme } from '@/context/ThemeContext';
import { useRouter } from 'next/router';
import Meta from '../components/seo/Meta';
import Container from '../components/grid/Container';
import { 
  HeaderModule, 
  SidebarModule, 
  TopTextModule, 
  BottomTextModule,
  FooterModule 
} from '../components/modules';
import ErrorBoundary from '@/components/common/ErrorBoundary';
import CookiesModal from '@/components/CookiesModal/CookiesModal';
import PageTransition from '@/components/common/PageTransition';

/**
 * UnifiedLayout - The standardized layout component that provides a consistent
 * structure across all pages using modular components.
 * 
 * This layout follows the required structure:
 * - header_module
 * - sidebar_module
 * - toptext_module
 * - [main content]
 * - bottomText_module
 * - relevantContent_module (optional)
 * - footer_module
 */
const UnifiedLayout = ({
  children,
  meta = {},
  containerProps = {},
  className = '',
  title,
  description,
  bottomContentChildren,
  ...props
}) => {
  const { theme } = useTheme();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [layoutMounted, setLayoutMounted] = useState(false);
  
  // Use effect to add CSS class to body for theme
  useEffect(() => {
    document.body.classList.add('mw-app');
    document.body.classList.add(`theme-${theme}`);
    
    setLayoutMounted(true);
    
    return () => {
      document.body.classList.remove('mw-app');
      document.body.classList.remove(`theme-${theme}`);
    };
  }, [theme]);

  // Close mobile menu on route change
  useEffect(() => {
    const handleRouteChange = () => {
      setMobileMenuOpen(false);
    };

    router.events.on('routeChangeStart', handleRouteChange);
    
    return () => {
      router.events.off('routeChangeStart', handleRouteChange);
    };
  }, [router]);

  const isRouterReady = router.isReady;

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setMobileMenuOpen(prevState => !prevState);
  };

  // Simplified meta handling
  const pageContent = {
    meta_title: meta.title || title || "MistressWorld",
    meta_desc: meta.description || description || "Live cam models and videos",
  };

  if (!layoutMounted) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <>
      {/* Meta tags for SEO */}
      <Meta {...pageContent} />

      {/* Main application wrapper */}
      <div
        className={`min-h-screen flex flex-col ${className}`}
        data-theme={theme}
        {...props}
      >
        {/* Header Module */}
        <HeaderModule 
          isMobileMenuOpen={mobileMenuOpen}
          toggleMobileMenu={toggleMobileMenu}
        />

        {/* Desktop Sidebar */}
        <div className="desktop-sidebar">
          <SidebarModule />
        </div>
          
        {/* Mobile Sidebar - only rendered when mobile menu is open */}
        {mobileMenuOpen && (
          <div className="mobile-sidebar">
            <SidebarModule 
              mobile={true}
              onClose={() => setMobileMenuOpen(false)} 
            />
          </div>
        )}

        {/* Main content area with sidebar offset for proper alignment */}
        <main className="flex-grow pt-16 pb-8">
          <Container {...containerProps} fluid={true}>
            {/* Optional Cookies Modal */}
            <CookiesModal />

            {/* Use PageTransition directly inside main content area */}
            <PageTransition isLoading={!isRouterReady}>
              {/* Top Text Module */}
              <TopTextModule 
                title={title} 
                description={description}
                html={meta.top_text} 
              />

              {/* Main Page Content */}
              <ErrorBoundary>
                <div className="py-4 w-full">
                  {children}
                </div>
              </ErrorBoundary>

              {/* Bottom Content Module */}
              {bottomContentChildren && (
                <BottomTextModule>
                  {bottomContentChildren}
                </BottomTextModule>
              )}
            </PageTransition>
          </Container>
        </main>

        {/* Footer Module */}
        <FooterModule showSidebar={true} />
      </div>
    </>
  );
};

export default UnifiedLayout; 