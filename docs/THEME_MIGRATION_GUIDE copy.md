# Theme Consolidation Guide

## Files to Update

The following files are using the old dark-theme and should be updated to use the modern Layout components:

- src/components/DarkLatestBlogPost.js
- src/components/DarkSingleBlogPost.js
- src/components/Staticblogpost.js
- src/pages/home.js
- src/pages/models-wanted.js
- src/pages/sitemap.js
- src/pages/test.js
- src/pages/trans.js

## Component Mapping

For each file, replace imports with the following:

| Old Component | New Component |
|---------------|---------------|
| `import DarkTheme from "../components/navigation/dark-themeLive"` | `import PageTemplate from "../components/Layout/PageTemplate"` |
| `import styles from "../components/navigation/dark-themeLive/dashbpard-dark-theme.module.css"` | Remove this import |

## Example Transformation

### Before:
```jsx
import DarkTheme from "../components/navigation/dark-themeLive";
import { useEffect, useState } from "react";
// ...other imports

const TransPage = () => {
  // ...component logic
  
  return (
    <>
      <HeadMeta
        title={pageContent?.meta_title || "Trans Cams"}
        description={pageContent?.meta_desc || ""}
      />
      <DarkTheme>
        {/* Content */}
      </DarkTheme>
    </>
  );
};
```

### After:
```jsx
import React from "react";
import PageTemplate from "../components/Layout/PageTemplate";
import usePageData from '../hooks/usePageData';

const TransPage = () => {
  const { data: pageData, loading, error } = usePageData('trans');
  
  return (
    <PageTemplate 
      pageType="trans" 
      pageData={pageData}
    >
      {/* Content */}
    </PageTemplate>
  );
};
```
