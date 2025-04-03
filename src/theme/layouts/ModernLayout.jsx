import React from 'react';
import Meta from '../components/seo/Meta';
import Container from '../components/grid/Container';
import ModernTopbar from '../components/navigation/ModernTopbar';
import Footer from '@/components/layout/Footer';
import { useTheme } from '@/context/ThemeContext';
import TopText from '../components/content/TopText';
import BottomContent from '../components/content/BottomContent';
// import { useConfig } from "@/context/ConfigContext";

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
      
      <div 
        className={`min-h-screen flex flex-col ${className}`} 
        style={{
          backgroundColor: 'var(--primary-bg)',
          color: 'var(--text-primary)',
        }}
        {...props}
      >
        {/* Header */}
        <ModernTopbar />

        {/* Main content area */}
        <main className="flex-grow">
          <Container {...containerProps}>
            <TopText title={title} description={description} />
            
            {/* Main Page Content (e.g., ModelGrid) */}
            {children}
            
            <BottomContent>
              {bottomContentChildren}
            </BottomContent>
          </Container>
        </main>

        {/* Footer */}
        <Footer style={{
          backgroundColor: 'var(--secondary-bg)',
          borderColor: 'var(--border-color)',
        }} />
      </div>
    </>
  );
};

export default ModernLayout; 