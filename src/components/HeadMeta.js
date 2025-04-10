import LanguageContext from "@/context/LanguageContext";
import Head from "next/head";
import { useRouter } from "next/router";
import { useContext, useMemo } from "react";
import ENV from "@/config/environment";

/**
 * Enhanced HeadMeta component that handles dynamic SEO metadata
 * including JSON-LD schema markup
 */
const HeadMeta = ({ pageContent }) => {
  const router = useRouter();
  const { asPath } = router;
  const siteUrl = typeof window !== "undefined" ? window.location.origin : ENV.SITE_URL;
  const { selectedLanguage } = useContext(LanguageContext);
  const canonicalUrl = pageContent?.canonicalUrl || (typeof siteUrl !== "undefined" ? siteUrl + asPath : "");

  // Create JSON-LD schema markup
  const schemaMarkup = pageContent?.schema || {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": pageContent?.meta_title,
    "description": pageContent?.meta_desc,
    "url": canonicalUrl
  };

  return (
    <Head>
      <title>{pageContent?.meta_title}</title>
      <meta name="description" content={pageContent?.meta_desc} />
      <meta name="Rating" content="Mature" />
      <meta name="dc.language" content="US" />
      <meta name="keywords" content={pageContent?.meta_keywords} />
      <meta name="robots" content="index, follow" />
      <meta name="theme-color" content="#3d3d3d" />
      <meta
        name="preconnect"
        content={ENV.PRE_CONNECT_URL}
      />

      {/* <!--DC meta tags--> */}
      <meta name="dc.source" content={canonicalUrl} />
      <meta name="dc.title" content={pageContent?.meta_title} />
      <meta property="dc.keywords" content={pageContent?.meta_keywords} />
      <meta name="dc.subject" content={pageContent?.meta_title} />
      <meta name="dc.description" content={pageContent?.meta_desc} />
      
      {/* <!--item prop--> */}
      <meta itemProp="name" content={pageContent?.meta_title} />
      <meta itemProp="description" content={pageContent?.meta_desc} />
      <meta itemProp="image" content={pageContent?.ogImage || ""} />
      
      {/* <!--Facebook meta tags--> */}
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="mistressworld.xxx" />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={pageContent?.meta_title} />
      <meta property="og:description" content={pageContent?.meta_desc} />
      <meta property="og:image" content={pageContent?.ogImage || ""} />
      
      {/* <!--Twitter meta cards--> */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@mistressworld" />
      <meta name="twitter:creator" content="@mistressworld" />
      <meta name="twitter:title" content={pageContent?.meta_title} />
      <meta name="twitter:description" content={pageContent?.meta_desc} />
      <meta name="twitter:image" content={pageContent?.ogImage || ""} />
      
      {/* Canonical URL */}
      <link rel="canonical" href={canonicalUrl.replace(/\/$/, "")} />
      
      {/* Preconnect to CDNs */}
      <link rel="preconnect" href={ENV.CDN_URL} />
      <link rel="preconnect" href="https://galleryn5.vcmdiawe.com" />
      <link rel="preconnect" href="https://galleryn4.vcmdiawe.com" />
      <link rel="preconnect" href="https://galleryn3.vcmdiawe.com" />
      <link rel="preconnect" href="https://galleryn2.vcmdiawe.com" />
      <link rel="preconnect" href="https://galleryn1.vcmdiawe.com" />
      <link rel="preconnect" href={ENV.PRE_CONNECT_URL} />
      <link rel="preconnect" href="https://www.googletagmanager.com" />
      
      {/* JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaMarkup) }}
      />
    </Head>
  );
};

export default HeadMeta;
