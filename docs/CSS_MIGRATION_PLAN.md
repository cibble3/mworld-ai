# CSS Migration Plan

## Phase 1: Initial Cleanup
1. Replace the full bootstrap.min.css import in _app.js with React-Bootstrap components
2. Remove unused component styles
3. Start using the optimized.min.css file from src/styles/optimized/

## Phase 2: Theme Consolidation
1. Migrate all pages to use the modern Layout components
2. Remove the dark-theme CSS files
3. Standardize on a single styling approach

## Phase 3: Modern CSS Implementation
1. Convert to Tailwind CSS or styled-components for better maintainability
2. Implement CSS modules for component-specific styles
3. Run regular CSS analysis to catch regressions

## Implementation Guide

### Replacing bootstrap.min.css

In _app.js, replace:
```jsx
import "../styles/bootstrap.min.css";
```

With component imports:
```jsx
// Only import components you need
import { Button, Container, Row, Col, Nav } from 'react-bootstrap';
```

### CSS Module Approach

For component-specific styles, use CSS modules:

```jsx
import styles from './Component.module.css';

function Component() {
  return <div className={styles.container}>Content</div>;
}
```

### Testing Changes

To test your CSS changes without breaking the site:
1. Create a backup of your original CSS files
2. Implement changes incrementally
3. Test thoroughly across different screen sizes and browsers
