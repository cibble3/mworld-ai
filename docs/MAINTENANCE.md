# MistressWorld Maintenance Guide

This document provides guidelines for maintaining the MistressWorld codebase, ensuring the standardized structure remains intact, and troubleshooting common issues.

## Table of Contents

1. [Standardized Page Structure](#standardized-page-structure)
2. [Theme System](#theme-system)
3. [API Endpoint Structure](#api-endpoint-structure)
4. [Common Build Issues](#common-build-issues)
5. [Maintenance Scripts](#maintenance-scripts)

## Standardized Page Structure

All pages in MistressWorld follow a consistent modular structure:

```
├── header_module          → Top nav bar with language switcher, logo, and global nav
├── sidebar_module         → Filterable sidebar based on dynamic API attributes
├── toptext_module         → Category description or editorial content
├── modelGrid_module       → Core feed view (models or videos depending on route)
├── bottomText_module      → SEO/editorial block (AI or static content)
├── relevantContent_module → Related blog posts / models / cross-content
└── footer_module          → Single, stable footer (NOT duplicated)
```

### Key Files

- `src/theme/layouts/UnifiedLayout.jsx` - The central layout component all pages use
- `src/theme/layouts/ThemeLayout.jsx` - The entry point wrapper for all pages
- `src/theme/components/modules/` - All modular components

### When Adding New Pages

1. Always use `ThemeLayout` as the wrapper component
2. Use the standardized `CategoryPage` template for category pages
3. Add any new route to `routeConfig` in `src/theme/theme.config.js`

## Theme System

The theme system uses a centralized configuration in `src/theme/theme.config.js`.

### Key Components

- `themePalettes` - Contains color schemes for each theme
- `layoutConfig` - Spacing, dimensions and breakpoints
- `pageModules` - Configuration for all modular components
- `siteConfig` - Global site settings

### Adding or Modifying Themes

1. Add new theme constants to `src/context/ThemeContext.js`
2. Add color palette to `themePalettes` in `theme.config.js`
3. Update `ThemeProvider` in `_app.js` if needed

## API Endpoint Structure

API endpoints follow a standardized structure to prevent duplication and ensure consistent data flow.

### Main API Endpoints

- `/api/models` - Core endpoint for all models (with `provider` parameter)
- `/api/categories` - Category information and metadata
- `/api/videos` - Video content
- `/api/content` - Editorial and blog content

### API Data Flow

1. Client components use the `useModelFeed` hook or service functions
2. These access the standardized API endpoints
3. API routes normalize data from external sources
4. Data is returned in a consistent format regardless of provider

### Adding New API Endpoints

1. Create files in the appropriate directory (`/api/[entity]/`)
2. Add mapping for the endpoint to `apiMappings` in `theme.config.js`
3. Update appropriate service files in `src/services/`

## Common Build Issues

### Duplicate API Routes

**Issue**: Duplicate page detected warnings during build.

**Solution**: 
1. Ensure you don't have both `/api/[entity].js` and `/api/[entity]/index.js` files
2. Use the cleanup script: `node scripts/cleanup-api-routes.js`

### Module Not Found

**Issue**: Can't resolve a module or component.

**Solution**:
1. Run the dependency fixer: `node scripts/fix-dependencies.js`
2. Check for typos in import paths
3. Ensure the component or module exists in the correct location

### Uncompleted Code

**Issue**: Unexpected EOF or syntax errors.

**Solution**:
1. Check for unclosed strings, template literals, or brackets
2. Run linting: `npm run lint`
3. Check recent changes to identify problematic code

## Maintenance Scripts

### Cleanup Scripts

- `scripts/cleanup-routes.js` - Removes obsolete page files
- `scripts/cleanup-api-routes.js` - Cleans up duplicate API routes
- `scripts/fix-dependencies.js` - Ensures all dependencies are installed

### Running Maintenance

For regular maintenance, run:

```bash
node scripts/cleanup-routes.js
node scripts/cleanup-api-routes.js
node scripts/fix-dependencies.js
npm run lint
npm run build
```

## Best Practices

1. **Always use the modular structure** - Don't create custom layouts
2. **Update `theme.config.js` for global changes** - Don't hardcode values
3. **Use the standard API pattern** - Keep data fetching consistent
4. **Run cleanup scripts regularly** - Prevent redundant code accumulation
5. **Document any new components or modules** - Keep this guide up to date 