import "@/styles/globals.css";
// import "../styles/bootstrap.min.css";
// import "../styles/style.css";
// import "../styles/responsive.css";

import { Provider } from "react-redux";
import { store } from "@/store/store";
import { LanguageProvider } from "@/context/LanguageContext";
import { ThemeProvider, THEMES } from "@/context/ThemeContext";
import { PageLoaderProvider } from "@/context/PageLoaderContext";
import PageTransition from "@/components/common/PageTransition";
import Script from "next/script";
import React from 'react';

// Analytics IDs
const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_ID || "G-P9GVSQ4CFR";

/**
 * GlobalStylesManager component ensures proper styling is applied
 * and diagnoses any style-related issues
 */
const GlobalStylesManager = ({ children }) => {
  // Removed useEffect logic - handled by ThemeProvider and globals.css
  return <>{children}</>;
};

export default function App({ Component, pageProps }) {
  // Get initial theme, default to DARK if not provided or invalid
  const initialTheme = pageProps.initialTheme || THEMES.DARK;
  if (process.env.NODE_ENV === 'development') {
    console.log('[App] initialTheme :>> ', initialTheme);
  }

  // No global layout wrapper needed here; pages use UnifiedLayout directly
  const getLayout = (page) => page;

  return (
    <Provider store={store}>
      <ThemeProvider initialTheme={initialTheme}>
        <LanguageProvider>
          <PageLoaderProvider>
            {/* Apply the global layout */}
            {getLayout(
              <PageTransition>
                <Component {...pageProps} />
              </PageTransition>
            )}
            
            {/* Global Analytics Scripts */}
            <Script
              strategy="lazyOnload"
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
            />
            <Script id="google-analytics" strategy="lazyOnload">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_MEASUREMENT_ID}');
              `}
            </Script>
            {/* <Script id="tawktodirect" strategy="afterInteractive">
              {`
                 var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
                  (function(){
                  var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
                  s1.async=true;
                  s1.src='https://embed.tawk.to/63b8b700c2f1ac1e202ba9de/1gm09o5lh';
                  s1.charset='UTF-8';
                  s1.setAttribute('crossorigin','*');
                  s0.parentNode.insertBefore(s1,s0);
                  })();
                  `}
            </Script> */}
            {/* Temporarily comment out TikTok pixel script to fix errors */}
            {/* <Script id="tiktokpixel" strategy="afterInteractive">
              {` ... `}
            </Script> */}
          </PageLoaderProvider>
        </LanguageProvider>
      </ThemeProvider>
    </Provider>
  );
}
