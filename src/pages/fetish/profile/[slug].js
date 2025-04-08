import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Head from 'next/head';
import Link from 'next/link';
import Script from 'next/script';
import axios from 'axios';
import { useRouter } from 'next/router';

// Model Profile Page
const ModelProfile = ({ model, similar }) => {
  const router = useRouter();
  const { slug } = router.query;
  const chatContainerRef = useRef(null);
  
  // Effect to load the chat embed script
  useEffect(() => {
    if (model?.isOnline && chatContainerRef.current) {
      // Clear any existing elements
      while (chatContainerRef.current.firstChild) {
        chatContainerRef.current.removeChild(chatContainerRef.current.firstChild);
      }
      
      // Create div container
      const container = document.createElement('div');
      container.id = 'object_container';
      container.style.width = '100%';
      container.style.height = '100%';
      chatContainerRef.current.appendChild(container);
      
      // Create and append script
      const script = document.createElement('script');
      script.src = `https://ttedwm.com/embed/lfcht?c=object_container&site=wl3&cobrandId=201300&psid=mikeeyy3&pstool=320_1&psprogram=cbrnd&campaign_id=117404&category=girl&forcedPerformers[]=${model.slug}&vp[showChat]=true&vp[chatAutoHide]=&vp[showCallToAction]=true&vp[showPerformerName]=true&vp[showPerformerStatus]=true&ctaLabelKey=udmn&landingTarget=freechat&ms_notrack=1`;
      chatContainerRef.current.appendChild(script);
      
      return () => {
        // Cleanup function to remove script when component unmounts
        if (chatContainerRef.current) {
          while (chatContainerRef.current.firstChild) {
            chatContainerRef.current.removeChild(chatContainerRef.current.firstChild);
          }
        }
      };
    }
  }, [model, slug]);
  
  // If page is in fallback state
  if (router.isFallback) {
    return <div className="text-center p-10">Loading...</div>;
  }
  
  // If model data couldn't be found
  if (!model) {
    return (
      <div className="min-h-screen bg-[#16181c] text-white flex flex-col items-center justify-center p-4">
        <h1 className="text-3xl font-bold mb-4">Model Not Found</h1>
        <p className="mb-6">The model you're looking for couldn't be found.</p>
        <Link href="/home" className="bg-[#E0006C] text-white px-6 py-2 rounded-md">
          Return to Homepage
        </Link>
      </div>
    );
  }
  
  // Generate the external whitelabel URL for the CTA button
  const whitelabelUrl = `https://awejmp.com/?siteId=wl3&cobrandId=201300&performerName=${model.slug}&prm[psid]=mikeeyy3&prm[pstool]=213_1&prm[psProgram]=cbrnd`;
  
  return (
    <>
      <Head>
        <title>{model.name} - Mistress Fetish Cams | MistressWorld</title>
        <meta name="description" content={`Chat live with ${model.name}, ${model.age} year old ${model.ethnicity || ''} fetish cam model. Explore ${model.name}'s fetish specialties including ${(model.tags || []).slice(0, 5).join(', ')}.`} />
        <meta property="og:title" content={`${model.name} - Fetish Cam Model | MistressWorld`} />
        <meta property="og:description" content={`Chat live with ${model.name}, ${model.age} year old fetish cam model on MistressWorld.`} />
        <meta property="og:image" content={model.thumbnail} />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
      
      <div className="min-h-screen bg-[#16181c] text-white">
        <div className="container mx-auto px-4 py-8">
          {/* Show live chat applet when model is online */}
          {model.isOnline && (
            <div className="mb-8 bg-black rounded-lg overflow-hidden shadow-lg">
              <div className="aspect-video relative" style={{ minHeight: '400px' }}>
                <div 
                  ref={chatContainerRef}
                  className="absolute inset-0"
                  style={{ width: '100%', height: '100%' }}
                ></div>
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
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  {model.ethnicity && (
                    <div>
                      <span className="text-gray-400">Ethnicity:</span>
                      <span className="ml-2">{model.ethnicity}</span>
                    </div>
                  )}
                  {model.bodyType && (
                    <div>
                      <span className="text-gray-400">Body Type:</span>
                      <span className="ml-2">{model.bodyType}</span>
                    </div>
                  )}
                </div>
                
                <div className="mt-8">
                  <a 
                    href={whitelabelUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="bg-[#E0006C] hover:bg-[#ff0080] text-white font-bold py-3 px-8 rounded-md inline-block transition-colors"
                  >
                    Chat with {model.name} Now
                  </a>
                </div>
              </div>
            </div>
          </div>
          
          {/* About section - Generated content for SEO */}
          <div className="bg-[#1a1c21] rounded-lg overflow-hidden shadow-lg p-6 mb-8">
            <h2 className="text-2xl font-bold mb-4">About {model.name}</h2>
            <p className="mb-4">
              Welcome to {model.name}'s profile on MistressWorld.xxx. {model.name} is a {model.age}-year-old {model.ethnicity || ''} fetish model 
              who specializes in {(model.tags || []).slice(0, 3).join(', ')}.
            </p>
            <p className="mb-4">
              With a {model.bodyType || 'stunning'} body type and passionate approach to {(model.tags || []).slice(0, 1)[0] || 'fetish'} performances, 
              {model.name} has become one of the most sought-after models in the fetish category.
            </p>
            <p>
              Click the "Chat Now" button above to connect with {model.name} in a live cam session and explore your deepest fetish fantasies together.
            </p>
          </div>
          
          {/* Similar models section */}
          {similar && similar.length > 0 && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Similar Models</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {similar.map((model, i) => (
                  <div key={i} className="bg-[#1a1c21] rounded-lg overflow-hidden shadow-lg">
                    <Link href={`/fetish/${model.slug}`} className="block">
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
                    <div className="px-3 pb-3">
                      <a 
                        href={`https://awejmp.com/?siteId=wl3&cobrandId=201300&performerName=${model.slug}&prm[psid]=mikeeyy3&prm[pstool]=213_1&prm[psProgram]=cbrnd`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="w-full bg-[#333] hover:bg-[#444] text-white text-center text-xs py-1 px-2 rounded inline-block"
                      >
                        Chat Now
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export async function getServerSideProps(context) {
  const { slug } = context.params;
  let model = null;
  let similarModels = [];
  
  try {
    // Get the host information from context for absolute URL
    const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
    const host = context.req.headers.host || 'localhost:3000';
    const baseUrl = `${protocol}://${host}`;
    
    // Fetch specific model data
    console.log(`[getServerSideProps fetish/[slug].js] Fetching model data for slug: ${slug}`);
    
    // Construct fetch URL for model search
    const modelSearchUrl = `${baseUrl}/api/models/fetish?limit=32&_timestamp=${Date.now()}`;
    
    // Fetch all models and find the matching one
    const modelsResponse = await fetch(modelSearchUrl);
    
    if (modelsResponse.ok) {
      const modelsData = await modelsResponse.json();
      if (modelsData.success && modelsData.data?.models) {
        // Find matching model by slug
        model = modelsData.data.models.find(m => m.slug === slug);
        
        // Get similar models (excluding the current one)
        if (model) {
          similarModels = modelsData.data.models
            .filter(m => m.slug !== slug)
            .slice(0, 8); // Limit to 8 similar models
        }
      }
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
    console.error(`[getServerSideProps fetish/[slug].js] Error:`, error.message);
    return {
      notFound: true,
    };
  }
}

export default ModelProfile; 