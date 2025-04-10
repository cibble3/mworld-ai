import React from 'react';
import PageView from '@/components/templates/PageView';
import { ModelAPI } from '@/services/api';

/**
 * Trans Category Page - Uses the standardized PageView template
 */
export default function TransPage({ initialModels, initialContent, relatedItems }) {
  return (
    <PageView 
      category="trans"
      provider="awe"
      initialModels={initialModels}
      initialContent={initialContent}
      relatedItems={relatedItems}
      pageTitle="Live Trans Cams"
      pageDescription="Explore the hottest live trans cam models online. Watch transgender webcam models perform live just for you."
    />
  );
}

/**
 * Server-side props to fetch initial data
 */
export async function getServerSideProps() {
  try {
    // Fetch initial models from the server side
    const modelResponse = await ModelAPI.fetchModels('trans', {}, 24, 'awe', false);
    
    // Get related popular models
    const relatedModels = await ModelAPI.fetchModels('trans', { sort: 'popular' }, 6, 'awe', false);
    
    return {
      props: {
        initialModels: modelResponse?.success ? modelResponse.models : [],
        relatedItems: relatedModels?.success ? relatedModels.models : [],
        initialContent: {
          bottomContentTitle: "About Live Trans Cams",
          bottomContentText: [
            "MistressWorld offers a wide selection of stunning transgender cam models from across the globe.",
            "Watch beautiful trans performers live on webcam, available for private chat sessions and intimate encounters.",
            "Discover your favorite trans model and enjoy a unique and exciting webcam experience."
          ]
        }
      }
    };
  } catch (error) {
    console.error('Error in getServerSideProps for /trans:', error.message);
    
    // Return empty data on error
    return {
      props: {
        initialModels: [],
        relatedItems: [],
        initialContent: {}
      }
    };
  }
} 