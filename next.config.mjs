import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // i18n: {
  //   locales: ["default", "en", "de", "fr", "da", "es", "is", "it", "nl", "sv"], // Add more locales if needed
  //   defaultLocale: "default",
  // },
  // async redirects() {
  //   return [
  //     {
  //       source: "/tranny",
  //       destination: "/trans",
  //       permanent: true,
  //     },
  //     {
  //       source: "/tranny/asian",
  //       destination: "/trans/asian",
  //       permanent: true,
  //     },
  //     {
  //       source: "/TS",
  //       destination: "/trans",
  //       permanent: true,
  //     },
  //     {
  //       source: "/lsl/sex-cams",
  //       destination: "/girls",
  //       permanent: true,
  //     },
  //     {
  //       source: "/lsl/mistress",
  //       destination: "/",
  //       permanent: true,
  //     },
  //     {
  //       source: "/girls/bbw/free/girls/bbw",
  //       destination: "/girls/bbw",
  //       permanent: true,
  //     },
  //     {
  //       source: "/girls/free/girls/bbw",
  //       destination: "/girls/bbw",
  //       permanent: true,
  //     },
  //     {
  //       source: "/free/asian",
  //       destination: "/free/girls/asian",
  //       permanent: true,
  //     },
  //     {
  //       source: "/free/bbw",
  //       destination: "/free/girls/bbw",
  //       permanent: true,
  //     },
  //     {
  //       source: "/free/bigboobs",
  //       destination: "/free/girls/bigboobs",
  //       permanent: true,
  //     },
  //     {
  //       source: "/free/latina",
  //       destination: "/free/girls/latina",
  //       permanent: true,
  //     },
  //     {
  //       source: "/free/milf",
  //       destination: "/free/girls/milf",
  //       permanent: true,
  //     },
  //     {
  //       source: "/free/shemale",
  //       destination: "/free/trans",
  //       permanent: true,
  //     },
  //     {
  //       source: "/free/smallboobs",
  //       destination: "/free/girls/smallboobs",
  //       permanent: true,
  //     },
  //     {
  //       source: "/en",
  //       destination: "/",
  //       permanent: true,
  //     },
  //     {
  //       source: "/en/girls",
  //       destination: "/girls",
  //       permanent: true,
  //     },
  //     {
  //       source: "/:lang(en|fr|de|es|it|nl|sv|da|is)/:page",
  //       destination: "/[lang]/[page]",
  //     },
  //     {
  //       source: "/:lang(en)/free/:category(girl)",
  //       destination: "/[lang]/free/:category",
  //     },
  //   ];
  // },
  async rewrites() {
    return [
      // API route special handling
      {
        source: '/api/models/fetish',
        destination: '/api/models/fetish',
      },
      {
        source: "/:lang(en|fr|de|es|it|nl|sv|da|is)/:page",
        destination: "/[lang]/[page]",
      },
      {
        source: "/:lang(en)/free/:category(girl)",
        destination: "/[lang]/free/:category",
      },
    ];
  },
  async redirects() {
    return [
      // Redirect singular 'girl' to plural 'girls'
      {
        source: '/girl/:subcategory',
        destination: '/girls/:subcategory',
        permanent: true,
      },
      {
        source: '/girl',
        destination: '/girls',
        permanent: true,
      },
      
      // Fetish path redirects - new mixed API approach
      {
        source: '/free/fetish',
        destination: '/fetish',
        permanent: true,
      },
      {
        source: '/free/fetish/:slug',
        destination: '/fetish/:slug',
        permanent: true,
      },
      
      // Redirect old path-based filtering to new query parameter filtering
      {
        source: '/girls/asian',
        destination: '/girls?ethnicity=asian',
        permanent: true,
      },
      {
        source: '/girls/ebony',
        destination: '/girls?ethnicity=ebony',
        permanent: true,
      },
      {
        source: '/girls/latina',
        destination: '/girls?ethnicity=latina',
        permanent: true,
      },
      {
        source: '/girls/blonde',
        destination: '/girls?hair_color=blonde',
        permanent: true,
      },
      {
        source: '/girls/brunette',
        destination: '/girls?hair_color=brunette',
        permanent: true,
      },
      {
        source: '/girls/teen',
        destination: '/girls?tags=teen',
        permanent: true,
      },
      {
        source: '/girls/milf',
        destination: '/girls?tags=milf',
        permanent: true,
      },
      {
        source: '/girls/bbw',
        destination: '/girls?tags=bbw',
        permanent: true,
      },
      {
        source: '/girls/mature',
        destination: '/girls?tags=mature',
        permanent: true,
      },
      {
        source: '/girls/fetish',
        destination: '/girls?tags=fetish',
        permanent: true,
      },
      {
        source: "/tranny",
        destination: "/trans",
        permanent: true,
      },
      {
        source: "/tranny/asian",
        destination: "/trans/asian",
        permanent: true,
      },
      {
        source: "/TS",
        destination: "/trans",
        permanent: true,
      },
      {
        source: "/lsl/sex-cams",
        destination: "/girls",
        permanent: true,
      },
      {
        source: "/lsl/mistress",
        destination: "/",
        permanent: true,
      },
      {
        source: "/girls/bbw/free/girls/bbw",
        destination: "/girls/bbw",
        permanent: true,
      },
      {
        source: "/girls/free/girls/bbw",
        destination: "/girls/bbw",
        permanent: true,
      },
      {
        source: "/free/asian",
        destination: "/free/girls/asian",
        permanent: true,
      },
      {
        source: "/free/bbw",
        destination: "/free/girls/bbw",
        permanent: true,
      },
      {
        source: "/free/bigboobs",
        destination: "/free/girls/bigboobs",
        permanent: true,
      },
      {
        source: "/free/latina",
        destination: "/free/girls/latina",
        permanent: true,
      },
      {
        source: "/free/milf",
        destination: "/free/girls/milf",
        permanent: true,
      },
      {
        source: "/free/shemale",
        destination: "/free/trans",
        permanent: true,
      },
      {
        source: "/free/smallboobs",
        destination: "/free/girls/smallboobs",
        permanent: true,
      },
      {
        source: "/en/trans",
        destination: "/trans",
        permanent: true,
      },
      // Redirect old path-based filtering to new query parameter filtering for trans
      {
        source: '/trans/asian',
        destination: '/trans?ethnicity=asian',
        permanent: true,
      },
      {
        source: '/trans/ebony',
        destination: '/trans?ethnicity=ebony',
        permanent: true,
      },
      {
        source: '/trans/latina',
        destination: '/trans?ethnicity=latina',
        permanent: true,
      },
      {
        source: '/trans/blonde',
        destination: '/trans?hair_color=blonde',
        permanent: true,
      },
      {
        source: '/trans/brunette',
        destination: '/trans?hair_color=brunette',
        permanent: true,
      },
      {
        source: '/trans/teen',
        destination: '/trans?tags=teen',
        permanent: true,
      },
      {
        source: '/trans/milf',
        destination: '/trans?tags=milf',
        permanent: true,
      },
      {
        source: '/trans/bbw',
        destination: '/trans?tags=bbw',
        permanent: true,
      },
      {
        source: '/trans/fetish',
        destination: '/trans?tags=fetish',
        permanent: true,
      },
      // Only keep basic redirection 
      {
        source: '/free',
        destination: '/free/girls',
        permanent: false,
      },
    ];
  },
  images: {
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.wmcdpt.com',
        port: '',
        pathname: '/**',
      },
      // Add vcmdiawe.com domains for model images
      {
        protocol: 'https',
        hostname: '**.vcmdiawe.com',
        port: '',
        pathname: '/**',
      },
      // Add specific numbered gallery domains for VPAPI
      {
        protocol: 'https',
        hostname: 'galleryn0.vcmdiawe.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'galleryn1.vcmdiawe.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'galleryn2.vcmdiawe.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'galleryn3.vcmdiawe.com',
        port: '',
        pathname: '/**',
      },
      // Add wmctjd.com domains for VPAPI target URLs
      {
        protocol: 'https',
        hostname: '**.wmctjd.com',
        port: '',
        pathname: '/**',
      },
      // Add wptcd.com for VPAPI details URLs
      {
        protocol: 'https',
        hostname: 'wptcd.com',
        port: '',
        pathname: '/**',
      },
      // Add thumb.live.mmcdn.com for Chaturbate free models
      {
        protocol: 'https',
        hostname: 'thumb.live.mmcdn.com',
        port: '',
        pathname: '/**',
      },
      // Add placehold.co for placeholder images
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      // Add picsum.photos for photo placeholders
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
      // Add loremflickr.com for model placeholders
      {
        protocol: 'https', 
        hostname: 'loremflickr.com',
        port: '',
        pathname: '/**',
      },
      // Add any other domains needed here
      // e.g., for placeholders or other APIs
      // {
      //   protocol: 'https',
      //   hostname: 'example.com',
      //   port: '',
      //   pathname: '/**',
      // }
    ],
    domains: [
      'picsum.photos', // For development placeholders
      'partner-api.awempire.com', // AWE API
      'images.livejasmin.com', // LiveJasmin images
      'static-assets.awempire.com', // Static AWE assets
      'chaturbate.com', // Chaturbate
      'www.chaturbate.com', // Chaturbate www subdomain
      'static-us.xvideoslive.com', // Chaturbate alternative domain
      'static-eu.xvideoslive.com', // Chaturbate EU domain
      'static-gals.xilovespass.com', // Another static domain
      'cdn-image.mistressworld.xxx', // Our CDN (for future use)
      'mistressworld.xxx', // Our domain
      'www.mistressworld.xxx', // Our www subdomain
      'localhost', // Local development
    ],
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 3600, // 1 hour cache
    // For performance and to avoid visible resizing/shifting
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840], // Device widths
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384], // Image widths
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  webpack: (config, { isServer }) => {
    // Fixes npm packages that depend on `fs` module
    if (!isServer) {
      config.resolve.fallback = {
        fs: false,
        path: false,
      };
    }

    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\\.[jt]sx?$/,
      use: ['@svgr/webpack'],
    });

    return config;
  },
  // async headers() {
  //   return [
  //     {
  //       // matching all API routes
  //       source: "/api/:path*",
  //       headers: [
  //         { key: "Access-Control-Allow-Credentials", value: "true" },
  //         { key: "Access-Control-Allow-Origin", value: "*" },
  //         { key: "Access-Control-Allow-Methods", value: "GET,OPTIONS,PATCH,DELETE,POST,PUT" },
  //         { key: "Access-Control-Allow-Headers", value: "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version" },
  //       ]
  //     }
  //   ]
  // }
  trailingSlash: false,
};

export default nextConfig;
