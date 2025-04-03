import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTheme } from '@/context/ThemeContext';
import { LAYOUT_TYPES } from '../ContentGrid';

/**
 * ModelCard - Card component for displaying model information
 * 
 * @param {Object} props
 * @param {Object} props.item - Model data
 * @param {string} props.layout - Layout type (grid, list, compact, featured)
 * @param {number} props.index - Index of the card in the grid
 * @returns {JSX.Element}
 */
const ModelCard = ({ 
  // Support for new API
  item,
  layout = LAYOUT_TYPES.GRID, 
  index = 0,
  
  // Legacy support for home.js and other pages
  image, 
  name: legacyName, 
  age, 
  tags: legacyTags, 
  ethnicity, 
  slug: legacySlug,
  isPageFree = false,
  preload = false,
  isRelated = false,
  
  // Support for Free API
  element
}) => {
  const { themeConfig } = useTheme();
  
  // Debug logs
  console.log('[ModelCard] Props received:', { element, item, legacyName });
  
  // Get theme config with fallbacks
  const defaultTheme = {
    palette: {
      background: { card: '#232530', dark: '#1a1c23' },
      text: { primary: '#ffffff', secondary: '#a0aec0', light: '#ffffff' },
      primary: '#E0006C',
      success: '#4caf50',
      error: '#f44336'
    },
    typography: {
      h3: { fontSize: '1.125rem', lineHeight: '1.75rem' },
      h4: { fontSize: '1rem', lineHeight: '1.5rem' },
      body: { fontSize: '0.875rem', lineHeight: '1.25rem' },
      small: { fontSize: '0.75rem', lineHeight: '1rem' }
    },
    borderRadius: {
      sm: '0.25rem',
      md: '0.5rem',
      lg: '0.75rem'
    },
    shadows: {
      md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
    },
    components: {
      button: {
        borderRadius: '0.375rem',
        fontSize: '0.875rem'
      }
    },
    transitions: {
      standard: 'all 0.3s ease'
    }
  };
  
  // Merge available theme config with defaults
  const theme = {
    palette: {
      background: { 
        card: themeConfig?.palette?.background?.card || defaultTheme.palette.background.card,
        dark: themeConfig?.palette?.background?.dark || defaultTheme.palette.background.dark
      },
      text: {
        primary: themeConfig?.palette?.text?.primary || defaultTheme.palette.text.primary,
        secondary: themeConfig?.palette?.text?.secondary || defaultTheme.palette.text.secondary,
        light: themeConfig?.palette?.text?.light || defaultTheme.palette.text.light
      },
      primary: themeConfig?.palette?.primary || defaultTheme.palette.primary,
      success: themeConfig?.palette?.success || defaultTheme.palette.success,
      error: themeConfig?.palette?.error || defaultTheme.palette.error
    },
    typography: {
      h3: {
        fontSize: themeConfig?.typography?.h3?.fontSize || defaultTheme.typography.h3.fontSize,
        lineHeight: themeConfig?.typography?.h3?.lineHeight || defaultTheme.typography.h3.lineHeight
      },
      h4: {
        fontSize: themeConfig?.typography?.h4?.fontSize || defaultTheme.typography.h4.fontSize,
        lineHeight: themeConfig?.typography?.h4?.lineHeight || defaultTheme.typography.h4.lineHeight
      },
      body: {
        fontSize: themeConfig?.typography?.body?.fontSize || defaultTheme.typography.body.fontSize,
        lineHeight: themeConfig?.typography?.body?.lineHeight || defaultTheme.typography.body.lineHeight
      },
      small: {
        fontSize: themeConfig?.typography?.small?.fontSize || defaultTheme.typography.small.fontSize,
        lineHeight: themeConfig?.typography?.small?.lineHeight || defaultTheme.typography.small.lineHeight
      }
    },
    borderRadius: {
      sm: themeConfig?.borderRadius?.sm || defaultTheme.borderRadius.sm,
      md: themeConfig?.borderRadius?.md || defaultTheme.borderRadius.md,
      lg: themeConfig?.borderRadius?.lg || defaultTheme.borderRadius.lg
    },
    shadows: {
      md: themeConfig?.shadows?.md || defaultTheme.shadows.md
    },
    components: {
      button: {
        borderRadius: themeConfig?.components?.button?.borderRadius || defaultTheme.components.button.borderRadius,
        fontSize: themeConfig?.components?.button?.fontSize || defaultTheme.components.button.fontSize
      }
    },
    transitions: {
      standard: themeConfig?.transitions?.standard || defaultTheme.transitions.standard
    }
  };
  
  // Support both element (for FreeAPI), item object and individual props
  const modelData = element || item || {
    name: legacyName,
    preview: image,
    slug: legacySlug,
    tags: legacyTags || [],
    // Map legacy props to item structure
    id: legacySlug || `model-${index}`,
    category: isPageFree ? 'free' : 'girls',
    provider: 'awe'
  };
  
  // Extract model data with fallbacks
  const {
    id,
    slug: modelSlug,
    name: modelName,
    performerName,
    preview,
    previewImage,
    images,
    thumbnail,
    category,
    primaryCategory,
    isLive = false,
    isOnline: modelOnline,
    tags = [],
    provider = 'awe',
    _provider
  } = modelData;
  
  // Use name with fallbacks
  const name = legacyName || performerName || modelName || "Model";
  
  // Use slug with fallbacks
  const slug = legacySlug || modelSlug || id;
  
  // Use online status with fallback
  const isOnline = modelOnline || isLive || false;
  
  // Determine the provider
  const providerSource = _provider || provider || 'awe';
  
  // Handle fallback image for legacy usage with multiple fallbacks
  const imageUrl = 
    image || 
    preview || 
    previewImage || 
    thumbnail || 
    (images?.thumbnail) || 
    (images?.preview) || 
    `https://picsum.photos/300/384?random=${index+1}`;
  
  // Determine category with fallbacks
  const modelCategory = category || primaryCategory || 'model';
  
  // Generate link URL based on model data
  const getModelUrl = () => {
    // For free provider, create the appropriate URL
    if (providerSource === 'free') {
      return `/free/model/${slug || id}`;
    }
    
    // Determine base path based on category
    const basePath = modelCategory || 'model';
    
    // Generate full URL
    return `/${basePath}/${slug || id}`;
  };
  
  // Define consistent styling for fetish model cards
  const cardStyle = {
    card: {
      borderRadius: '8px',
      backgroundColor: '#232530',
      overflow: 'hidden',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    },
    cardHover: {
      transform: 'translateY(-5px)',
      boxShadow: '0 10px 15px rgba(0, 0, 0, 0.2)',
    },
    imageContainer: {
      position: 'relative',
      paddingBottom: '133.33%', // 3:4 aspect ratio
      overflow: 'hidden',
      backgroundColor: '#1a1c23',
    },
    image: {
      objectFit: 'cover',
      objectPosition: 'center top',
    },
    infoContainer: {
      padding: '10px',
      flexGrow: 1,
      backgroundColor: '#232530',
    },
    name: {
      fontSize: '16px',
      fontWeight: 'bold',
      color: '#ffffff',
      marginBottom: '5px',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    },
    tagsContainer: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '4px',
    },
    tag: {
      fontSize: '11px',
      padding: '2px 6px',
      borderRadius: '4px',
      backgroundColor: '#E0006C',
      color: '#ffffff',
    }
  };
  
  // Conditionally render components based on layout
  const renderContent = () => {
    switch (layout) {
      case LAYOUT_TYPES.LIST:
        return renderListLayout();
      case LAYOUT_TYPES.COMPACT:
        return renderCompactLayout();
      case LAYOUT_TYPES.FEATURED:
        return renderFeaturedLayout();
      case LAYOUT_TYPES.GRID:
      default:
        return renderGridLayout();
    }
  };
  
  // Render grid layout (default)
  const renderGridLayout = () => (
    <Link href={getModelUrl()} className="block w-full md:w-1/2 lg:w-1/3 xl:w-1/4 p-2">
      <div 
        className="h-full rounded-md overflow-hidden transition-all duration-300 hover:shadow-md"
        style={{ 
          backgroundColor: theme.palette.background.card,
          borderRadius: theme.borderRadius.md, 
          height: '100%'
        }}
      >
        {/* Image */}
        <div className="relative aspect-[3/4] bg-gray-200">
          <Image
            src={imageUrl}
            alt={name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover"
            loading={preload ? "eager" : "lazy"}
            // Add blur placeholder or other loading optimizations here if needed
          />
          
          {/* Online badge */}
          {isOnline && (
            <div 
              className="absolute top-2 right-2 px-2 py-1 text-xs font-semibold rounded"
              style={{ 
                backgroundColor: theme.palette.success,
                color: theme.palette.text.light
              }}
            >
              ONLINE
            </div>
          )}
        </div>
        
        {/* Content */}
        <div className="p-3">
          <h3 
            className="font-semibold truncate"
            style={{ 
              fontSize: theme.typography.h4.fontSize,
              lineHeight: theme.typography.h4.lineHeight,
              color: theme.palette.text.primary
            }}
          >
            {name}
          </h3>
          
          {/* Tags */}
          {tags && tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {tags.slice(0, 3).map(tag => (
                <span 
                  key={tag}
                  className="px-1.5 py-0.5 text-xs rounded"
                  style={{ 
                    backgroundColor: theme.palette.background.dark,
                    color: theme.palette.text.light,
                    fontSize: theme.typography.small.fontSize,
                    borderRadius: theme.borderRadius.sm
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
          
          {/* Provider badge */}
          <div className="mt-2 text-xs" style={{ color: theme.palette.text.secondary }}>
            {providerSource === 'free' ? 'Free' : providerSource === 'vpapi' ? 'Premium' : 'Live'}
          </div>
        </div>
      </div>
    </Link>
  );
  
  // Render list layout
  const renderListLayout = () => (
    <Link href={getModelUrl()} className="block w-full">
      <div 
        className="flex items-center gap-4 p-3 rounded-md transition-all duration-300 hover:shadow-md"
        style={{ 
          backgroundColor: theme.palette.background.card,
          borderRadius: theme.borderRadius.md
        }}
      >
        {/* Thumbnail */}
        <div className="relative w-20 h-20 bg-gray-200 rounded-md overflow-hidden flex-shrink-0">
          {preview ? (
            <Image
              src={preview}
              alt={name}
              fill
              sizes="80px"
              className="object-cover"
              loading={index < 5 ? "eager" : "lazy"}
            />
          ) : (
            <div className="w-full h-full bg-gray-300 flex items-center justify-center">
              <span className="text-gray-500">No Image</span>
            </div>
          )}
          
          {/* Live badge */}
          {isLive && (
            <div 
              className="absolute top-1 right-1 px-1 py-0.5 text-[10px] font-semibold rounded"
              style={{ 
                backgroundColor: theme.palette.error,
                color: theme.palette.text.light
              }}
            >
              LIVE
            </div>
          )}
        </div>
        
        {/* Content */}
        <div className="flex-grow min-w-0">
          <h3 
            className="font-semibold truncate"
            style={{ 
              fontSize: theme.typography.body.fontSize,
              lineHeight: theme.typography.body.lineHeight,
              color: theme.palette.text.primary
            }}
          >
            {name}
          </h3>
          
          {/* Tags */}
          {tags && tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-1">
              {tags.slice(0, 2).map(tag => (
                <span 
                  key={tag}
                  className="px-1.5 py-0.5 text-xs rounded"
                  style={{ 
                    backgroundColor: theme.palette.background.dark,
                    color: theme.palette.text.light,
                    fontSize: theme.typography.small.fontSize,
                    borderRadius: theme.borderRadius.sm
                  }}
                >
                  {tag}
                </span>
              ))}
              {tags.length > 2 && (
                <span 
                  className="px-1.5 py-0.5 text-xs rounded"
                  style={{ 
                    backgroundColor: theme.palette.background.dark,
                    color: theme.palette.text.light,
                    fontSize: theme.typography.small.fontSize,
                    borderRadius: theme.borderRadius.sm
                  }}
                >
                  +{tags.length - 2}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
  
  // Render compact layout
  const renderCompactLayout = () => (
    <Link href={getModelUrl()} className="block h-full">
      <div 
        className="relative h-full rounded-md overflow-hidden transition-transform duration-300 hover:scale-105"
        style={{ 
          borderRadius: theme.borderRadius.md
        }}
      >
        {/* Image */}
        <div className="relative aspect-square bg-gray-200">
          {preview ? (
            <Image
              src={preview}
              alt={name}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 16vw"
              className="object-cover"
              loading={index < 12 ? "eager" : "lazy"}
            />
          ) : (
            <div className="w-full h-full bg-gray-300 flex items-center justify-center">
              <span className="text-gray-500">No Image</span>
            </div>
          )}
          
          {/* Live badge */}
          {isLive && (
            <div 
              className="absolute top-1 right-1 px-1 py-0.5 text-[10px] font-semibold rounded"
              style={{ 
                backgroundColor: theme.palette.error,
                color: theme.palette.text.light
              }}
            >
              LIVE
            </div>
          )}
        </div>
        
        {/* Name overlay */}
        <div 
          className="absolute bottom-0 left-0 right-0 py-1 px-2"
          style={{ 
            backgroundColor: 'rgba(0,0,0,0.7)',
            color: theme.palette.text.light
          }}
        >
          <h3 
            className="text-xs font-medium truncate"
            style={{ 
              fontSize: theme.typography.small.fontSize,
              lineHeight: theme.typography.small.lineHeight
            }}
          >
            {name}
          </h3>
        </div>
      </div>
    </Link>
  );
  
  // Render featured layout
  const renderFeaturedLayout = () => (
    <Link href={getModelUrl()} className="block h-full">
      <div 
        className="h-full rounded-md overflow-hidden transition-all duration-300 hover:shadow-xl"
        style={{ 
          borderRadius: theme.borderRadius.lg,
          boxShadow: theme.shadows.md
        }}
      >
        {/* Image */}
        <div className="relative aspect-video bg-gray-200">
          {preview ? (
            <Image
              src={preview}
              alt={name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover"
              loading={index < 3 ? "eager" : "lazy"}
            />
          ) : (
            <div className="w-full h-full bg-gray-300 flex items-center justify-center">
              <span className="text-gray-500">No Image</span>
            </div>
          )}
          
          {/* Live badge */}
          {isLive && (
            <div 
              className="absolute top-3 right-3 px-2 py-1 text-sm font-semibold rounded"
              style={{ 
                backgroundColor: theme.palette.error,
                color: theme.palette.text.light
              }}
            >
              LIVE
            </div>
          )}
        </div>
        
        {/* Content */}
        <div 
          className="p-4"
          style={{ 
            backgroundColor: theme.palette.background.card
          }}
        >
          <h3 
            className="font-bold"
            style={{ 
              fontSize: theme.typography.h3.fontSize,
              lineHeight: theme.typography.h3.lineHeight,
              color: theme.palette.text.primary
            }}
          >
            {name}
          </h3>
          
          {/* Tags */}
          {tags && tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {tags.slice(0, 5).map(tag => (
                <span 
                  key={tag}
                  className="px-2 py-1 text-sm rounded"
                  style={{ 
                    backgroundColor: theme.palette.background.dark,
                    color: theme.palette.text.light,
                    fontSize: theme.typography.small.fontSize,
                    borderRadius: theme.borderRadius.md
                  }}
                >
                  {tag}
                </span>
              ))}
              {tags.length > 5 && (
                <span 
                  className="px-2 py-1 text-sm rounded"
                  style={{ 
                    backgroundColor: theme.palette.background.dark,
                    color: theme.palette.text.light,
                    fontSize: theme.typography.small.fontSize,
                    borderRadius: theme.borderRadius.md
                  }}
                >
                  +{tags.length - 5}
                </span>
              )}
            </div>
          )}
          
          {/* View button */}
          <div className="mt-4">
            <button
              className="w-full py-2 rounded-md text-center font-semibold transition-colors"
              style={{
                backgroundColor: theme.palette.primary,
                color: theme.palette.text.light,
                borderRadius: theme.components.button.borderRadius,
                fontSize: theme.components.button.fontSize,
                transition: theme.transitions.standard
              }}
            >
              View Profile
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
  
  return renderContent();
};

export default ModelCard; 