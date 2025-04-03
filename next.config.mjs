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
};

export default nextConfig;
