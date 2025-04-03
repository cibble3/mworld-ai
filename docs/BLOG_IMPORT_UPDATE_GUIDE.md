# Blog Import Update Guide

The following files contain direct blog data imports that should be updated to use the new blog data API:

- src/pages/home.js

## How to Update

Replace direct imports or hardcoded blog data with an API call or dynamic import:

```jsx
// BEFORE: Hardcoded or direct import
import blog from '../components/posts.json';
// or
const blog = [ ... ];

// AFTER: API call or dynamic import
import { useEffect, useState } from 'react';

function MyComponent() {
  const [blogPosts, setBlogPosts] = useState([]);
  
  useEffect(() => {
    // Option 1: API call
    fetch('/api/blog/posts?category=trans')
      .then(res => res.json())
      .then(data => setBlogPosts(data.posts))
      .catch(error => console.error('Error fetching blog posts:', error));
    
    // Option 2: Dynamic import
    import('../../data/blog/trans.json')
      .then(module => setBlogPosts(module.posts))
      .catch(error => console.error('Error importing blog posts:', error));
  }, []);
  
  // Use blogPosts in your component
}
```

This approach provides better maintainability and allows for future content updates without code changes.
