import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useSearchParams } from 'next/navigation';
import apiService from '@/services/apiService'; // Use our new service
import UnifiedLayout from '@/theme/layouts/UnifiedLayout'; // Import UnifiedLayout
import { 
  ModelGridModule, 
  TopTextModule, 
  BottomTextModule, 
  RelevantContentModule 
} from '@/theme/components/modules';
import { generateDynamicMetadata } from '@/utils/seoHelpers';

/**
 * HomePage - Main landing page using UnifiedLayout
 */
const HomePage = ({ initialData = {} }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Data from getServerSideProps
  const { girlModels = [], transModels = [], fetishModels = [], blogPosts = [] } = initialData;
  
  // Generate SEO metadata for homepage
  const meta = generateDynamicMetadata(
    router.asPath,
    searchParams,
    "MistressWorld - Live Webcam Models",
    "Explore our collection of beautiful cam models ready for private chat experiences."
  );
  
  return (
    <UnifiedLayout 
      title="Live Cam Girls" // Title for the top text module
      description="Explore our collection of beautiful cam models ready for private chat experiences." // Description for top text
      meta={meta} // Pass SEO meta
      bottomContentChildren={ // Pass bottom SEO content
        <BottomTextModule
          title="Welcome to MistressWorld"
          content={[
            "MistressWorld is the premier destination for adult webcam entertainment. Our platform hosts thousands of models from around the world, ready to engage with you in private chat sessions.",
            "Whether you're looking for cam girls, trans models, or fetish performers, we have a diverse selection to match your preferences. All our models are verified and provide high-quality streaming experiences.",
            "Join MistressWorld today to access exclusive features and connect with your favorite models."
          ]}
        />
      }
    >
      {/* Category links - Part of TOP TEXT MODULE area */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <Link href="/girls" className="bg-pink-600 hover:bg-pink-700 text-white p-6 rounded-lg transition-colors">
          <h2 className="text-2xl font-bold mb-2">Cam Girls</h2>
          <p>Explore our collection of stunning cam girls ready for private chat.</p>
        </Link>

        <Link href="/trans" className="bg-purple-600 hover:bg-purple-700 text-white p-6 rounded-lg transition-colors">
          <h2 className="text-2xl font-bold mb-2">Trans Models</h2>
          <p>Discover our beautiful trans models available for private sessions.</p>
        </Link>
      </div>
      
      {/* MODEL GRID MODULE - Girls section */}
      <div className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Featured Girls</h2>
          <Link href="/girls" className="text-pink-500 hover:underline">
            View All Girls
          </Link>
        </div>
        
        <ModelGridModule 
          models={girlModels}
          isLoading={false} // Data is fetched server-side
          emptyMessage="No featured girl models found"
        />
      </div>
      
      {/* MODEL GRID MODULE - Trans section */}
      <div className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Featured Trans Models</h2>
          <Link href="/trans" className="text-purple-500 hover:underline">
            View All Trans
          </Link>
        </div>
        
        <ModelGridModule 
          models={transModels}
          isLoading={false}
          emptyMessage="No featured trans models found"
        />
      </div>
      
      {/* MODEL GRID MODULE - Fetish section */}
      <div className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Featured Fetish Models</h2>
          <Link href="/fetish" className="text-pink-500 hover:underline">
            View All Fetish
          </Link>
        </div>
        
        <ModelGridModule 
          models={fetishModels}
          isLoading={false}
          emptyMessage="No featured fetish models found"
        />
      </div>
      
      {/* RELEVANT CONTENT MODULE - Blog posts */}
      <RelevantContentModule 
        title="Latest Blog Posts"
        items={blogPosts}
        itemType="blog"
      />
    </UnifiedLayout>
  );
};

export default HomePage;

/**
 * Server-side props to fetch initial data for the homepage
 */
export async function getServerSideProps() {
  try {
    // Fetch initial data for different model categories using apiService
    const [girlsResult, transResult, fetishResult] = await Promise.all([
      apiService.fetchModels('girls', {}, { limit: 6 }),
      apiService.fetchModels('trans', {}, { limit: 6 }),
      apiService.fetchModels('fetish', {}, { limit: 6 })
    ]);
    
    // Sample blog posts (replace with actual API call when ready)
    const blogPosts = [
      {
        post_title: "Top 10 Cam Girl Tips for Viewers",
        post_url: "top-10-cam-girl-tips",
        post_content: "Looking to get the most out of your cam experience? Here are our top tips for interacting with cam models...",
        feature_image: "https://placehold.co/600x400/333/FFF?text=Blog+Post+1"
      },
      {
        post_title: "How to Choose the Perfect Model for You",
        post_url: "how-to-choose-perfect-model",
        post_content: "With thousands of models online, finding your perfect match can be overwhelming. Here's our guide to...",
        feature_image: "https://placehold.co/600x400/333/FFF?text=Blog+Post+2"
      },
      {
        post_title: "The Rise of Trans Webcam Models",
        post_url: "rise-of-trans-webcam-models",
        post_content: "The webcam industry has seen significant growth in trans representation over the past few years...",
        feature_image: "https://placehold.co/600x400/333/FFF?text=Blog+Post+3"
      }
    ];
    
    return {
      props: {
        initialData: {
          girlModels: girlsResult.success ? girlsResult.data.items : [],
          transModels: transResult.success ? transResult.data.items : [],
          fetishModels: fetishResult.success ? fetishResult.data.items : [],
          blogPosts
        }
      }
    };
  } catch (error) {
    console.error('[HomePage] getServerSideProps error:', error);
    return {
      props: {
        initialData: {}
      }
    };
  }
} 