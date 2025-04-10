import React from 'react';
import { useTheme } from '@/context/ThemeContext';
import UnifiedLayout from './UnifiedLayout';
import HeadMeta from '@/components/HeadMeta';
import ErrorBoundary from '@/components/common/ErrorBoundary';
import ENV from '@/config/environment';
import { useRouter } from 'next/router';

/**
 * ThemeLayout - Wrapper for UnifiedLayout.
 * Handles basic setup and passes props down.
 */
const ThemeLayout = ({ children, meta = {}, ...props }) => {
  const { theme } = useTheme();
  const router = useRouter();
  
  if (ENV.IS_DEV) {
    console.log(`[ThemeLayout] Rendering with theme: ${theme}, path: ${router.asPath}`);
  }

  // Convert simple meta object to full pageContent format if needed
  const pageContent = meta.meta_title ? meta : {
    meta_title: meta.title || props.title || "MistressWorld",
    meta_desc: meta.description || props.description || "Live cam models and videos",
    meta_keywords: meta.keywords || "",
    top_text: meta.top_text || "",
    canonicalUrl: meta.canonicalUrl || "",
    ogImage: meta.ogImage || "",
    schema: meta.schema || null
  };

  // Extract title and description
  const { title, description, ...otherProps } = props;
  
  const commonElements = (
    <>
      <HeadMeta pageContent={pageContent} />
    </>
  );
  
  return (
    <>
      {commonElements}
      <ErrorBoundary>
        <UnifiedLayout 
          {...otherProps}
          title={title}
          description={description}
          meta={pageContent}
        >
          {children}
        </UnifiedLayout>
      </ErrorBoundary>
    </>
  );
};

export default ThemeLayout; 