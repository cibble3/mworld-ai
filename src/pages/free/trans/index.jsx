import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import HeadMeta from '@/components/HeadMeta';
import CookiesModal from '@/components/CookiesModal/CookiesModal';
import DynamicSidebar from '@/components/navigation/DynamicSidebar';
import { useTheme, THEMES } from '@/context/ThemeContext';
import { themes } from '@/theme/config';

// Free Trans categories
const freeTransCategories = [
  {
    id: 'asian',
    name: 'Asian',
    description: 'Beautiful Asian trans models',
    image: '/images/categories/asian-trans-cams.jpg',
  },
  {
    id: 'ebony',
    name: 'Ebony',
    description: 'Stunning Ebony trans performers',
    image: '/images/categories/ebony-trans-cams.jpg',
  },
  {
    id: 'latina',
    name: 'Latina',
    description: 'Exotic Latina trans models',
    image: '/images/categories/latina-trans-cams.jpg',
  },
  {
    id: 'blonde',
    name: 'Blonde',
    description: 'Gorgeous blonde trans performers',
    image: '/images/categories/blonde-trans-cams.jpg',
  },
  {
    id: 'brunette',
    name: 'Brunette',
    description: 'Beautiful brunette trans models',
    image: '/images/categories/brunette-trans-cams.jpg',
  },
  {
    id: 'anal',
    name: 'Anal',
    description: 'Trans models who enjoy anal play',
    image: '/images/categories/anal-trans-cams.jpg',
  },
  {
    id: 'bigboobs',
    name: 'Big Boobs',
    description: 'Trans models with enhanced features',
    image: '/images/categories/bigboobs-trans-cams.jpg',
  },
  {
    id: 'smallboobs',
    name: 'Small Boobs',
    description: 'Natural trans performers',
    image: '/images/categories/smallboobs-trans-cams.jpg',
  }
];

// Category Card Component
const CategoryCard = ({ category }) => {
  const { theme } = useTheme();
  const currentTheme = themes[theme];
  
  const cardStyle = {
    backgroundColor: currentTheme?.secondary || '#1a1c21',
    borderColor: currentTheme?.border || '#2d3748',
  };
  
  return (
    <Link href={`/free/trans/${category.id}`}>
      <div 
        className="relative rounded-lg overflow-hidden group transition-all hover:shadow-lg"
        style={cardStyle}
      >
        <div className="aspect-video relative">
          {/* Use a placeholder image if the category image is missing */}
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

const FreeTransPage = () => {
  // Prepare page metadata
  const pageContent = {
    meta_title: "Free Trans Cams - Watch Free Live Trans Webcams - MistressWorld",
    meta_desc: "Watch free transgender webcams with no registration required. Stream live trans models for free at MistressWorld - the best free trans cam site."
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
        <h1 className="text-2xl md:text-3xl font-bold mb-2">Free Trans Cams</h1>
        <p className="text-gray-400 mb-6">
          Watch free live transgender cam shows. No registration required - just click and enjoy high quality streams with our trans performers.
        </p>
        
        {/* Main Content */}
        <section className="py-4">
          <h2 className="text-2xl font-bold mb-6">Free Trans Categories</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {freeTransCategories.map(category => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        </section>
        
        {/* Bottom content section */}
        <div className="mt-12 grid md:grid-cols-2 gap-8">
          <div className="bg-[#1a1c21] rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4 text-pink-500">
              Free Trans Live Cams
            </h2>
            <p className="text-gray-400 mb-3">
              Enjoy high-quality free transgender webcam shows featuring stunning models from around the world. Our free cam section allows you to watch live performances without any registration or credit card required.
            </p>
          </div>
          <div className="bg-[#1a1c21] rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4 text-pink-500">
              Browse By Category
            </h2>
            <p className="text-gray-400 mb-3">
              Explore our diverse range of free trans cam categories to find exactly what you're looking for. Whether you prefer Asian, Latina, Ebony, or any other type of performer, we have the perfect free trans cam show waiting for you.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FreeTransPage; 