import React from 'react';
import ModelPage from '@/components/pages/ModelPage';
import Link from 'next/link';
import Image from 'next/image';

// Common fetish tags - these are also defined in the API but duplicated here for UI purposes
const FETISH_TAGS = [
  { id: 'leather', name: 'Leather', image: '/images/categories/leather-cams.jpg', description: 'Models in leather outfits and gear' },
  { id: 'latex', name: 'Latex', image: '/images/categories/latex-cams.jpg', description: 'Models wearing latex and PVC clothing' },
  { id: 'bdsm', name: 'BDSM', image: '/images/categories/bdsm-cams.jpg', description: 'BDSM performers and enthusiasts' },
  { id: 'feet', name: 'Feet', image: '/images/categories/feet-cams.jpg', description: 'Foot fetish and feet worship performers' },
  { id: 'femdom', name: 'Femdom', image: '/images/categories/femdom-cams.jpg', description: 'Female domination performers' },
  { id: 'spanking', name: 'Spanking', image: '/images/categories/spanking-cams.jpg', description: 'Spanking and punishment cam shows' },
  { id: 'roleplay', name: 'Roleplay', image: '/images/categories/roleplay-cams.jpg', description: 'Models who enjoy roleplay scenarios' },
  { id: 'joi', name: 'JOI', image: '/images/categories/joi-cams.jpg', description: 'Jerk off instruction performers' },
  { id: 'humiliation', name: 'Humiliation', image: '/images/categories/humiliation-cams.jpg', description: 'Verbal humiliation specialists' },
  { id: 'toys', name: 'Toys', image: '/images/categories/toys-cams.jpg', description: 'Models who use toys in their shows' }
];

// Category Card Component for featured fetish types
const CategoryCard = ({ category }) => {
  return (
    <Link href={`/fetish/${category.id}`}>
      <div className="relative rounded-lg overflow-hidden group transition-all hover:shadow-lg bg-[#1a1c21]">
        <div className="aspect-video relative">
          <Image
            src={category.image || '/images/placeholder.jpg'}
            alt={category.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-110"
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
          <h3 className="text-lg font-semibold">{category.name}</h3>
          <p className="text-sm text-gray-300 mt-1 line-clamp-2">{category.description}</p>
        </div>
      </div>
    </Link>
  );
};

const FetishPage = () => {
  // Default content when no filters are applied
  const defaultContent = {
    title: "Fetish Cams",
    desc: "Watch live fetish cam shows with the hottest performers. Explore BDSM, leather, latex, foot worship and more - featuring premium models.",
    meta_title: "Fetish Cams - Watch Live Fetish Webcams - MistressWorld",
    meta_desc: "Watch fetish cams with no registration required. Stream live BDSM, leather, latex and other fetish webcams at MistressWorld.",
    meta_keywords: "fetish cams, bdsm cams, leather cams, latex cams, foot fetish cams, femdom cams, live fetish webcams",
    // Additional content for the bottom section
    about: [
      {
        heading: "Mixed Fetish Live Cams",
        desc1: [
          "Enjoy our mixed feed of high-quality fetish webcam shows featuring stunning models from premium sources. Browse BDSM, leather, latex, feet and other fetish performers all in one place."
        ]
      },
      {
        heading: "Explore Fetish Categories",
        desc1: [
          "Browse our diverse range of fetish cam categories using the filters above. Whether you're into BDSM, leather, latex, foot worship, or any other fetish, we have the perfect cam show waiting for you."
        ]
      }
    ]
  };

  // Custom content component to display the fetish categories grid
  const FetishCategoriesComponent = () => (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-4">Featured Fetish Categories</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {FETISH_TAGS.slice(0, 8).map(category => (
          <CategoryCard key={category.id} category={category} />
        ))}
      </div>
    </div>
  );

  return (
    <ModelPage
      category="fetish"
      defaultContent={defaultContent}
      contentMap={{}}
      additionalParams={['fetish_type', 'willingness']}
      pageRoute="/fetish"
      topComponent={<FetishCategoriesComponent />}
    />
  );
};

export default FetishPage; 