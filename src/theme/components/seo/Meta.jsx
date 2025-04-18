import Head from 'next/head';
import { useRouter } from 'next/router';

const Meta = ({ 
  title, 
  description, 
  keywords,
  ogImage = '/images/og-default.jpg',
  ogType = 'website',
  canonical,
  noindex = false,
  children 
}) => {
  const router = useRouter();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://mistressworld.com';
  const currentUrl = `${siteUrl}${router.asPath}`;
  const canonicalUrl = canonical || currentUrl;

  // Default meta values
  const metaTitle = title ? `${title} | MistressWorld` : 'MistressWorld - Live Cam Models';
  const metaDesc = description || 'Watch live cam models perform on MistressWorld. Join now for the best live cam experience.';
  const metaKeywords = keywords || 'live cams, cam models, webcam models, live chat';

  return (
    <Head>
      <title>{metaTitle}</title>
      <meta name="description" content={metaDesc} />
      <meta name="keywords" content={metaKeywords} />
      
      {/* Canonical URL */}
      <link rel="canonical" href={canonicalUrl} />
      
      {/* Open Graph */}
      <meta property="og:title" content={metaTitle} />
      <meta property="og:description" content={metaDesc} />
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:image" content={`${siteUrl}${ogImage}`} />
      <meta property="og:site_name" content="MistressWorld" />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={metaTitle} />
      <meta name="twitter:description" content={metaDesc} />
      <meta name="twitter:image" content={`${siteUrl}${ogImage}`} />
      
      {/* Mobile Viewport */}
      <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
      
      {/* Robots */}
      {noindex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <meta name="robots" content="index, follow" />
      )}
      
      {/* Favicon */}
      <link rel="icon" href="/favicon.ico" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      
      {/* Additional meta tags */}
      {children}
    </Head>
  );
};

export default Meta; 