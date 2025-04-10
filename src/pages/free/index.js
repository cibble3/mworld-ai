import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import CategoryPage from '@/components/templates/CategoryPage';

/**
 * Free Models Page - Uses the standardized CategoryPage template
 * for a consistent layout and behavior with the rest of the site.
 */
export default function FreePage({ initialData }) {
  const router = useRouter();

  useEffect(() => {
    // Redirect to /free/girls as that's our default free category
    if (router.pathname === '/free' && router.isReady) {
      router.replace('/free/girls', undefined, { shallow: true });
    }
  }, [router.isReady]);

  // Metadata specific to free category
  const pageMetadata = {
    title: "Free Cam Models - Watch Live Sex Cams Without Registration",
    description: "Watch free live sex cams without registration. No credit card needed - just enjoy free webcam shows instantly.",
    keywords: "free cams, cam models, webcam models, live chat, no registration",
    top_text: "<p>Looking for free cam shows? Our free cam section offers high-quality live webcam performances without requiring registration or credit card information. Enjoy unrestricted access to hundreds of live performers streaming right now!</p>"
  };

  return (
    <CategoryPage 
      initialCategory="free"
      initialSubcategory="girls"
      initialMetadata={pageMetadata}
      initialModels={initialData?.data?.models || []}
    />
  );
}

export async function getServerSideProps() {
  try {
    // Use the server to fetch initial models from our unified API endpoint
    console.log(`[FREE PAGE] Fetching data from server-side`);

    // In server-side rendering, use direct server URL
    const axios = require('axios');
    const response = await axios.get(`http://localhost:3000/api/models`, {
      params: {
        provider: 'free',
        category: 'girls',
        limit: 32
      }
    });

    console.log(`[FREE PAGE] Server-side data fetched successfully`);

    return {
      props: {
        initialData: response.data || {
          success: false,
          data: { models: [], pagination: {} }
        }
      }
    };
  } catch (error) {
    console.error('Error in getServerSideProps for /free:', error.message);

    // Always return empty props on error to allow client-side rendering to take over
    return {
      props: {
        initialData: {
          success: false,
          data: { models: [], pagination: {} }
        }
      }
    };
  }
} 