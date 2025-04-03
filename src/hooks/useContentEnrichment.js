import { useState, useEffect } from 'react';
import axios from 'axios';
import { ContentTypes } from '@/services/api';

/**
 * Hook for enriching content with AI-generated data
 * 
 * This hook merges API data with AI-generated content (e.g., adding bios to models,
 * adding descriptions to categories, etc.).
 * 
 * @param {Object} options - Hook options
 * @param {Array} options.items - Array of content items to enrich
 * @param {string} options.type - Type of content (model, blog, category, page)
 * @param {string} options.category - Category of content (optional)
 * @param {boolean} options.skipEnrichment - Skip enrichment process
 * @returns {Object} - Enriched content and loading state
 */
export function useContentEnrichment({
  items = [],
  type = ContentTypes.MODEL,
  category = null,
  skipEnrichment = false
}) {
  const [enrichedItems, setEnrichedItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    if (!items || items.length === 0 || skipEnrichment) {
      setEnrichedItems(items);
      return;
    }
    
    const enrichContent = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Create an array to store the enriched content
        const enriched = [...items];
        
        // Get content path based on type and category
        let contentPath;
        switch (type) {
          case ContentTypes.MODEL:
            contentPath = `/api/content?type=model&category=${category || ''}`;
            break;
          case ContentTypes.BLOG:
            contentPath = '/api/content?type=blog';
            break;
          case ContentTypes.VIDEO:
            contentPath = '/api/content?type=video';
            break;
          case ContentTypes.CATEGORY:
            contentPath = '/api/content?type=category';
            break;
          default:
            contentPath = null;
        }
        
        // If no path, just return the original items
        if (!contentPath) {
          setEnrichedItems(items);
          setLoading(false);
          return;
        }
        
        // Fetch AI-generated content
        const response = await axios.get(contentPath);
        const aiContent = response.data.data || {};
        
        // Merge AI content with API data
        for (let i = 0; i < enriched.length; i++) {
          const item = enriched[i];
          const itemKey = item.slug || item.id;
          
          if (aiContent[itemKey]) {
            // Merge with AI content
            enriched[i] = {
              ...item,
              ...aiContent[itemKey],
              aiEnriched: true
            };
          }
        }
        
        // Update state with enriched items
        setEnrichedItems(enriched);
      } catch (err) {
        console.error('Error enriching content:', err);
        setError(err);
        // Return original items on error
        setEnrichedItems(items);
      } finally {
        setLoading(false);
      }
    };
    
    enrichContent();
  }, [items, type, category, skipEnrichment]);
  
  return { items: enrichedItems, loading, error };
}

export default useContentEnrichment; 