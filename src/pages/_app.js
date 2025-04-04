import "@/styles/globals.css";
// import "../styles/bootstrap.min.css";
// import "../styles/style.css";
// import "../styles/responsive.css";

import { Provider } from "react-redux";
import { store } from "@/store/store";
import { LanguageProvider } from "@/context/LanguageContext";
import { ThemeProvider, THEMES } from "@/context/ThemeContext";
import { PageLoaderProvider } from "@/context/PageLoaderContext";
import Layout from "@/components/layout/Layout";
import ThemeLayout from "@/theme/layouts/ThemeLayout";
import Script from "next/script";

// Analytics IDs
const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_ID || "G-P9GVSQ4CFR";

export default function App({ Component, pageProps }) {
  // Check if the page has a custom layout
  // Use ThemeLayout as default wrapper for all pages
  const getLayout = Component.getLayout || ((page) => <ThemeLayout>{page}</ThemeLayout>);

  // --- TEMPORARY: Render component directly without layout --- 
  // const getLayout = (page) => page;
  // --- END TEMPORARY ---

  // Get initial theme from query param or cookies (SSR-friendly way)
  const initialTheme = pageProps.initialTheme || THEMES.RETRO;
  console.log('initialTheme :>> ', initialTheme);
  return (
    <>
      {/* Google Analytics */}
      <Script
        strategy="afterInteractive"
        async
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}');
          `,
        }}
      />
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
      <Script id="tiktokpixel" strategy="afterInteractive">
        {`
         !function (w, d, t) {
                    w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var i="https://analytics.tiktok.com/i18n/pixel/events.js";ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=i,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};var o=document.createElement("script");o.type="text/javascript",o.async=!0,o.src=i+"?sdkid="+e+"&lib="+t;var a=document.getElementsByTagName("script")[0];a.parentNode.insertBefore(o,a)};
                  
                    ttq.load('CS5R69BC77U6GM4H3L8G');
                    ttq.page();
            `}
      </Script>

      {/* Application Providers */}
      <Provider store={store}>
        <ThemeProvider initialTheme={initialTheme}>
          <LanguageProvider>
            <PageLoaderProvider>
              {getLayout(<Component {...pageProps} />)}
            </PageLoaderProvider>
          </LanguageProvider>
        </ThemeProvider>
      </Provider>
    </>
  );
}
