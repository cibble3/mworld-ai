# MistressWorld Theme System & API Orchestration

This document provides an overview of the theme system architecture and API orchestration layer for MistressWorld.

## Table of Contents
1. [Theme System](#theme-system)
2. [API Orchestration](#api-orchestration)
3. [URL Structure](#url-structure)
4. [Layout Components](#layout-components)
5. [Data Flow](#data-flow)
6. [Hooks](#hooks)

## Theme System

The theme system allows the application to switch between different visual themes:

- **Modern Dark** (`dark`) - Default theme with modern styling
- **Modern Light** (`light`) - Light version of the modern theme
- **Legacy Dark** (`legacyDark`) - Original legacy theme

### How Themes Work

Themes are controlled through the `ThemeContext` which provides:

- Current theme state
- Functions to change or toggle themes
- Theme constants

```jsx
// Access theme context in a component
import { useTheme, THEMES } from '@/context/ThemeContext';

const MyComponent = () => {
  const { theme, changeTheme, toggleTheme } = useTheme();
  
  return (
    <div>
      Current theme: {theme}
      <button onClick={() => changeTheme(THEMES.DARK)}>Switch to Dark</button>
      <button onClick={toggleTheme}>Toggle Theme</button>
    </div>
  );
};
```

### Theme Configuration

Theme colors and properties are defined in `src/theme/config.js`. Each theme has:

- Primary/secondary colors
- Text colors
- Border colors
- Component-specific styles

## API Orchestration

The API orchestration layer provides a unified interface for different data sources:

- **AWEAPI** (LiveJasmin) - Primary model feed
- **FreeAPI** (Chaturbate) - Free cam models
- **VPAPI** - Video content

### Orchestration Structure

All API interactions are centralized through:

1. `src/services/orchestrator.js` - Core orchestration logic
2. API route handlers in `src/pages/api/`
3. Data hooks like `useModelFeed`

### Data Normalization

The orchestrator normalizes different API data structures into consistent formats:

```javascript
// Example normalized model object
{
  id: "model123",
  slug: "hot-model",
  name: "Hot Model",
  image: "https://example.com/image.jpg",
  isLive: true,
  category: "girls",
  subcategory: "blonde",
  tags: ["tattoo", "piercing"],
  provider: "awe"
}
```

## URL Structure

The application follows a consistent URL structure:

### Model Pages
- **Main categories**: `/girls` and `/trans`
- **Subcategories**: `/girls/[subcategory]` and `/trans/[subcategory]`
- **Free versions**: `/free/girls` and `/free/trans`
- **Free subcategories**: `/free/girls/[subcategory]` and `/free/trans/[subcategory]`

### Video Pages
- **Main videos page**: `/videos`
- **Video categories**: `/videos/[category]`
- **Individual videos**: `/videos/[category]/[id]` (planned)

### Blog Pages
- **Main blog**: `/blog`
- **Blog posts**: `/blog/[slug]`

## Layout Components

The theme system uses a hierarchical layout structure:

1. `ThemeLayout` - Smart component that selects the appropriate layout
2. `ModernLayout` - Layout for modern themes (dark/light)
3. `LegacyLayout` - Layout for legacy theme

### Component Structure

- `src/theme/layouts/` - Layout components
- `src/theme/components/` - Theme-specific components
  - `grid/` - Grid and container components
  - `navigation/` - Navigation components
  - `common/` - Shared components
  - `content/` - Content blocks

## Data Flow

Data flows through the application as follows:

1. **API Request** → Made from page or hook
2. **API Route** → Handles request in Next.js backend
3. **Orchestrator** → Processes and normalizes data
4. **Component** → Receives and displays data

## Hooks

The application provides several custom hooks:

### useModelFeed

Primary hook for fetching model data, with support for different providers.

```jsx
const { 
  models, 
  isLoading, 
  error, 
  hasMore, 
  loadMore,
  refresh
} = useModelFeed({
  provider: ApiProviders.AWE,
  category: 'girls',
  subcategory: 'blonde',
  limit: 24
});
```

### useTheme

Hook for accessing and manipulating the current theme.

```jsx
const { theme, changeTheme, toggleTheme } = useTheme();
```

## Development Guidelines

1. Always use `ThemeLayout` for page components
2. Access APIs through the orchestration layer
3. Follow the established URL structure
4. Use component patterns from existing files
5. Add proper error handling and loading states 