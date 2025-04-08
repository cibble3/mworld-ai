import React from 'react';
import Meta from '../components/seo/Meta';
import Container from '../components/grid/Container';
import Footer from '@/components/layout/Footer';
import { useTheme } from '@/context/ThemeContext';
import TopText from '../components/content/TopText';
import BottomContent from '../components/content/BottomContent';
import DynamicSidebar from '@/components/navigation/DynamicSidebar';
import DarkHeader from '@/components/navigation/dark-themeLive/DarkHeader';
import CookiesModal from '@/components/CookiesModal/CookiesModal';
// import { useConfig } from "@/context/ConfigContext";

/**
 * ModernLayout - The main layout component used by the React developer
 * Uses the DarkHeader component with all styled icons and dropdowns
 */
const ModernLayout = ({ 
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
  // const { layouts } = useConfig();

  return (
    <>
      <Meta {...meta} />
      <CookiesModal />
      
      <div 
        className={`min-h-screen flex flex-col bg-[#16181c] text-white ${className}`}
        {...props}
      >
        {/* Use the finished header component with icons */}
        <DarkHeader />

        {/* App Layout with fixed sidebar and scrollable content */}
        <div className="flex pt-16 min-h-screen w-full">
          {/* Sidebar - fixed on large screens */}
          <aside className="fixed left-0 top-16 w-64 h-[calc(100vh-4rem)] bg-[#1a1a1a] overflow-y-auto z-30 border-r border-gray-800/30 lg:block hidden">
            <DynamicSidebar />
          </aside>

          {/* Main content area with left margin to account for sidebar */}
          <main className="flex-grow w-full lg:pl-64">
            {/* Use fluid=true to make container full width */}
            <Container {...containerProps} fluid={true} className="py-6 px-4">
              {title && description && (
                <TopText title={title} description={description} />
              )}
              
              {/* Main Page Content (e.g., ModelGrid) */}
              {children}
              
              {bottomContentChildren && (
                <BottomContent>
                  {bottomContentChildren}
                </BottomContent>
              )}
            </Container>
            
            {/* Footer */}
            <Footer className="bg-[#1a1a1a] border-t border-gray-800" />
          </main>
        </div>
      </div>
    </>
  );
};

export default ModernLayout; 