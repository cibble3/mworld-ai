import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Head from 'next/head';
import Link from 'next/link';
import Script from 'next/script';
import axios from 'axios';
import { useRouter } from 'next/router';
import HeadMeta from '@/components/HeadMeta';
import CookiesModal from '@/components/CookiesModal/CookiesModal';
import DynamicSidebar from '@/components/navigation/DynamicSidebar';

// Free Model Profile Page
const FreeModelProfile = ({ model, similar }) => {
  const router = useRouter();
  const { id } = router.query;
  const chatContainerRef = useRef(null);
  
  // Effect to load the chat embed script
  useEffect(() => {
    if (model?.isOnline && chatContainerRef.current) {
      // Clear any existing elements
      while (chatContainerRef.current.firstChild) {
        chatContainerRef.current.removeChild(chatContainerRef.current.firstChild);
      }
      
      // Get the correct performer ID - use username for Chaturbate
      const performerId = model.username || model.performerId || model.id || model.slug;
      console.log(`[FreeModelPage] Loading Chaturbate chat for model: ${model.name}, ID: ${performerId}`);
      
      // Create the iframe element for Chaturbate embed
      const iframe = document.createElement('iframe');
      iframe.src = `https://cbxyz.com/in/?tour=Limj&campaign=1f2Eo&track=embed&signup_notice=1&b=${performerId}&disable_sound=1&mobileRedirect=never`;
      iframe.width = '100%';
      iframe.height = '100%';
      iframe.frameBorder = '0';
      iframe.scrolling = 'no';
      iframe.className = 'chaturbate-embed';
      
      // Append iframe to container
      chatContainerRef.current.appendChild(iframe);
      
      return () => {
        // Cleanup function to remove iframe when component unmounts
        if (chatContainerRef.current) {
          while (chatContainerRef.current.firstChild) {
            chatContainerRef.current.removeChild(chatContainerRef.current.firstChild);
          }
        }
      };
    }
  }, [model, id]);
  
  // If page is in fallback state
  if (router.isFallback) {
    return (
      <div className="bg-[#16181c] min-h-screen">
        <div className="text-center p-10">Loading...</div>
      </div>
    );
  }
  
  // If model data couldn't be found
  if (!model) {
    return (
      <div className="bg-[#16181c] min-h-screen">
        <HeadMeta pageContent={{
          meta_title: "Model Not Found - MistressWorld",
          meta_desc: "The model you're looking for couldn't be found."
        }} />
        <CookiesModal />
        
        {/* Sidebar as an overlay that doesn't affect main content flow */}
        <div className="fixed left-0 top-16 w-64 h-[calc(100vh-4rem)] bg-[#1a1a1a] overflow-y-auto z-10 pointer-events-auto">
          <DynamicSidebar />
        </div>
        
        <div className="py-4 px-3">
          <div className="min-h-[50vh] flex flex-col items-center justify-center p-4">
            <h1 className="text-3xl font-bold mb-4">Model Not Found</h1>
            <p className="mb-6">The model you're looking for couldn't be found.</p>
            <Link href="/free" className="bg-[#E0006C] text-white px-6 py-2 rounded-md">
              Return to Free Cams
            </Link>
          </div>
        </div>
      </div>
    );
  }
  
  // Extract the username for the iframe embed
  const username = model.username || model.performerId || model.id || model.slug;
  console.log(`[FreeModelPage] Model data:`, {
    id: model.id,
    slug: model.slug,
    username: model.username,
    performerId: model.performerId,
    name: model.name
  });
  console.log(`[FreeModelPage] Using username for embed: ${username}`);
  
  // Create direct iframe embed
  const iframeEmbed = `<iframe src="https://cbxyz.com/in/?tour=Limj&campaign=1f2Eo&track=embed&signup_notice=1&b=${username}&disable_sound=1&mobileRedirect=never" height="100%" width="100%" frameborder="0" scrolling="no"></iframe>`;
  console.log(`[FreeModelPage] Iframe embed code: ${iframeEmbed}`);
  
  // Prepare page metadata
  const pageContent = {
    meta_title: `${model.name} - Free Live Cam | MistressWorld`,
    meta_desc: `Chat live with ${model.name}, ${model.age} year old webcam model. Watch free live cam show with ${model.name} on MistressWorld.`,
    og_image: model.thumbnail
  };
  
  return (
    <div className="bg-[#16181c] min-h-screen">
      <HeadMeta pageContent={pageContent} />
      <CookiesModal />
      
      {/* Sidebar as an overlay that doesn't affect main content flow */}
      <div className="fixed left-0 top-16 w-64 h-[calc(100vh-4rem)] bg-[#1a1a1a] overflow-y-auto z-10 pointer-events-auto">
        <DynamicSidebar />
      </div>
      
      <div className="py-4 px-3">
        {/* Show live chat applet when model is online */}
        {model.isOnline && (
          <div className="mb-8 bg-black rounded-lg overflow-hidden shadow-lg">
            <div className="aspect-video relative" style={{ minHeight: '480px' }}>
              {/* Option 1: Dynamic iframe creation via useEffect */}
              <div 
                ref={chatContainerRef}
                className="absolute inset-0 hidden"
                style={{ width: '100%', height: '100%' }}
              ></div>
              
              {/* Option 2: Direct iframe rendering */}
              <iframe 
                src={`https://cbxyz.com/in/?tour=Limj&campaign=1f2Eo&track=embed&signup_notice=1&b=${username}&disable_sound=1&mobileRedirect=never`}
                width="100%" 
                height="100%" 
                frameBorder="0" 
                scrolling="no"
                className="absolute inset-0"
                title={`${model.name} live chat`}
                allow="autoplay"
              ></iframe>
              
              {/* Option 3: Use the iframe_embed from the API if available */}
              {model._originalData?.iframe_embed && (
                <div 
                  className="absolute inset-0 hidden"
                  dangerouslySetInnerHTML={{ __html: model._originalData.iframe_embed }}
                ></div>
              )}
            </div>
          </div>
        )}
        
        {/* Model header section */}
        <div className="bg-[#1a1c21] rounded-lg overflow-hidden shadow-lg mb-8">
          <div className="flex flex-col md:flex-row">
            {/* Model image */}
            <div className="w-full md:w-1/3 relative h-[300px] md:h-auto">
              <Image 
                src={model.thumbnail || '/images/model-placeholder.jpg'} 
                alt={model.name}
                fill
                className="object-cover"
                unoptimized={true}
              />
              {model.isOnline && (
                <div className="absolute top-4 right-4 px-3 py-1 bg-[#E0006C] text-white text-sm font-bold rounded-md">
                  LIVE
                </div>
              )}
            </div>
            
            {/* Model info */}
            <div className="w-full md:w-2/3 p-6">
              <div className="flex justify-between items-start">
                <h1 className="text-3xl font-bold mb-2">{model.name}</h1>
                <div className="text-sm bg-[#333] px-2 py-1 rounded">
                  {model.age} years
                </div>
              </div>
              
              <div className="mb-4 flex flex-wrap">
                {model.tags && model.tags.map((tag, i) => (
                  <span key={i} className="mr-2 mb-2 bg-[#2d2d2d] text-sm px-2 py-1 rounded">
                    {tag}
                  </span>
                ))}
              </div>
              
              <div className="mt-8">
                <Link
                  href="/free"
                  className="bg-[#E0006C] hover:bg-[#ff0080] text-white font-bold py-3 px-8 rounded-md inline-block transition-colors"
                >
                  Back to Free Cams
                </Link>
              </div>
            </div>
          </div>
        </div>
        
        {/* About section - Generated content for SEO */}
        <div className="bg-[#1a1c21] rounded-lg overflow-hidden shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4">About {model.name}</h2>
          <p className="mb-4">
            Watch {model.name}'s free live cam show on MistressWorld. {model.name} is a {model.age}-year-old 
            webcam model who specializes in {(model.tags || []).slice(0, 3).join(', ')}.
          </p>
          <p>
            Enjoy free chat with {model.name} and thousands of other models without registration or credit card.
          </p>
        </div>
        
        {/* Similar models section */}
        {similar && similar.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Similar Free Cam Models</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {similar.map((model, i) => (
                <div key={i} className="bg-[#1a1c21] rounded-lg overflow-hidden shadow-lg">
                  <Link href={`/free/model/${model.slug}`} className="block">
                    <div className="relative h-[180px]">
                      <Image 
                        src={model.thumbnail || '/images/model-placeholder.jpg'} 
                        alt={model.name}
                        fill
                        className="object-cover"
                        unoptimized={true}
                      />
                      {model.isOnline && (
                        <div className="absolute top-2 right-2 px-2 py-1 bg-[#E0006C] text-white text-xs font-bold rounded">
                          LIVE
                        </div>
                      )}
                    </div>
                    <div className="p-3">
                      <h3 className="font-bold">{model.name}</h3>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export async function getServerSideProps(context) {
  const { id } = context.params;
  let model = null;
  let similarModels = [];
  
  console.log(`[free/model/[id].js] Looking for model with id: ${id}`);
  
  try {
    // Get the host information from context for absolute URL
    const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
    const host = context.req.headers.host || 'localhost:3000';
    const baseUrl = `${protocol}://${host}`;
    
    // Fetch models from free-models API
    console.log(`[getServerSideProps free/model/[id].js] Fetching model data from ${baseUrl}/api/free-models`);
    
    // Construct fetch URL for model search
    const modelSearchUrl = `${baseUrl}/api/free-models?limit=32&_timestamp=${Date.now()}`;
    
    // Fetch all models and find the matching one
    const modelsResponse = await fetch(modelSearchUrl);
    
    if (modelsResponse.ok) {
      const modelsData = await modelsResponse.json();
      console.log(`[free/model/[id].js] API Response success: ${modelsData.success}, found ${modelsData.data?.models?.length || 0} models`);
      
      if (modelsData.success && modelsData.data?.models) {
        // Find matching model by any identifier we have
        model = modelsData.data.models.find(m => 
          m.slug === id || 
          m.id === id || 
          m.performerId === id
        );
        
        if (model) {
          console.log(`[free/model/[id].js] Found model: ${model.name}, performerId: ${model.performerId || 'N/A'}, id: ${model.id || 'N/A'}, slug: ${model.slug || 'N/A'}`);
          
          // Get similar models (excluding the current one)
          similarModels = modelsData.data.models
            .filter(m => m.slug !== id && m.id !== id && m.performerId !== id)
            .slice(0, 8); // Limit to 8 similar models
            
          console.log(`[free/model/[id].js] Found ${similarModels.length} similar models`);
        } else {
          console.log(`[free/model/[id].js] Model not found with id: ${id}`);
          // Debug: Log the first few models to see what IDs they have
          modelsData.data.models.slice(0, 3).forEach((m, i) => {
            console.log(`[free/model/[id].js] Sample model ${i}: name=${m.name}, performerId=${m.performerId || 'N/A'}, id=${m.id || 'N/A'}, slug=${m.slug || 'N/A'}`);
          });
        }
      }
    } else {
      console.error(`[free/model/[id].js] API Response error: ${modelsResponse.status}`);
    }
    
    // If model not found, return 404
    if (!model) {
      return {
        notFound: true,
      };
    }
    
    return {
      props: {
        model,
        similar: similarModels,
      },
    };
  } catch (error) {
    console.error(`[getServerSideProps free/model/[id].js] Error:`, error.message);
    return {
      notFound: true,
    };
  }
}

export default FreeModelProfile; 