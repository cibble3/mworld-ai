import { THEMES } from '@/context/ThemeContext';

export const themes = {
  [THEMES.DARK]: {
    primary: '#16181c',
    secondary: '#1a1c21',
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
    }
  },
  [THEMES.LIGHT]: {
    primary: '#ffffff',
    secondary: '#f5f5f5',
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
    }
  },
  [THEMES.LEGACY_DARK]: {
    primary: '#1a1a1a',
    secondary: '#2a2a2a',
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

// Layout configurations for different themes
export const layouts = {
  [THEMES.DARK]: {
    sidebar: false,
    topNavigation: true,
  },
  [THEMES.LIGHT]: {
    sidebar: false,
    topNavigation: true,
  },
  [THEMES.LEGACY_DARK]: {
    sidebar: true,
    topNavigation: true,
    sidebarWidth: '260px',
    topbarHeight: '70px',
  }
};

// Standardized subcategories that can be used across all types
const standardSubcategories = [
  { id: 'asian', label: 'Asian' },
  { id: 'ebony', label: 'Ebony' },
  { id: 'latina', label: 'Latina' },
  { id: 'teen', label: 'Teen' },
  { id: 'milf', label: 'Milf' },
  { id: 'blonde', label: 'Blonde' },
  { id: 'brunette', label: 'Brunette' },
  { id: 'bbw', label: 'BBW' },
  { id: 'big-tits', label: 'Big Tits' },
  { id: 'small-tits', label: 'Small Tits' },
  { id: 'fetish', label: 'Fetish' },
  { id: 'anal', label: 'Anal' },
  { id: 'squirting', label: 'Squirting' },
  { id: 'lesbians', label: 'Lesbians' },
  { id: 'couples', label: 'Couples' },
  { id: 'athletic', label: 'Athletic' }
];

// Category configuration for sidebar
export const categoryConfig = {
  // Main categories (top level)
  main: [
    { id: 'girls', label: 'Girls', href: '/girls' },
    { id: 'trans', label: 'Trans', href: '/trans' }
  ],
  
  // Subcategories with standardized paths
  subcategories: {
    // Girls subcategories
    girls: standardSubcategories.map(cat => ({
      ...cat,
      href: `/girls/${cat.id}`
    })),
    
    // Trans subcategories
    trans: standardSubcategories.map(cat => ({
      ...cat,
      href: `/trans/${cat.id}`
    })),
    
    // Free girls subcategories
    'free-girls': standardSubcategories.map(cat => ({
      ...cat,
      href: `/free/girls/${cat.id}`
    })),
    
    // Free trans subcategories
    'free-trans': standardSubcategories.map(cat => ({
      ...cat,
      href: `/free/trans/${cat.id}`
    })),
    
    // Video categories
    videos: [
      { id: 'popular', label: 'Popular', href: '/videos/popular' },
      { id: 'new', label: 'New', href: '/videos/new' },
      { id: 'amateur', label: 'Amateur', href: '/videos/amateur' },
      { id: 'fetish', label: 'Fetish', href: '/videos/fetish' },
      { id: 'lesbian', label: 'Lesbian', href: '/videos/lesbian' },
      { id: 'milf', label: 'MILF', href: '/videos/milf' },
      { id: 'trans', label: 'Trans', href: '/videos/trans' },
      { id: 'anal', label: 'Anal', href: '/videos/anal' }
    ]
  },
  
  // Sidebar sections
  sections: [
    { id: 'categories', label: 'Categories', expandable: true },
    { 
      id: 'free', 
      label: 'Free Cams', 
      expandable: true,
      subsections: [
        { id: 'free-girls', label: 'Girls', href: '/free/girls' },
        { id: 'free-trans', label: 'Trans', href: '/free/trans' }
      ]
    },
    { 
      id: 'videos', 
      label: 'Videos', 
      href: '/videos',
      expandable: true 
    },
    { id: 'blog', label: 'Blog', href: '/blog', expandable: false },
    { id: 'models-wanted', label: 'Models Wanted', href: '/models-wanted', expandable: false },
    { id: 'affiliates', label: 'Affiliates', href: '/affiliates', expandable: false }
  ],
  
  // Sidebar configuration
  sidebar: {
    showLogo: true,
    expandedByDefault: ['categories'],
    width: '16rem' // 64px in rem
  }
};