/**
 * MistressWorld Theme Configuration
 * Centralized configuration for colors, spacing, layout structure, and modules
 */

import { THEMES } from '@/context/ThemeContext';

// Site configuration
export const siteConfig = {
  name: 'MistressWorld',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://mistressworld.xxx',
  description: 'MistressWorld - The ultimate destination for live cam models and webcam shows',
  defaultTitle: 'MistressWorld - Live Cam Models & Webcam Shows',
  defaultImage: '/images/og-default.jpg',
  socials: {
    twitter: '@mistressworld',
    instagram: '@mistressworld_official',
    youtube: '@mistressworld'
  }
};

// Theme color palettes
export const themePalettes = {
  [THEMES.DARK]: {
    primary: '#16181c',
    secondary: '#1a1c21',
    accent: '#e0006c',
    text: {
      primary: '#ffffff',
      secondary: '#888888',
      accent: '#e0006c'
    },
    border: '#2d2d2d',
    button: {
      primary: '#e0006c',
      primaryHover: '#ff0080',
      secondary: '#2d2d2d',
      secondaryHover: '#3d3d3d'
    },
    status: {
      online: '#4caf50',
      offline: '#ff5252'
    },
    tag: {
      background: '#333333',
      text: '#ffffff',
      accent: '#e0006c'
    }
  },
  [THEMES.LIGHT]: {
    primary: '#ffffff',
    secondary: '#f5f5f5',
    accent: '#e0006c',
    text: {
      primary: '#16181c',
      secondary: '#4a4a4a',
      accent: '#e0006c'
    },
    border: '#e0e0e0',
    button: {
      primary: '#e0006c',
      primaryHover: '#ff0080',
      secondary: '#e0e0e0',
      secondaryHover: '#d0d0d0'
    },
    status: {
      online: '#4caf50',
      offline: '#ff5252'
    },
    tag: {
      background: '#e0e0e0',
      text: '#16181c',
      accent: '#e0006c'
    }
  },
  [THEMES.LEGACY_DARK]: {
    primary: '#1a1a1a',
    secondary: '#2a2a2a',
    accent: '#FF007A',
    navigation: {
      sidebar: '#1a1a1a',
      topbar: '#1a1a1a',
      active: '#FF007A',
      hover: '#FF007A',
    },
    card: {
      background: '#2a2a2a',
      hover: '#353535',
    },
    text: {
      primary: '#ffffff',
      secondary: '#b0b0b0',
      accent: '#FF007A'
    },
    border: '#333333',
    button: {
      primary: '#FF007A',
      primaryHover: '#ff3399',
      secondary: '#333333',
      secondaryHover: '#444444'
    },
    status: {
      online: '#4caf50',
      offline: '#ff5252'
    },
    tag: {
      background: '#333333',
      text: '#ffffff',
      accent: '#FF007A'
    }
  }
};

// Layout spacing and dimensions
export const layoutConfig = {
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    xxl: '3rem'
  },
  sidebar: {
    width: '16rem',
    mobileWidth: '100%'
  },
  header: {
    height: '4rem'
  },
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    xxl: '1536px'
  }
};

// Font configurations
export const fontConfig = {
  primary: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  secondary: "'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  sizes: {
    xs: '0.75rem',
    sm: '0.875rem',
    md: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    xxl: '1.5rem',
    h1: '2.25rem',
    h2: '1.875rem',
    h3: '1.5rem',
    h4: '1.25rem',
    h5: '1.125rem',
    h6: '1rem'
  }
};

// Standardized page module structure
export const pageModules = {
  header: {
    enabled: true,
    component: 'HeaderModule'
  },
  sidebar: {
    enabled: true,
    component: 'SidebarModule'
  },
  topText: {
    enabled: true,
    component: 'TopTextModule'
  },
  modelGrid: {
    enabled: true,
    component: 'ModelGridModule'
  },
  bottomText: {
    enabled: true,
    component: 'BottomTextModule'
  },
  relevantContent: {
    enabled: true,
    component: 'RelevantContentModule'
  },
  footer: {
    enabled: true,
    component: 'FooterModule'
  }
};

// API mappings
export const apiMappings = {
  modelProps: {
    awe: {
      id: 'id',
      name: 'nickname',
      thumbnail: 'snapshotUrl',
      age: 'age',
      isOnline: 'isOnline',
      viewerCount: 'viewers',
      country: 'country',
      tags: 'attributes'
    },
    free: {
      id: 'id',
      name: 'name',
      thumbnail: 'thumbnail',
      age: 'age',
      isOnline: 'online',
      viewerCount: 'viewers',
      country: 'country',
      tags: 'tags'
    },
    vpapi: {
      id: 'id',
      name: 'performerName',
      thumbnail: 'thumbnail',
      age: null,
      isOnline: null,
      viewerCount: null,
      country: null,
      tags: 'categories'
    }
  }
};

// Supported routes configuration
export const routeConfig = {
  // Primary routes
  primary: [
    { path: '/', name: 'Home', component: 'HomePage' },
    { path: '/girls', name: 'Girls', component: 'CategoryPage' },
    { path: '/trans', name: 'Trans', component: 'CategoryPage' },
    { path: '/free', name: 'Free', component: 'CategoryPage' },
    { path: '/videos', name: 'Videos', component: 'VideoPage' },
    { path: '/models/:slug', name: 'Model Profile', component: 'ModelProfilePage' },
    { path: '/blog/:slug', name: 'Blog', component: 'BlogPage' },
  ],
  // Dynamic category routes
  dynamic: [
    { path: '/[category]', component: 'CategoryPage' },
    { path: '/[category]/[subcategory]', component: 'SubcategoryPage' },
    { path: '/[category]/model/[slug]', component: 'ModelProfilePage' }
  ]
};

export default {
  siteConfig,
  themePalettes,
  layoutConfig,
  fontConfig,
  pageModules,
  apiMappings,
  routeConfig
}; 