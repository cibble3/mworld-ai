import React from 'react';
import ThemeLayout from '@/theme/layouts/ThemeLayout';
import ModelCard from '@/theme/components/common/ModelCard';

/**
 * Example page to showcase the enhanced ModelCard component
 * with various configurations
 */
const ModelCardExamplesPage = () => {
  // Sample model data to demonstrate different card variations
  const modelExamples = [
    {
      name: "IrinaBlanc",
      performerId: "irinablanc",
      age: 25,
      tags: ["bdsm", "fetish", "latex"],
      isOnline: true,
      viewerCount: 87,
      image: "https://picsum.photos/id/64/400/300",
      chatRoomUrl: "https://example.com/irinablanc",
      showStatus: "public",
      country: "Romania",
      languages: ["english", "romanian"],
      isHd: true,
      ethnicity: "white"
    },
    {
      name: "SophiaLuxe",
      performerId: "sophialuxe",
      age: 28,
      tags: ["dance", "roleplay", "toys"],
      isOnline: true,
      viewerCount: 1458,
      image: "https://picsum.photos/id/65/400/300",
      chatRoomUrl: "https://example.com/sophialuxe",
      showStatus: "public",
      country: "USA",
      languages: ["english", "spanish"],
      isHd: true,
      ethnicity: "latina"
    },
    {
      name: "MilaKim",
      performerId: "milakim",
      age: 22,
      tags: ["asian", "cute", "squirt"],
      isOnline: true,
      viewerCount: 546,
      image: "https://picsum.photos/id/76/400/300",
      chatRoomUrl: "https://example.com/milakim",
      showStatus: "private",
      country: "Korea",
      languages: ["english", "korean"],
      isHd: true,
      ethnicity: "asian"
    },
    {
      name: "JasmineDark",
      performerId: "jasminedark",
      age: 24,
      tags: ["ebony", "curvy", "natural"],
      isOnline: true,
      viewerCount: 723,
      image: "https://picsum.photos/id/82/400/300",
      chatRoomUrl: "https://example.com/jasminedark",
      showStatus: "public",
      country: "UK",
      languages: ["english"],
      isHd: false,
      ethnicity: "ebony"
    },
    {
      name: "TaylorSwift",
      performerId: "taylorswift",
      age: 29,
      tags: ["trans", "blonde", "fitness"],
      isOnline: true,
      viewerCount: 892,
      image: "https://picsum.photos/id/91/400/300",
      chatRoomUrl: "https://example.com/taylorswift",
      showStatus: "public",
      country: "Canada",
      languages: ["english", "french"],
      isHd: true,
      ethnicity: "white"
    },
    {
      name: "NatalieDreams",
      performerId: "nataliedreams",
      age: 26,
      tags: ["petite", "brunette", "anal"],
      isOnline: false,
      viewerCount: 0,
      image: "https://picsum.photos/id/89/400/300",
      chatRoomUrl: null,
      showStatus: "offline",
      country: "Italy",
      languages: ["english", "italian"],
      isHd: true,
      ethnicity: "white"
    },
  ];

  return (
    <ThemeLayout
      title="Enhanced Model Card Examples"
      description="Showcase of the various configurations of our improved ModelCard component"
    >
      <div className="py-6">
        <h1 className="text-3xl font-bold mb-8">Enhanced Model Card Examples</h1>
        
        <p className="mb-8 text-lg">
          Below are examples of the enhanced ModelCard component with various configurations. 
          Hover over cards to see interactive elements.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modelExamples.map((model, index) => (
            <div key={index} className="rounded-xl overflow-hidden">
              <ModelCard 
                name={model.name}
                performerId={model.performerId}
                age={model.age}
                tags={model.tags}
                isOnline={model.isOnline}
                viewerCount={model.viewerCount}
                image={model.image}
                chatRoomUrl={model.chatRoomUrl}
                showStatus={model.showStatus}
                country={model.country}
                languages={model.languages}
                isHd={model.isHd}
                ethnicity={model.ethnicity}
              />
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-gray-800">
          <h2 className="text-2xl font-bold mb-4">Component Features</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Interactive hover effects with Profile and Engage buttons</li>
            <li>HD indicator for high-definition streams</li>
            <li>Live badge for models currently streaming</li>
            <li>Viewer count with automatic formatting (1.2K instead of 1200)</li>
            <li>Properly formatted tags with hover effects</li>
            <li>Country and language display</li>
            <li>Online/offline status indicators</li>
          </ul>
        </div>
      </div>
    </ThemeLayout>
  );
};

export default ModelCardExamplesPage; 