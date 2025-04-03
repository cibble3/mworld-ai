import React, { createContext, useState, useContext } from 'react';

const PageLoaderContext = createContext();

export const PageLoaderProvider = ({ children }) => {
  const [pageLoader, setPageLoader] = useState(false);
  const [loaderText, setLoaderText] = useState('Loading...');

  const showLoader = (text = 'Loading...') => {
    setLoaderText(text);
    setPageLoader(true);
  };

  const hideLoader = () => {
    setPageLoader(false);
  };

  return (
    <PageLoaderContext.Provider 
      value={{ 
        pageLoader, 
        setPageLoader, 
        loaderText, 
        setLoaderText,
        showLoader,
        hideLoader
      }}
    >
      {children}
    </PageLoaderContext.Provider>
  );
};

export const usePageLoader = () => useContext(PageLoaderContext);

export default PageLoaderContext;
