import React, { useState, useEffect } from "react";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import { Virtual, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import Link from "next/link";
import Image from "next/image";

// Default placeholder image for development
const placeholderImage = "https://placehold.co/300x384/373737/FFFFFF?text=Fetish+Category";

const Slider = ({ category }) => {
  const [subcategories, setSubcategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!category) return;

    const fetchSubcategories = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await axios.get(`/api/categories/${category}`);
        if (response.data?.success && Array.isArray(response.data?.data?.subcategories)) {
          setSubcategories(response.data.data.subcategories);
        } else {
          console.warn(`No subcategories found or invalid response for category: ${category}`);
          setSubcategories([]);
          setError('Could not load subcategories.');
        }
      } catch (err) {
        console.error(`Error fetching subcategories for ${category}:`, err);
        setError('Failed to fetch subcategories.');
        setSubcategories([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSubcategories();

  }, [category]);

  if (isLoading) {
    return <div className="text-white p-4">Loading categories...</div>;
  }

  if (error) {
    return <div className="text-red-500 p-4">{error}</div>;
  }

  if (subcategories.length === 0) {
    return <div className="text-white p-4">No subcategories available for {category}.</div>;
  }

  return (
    <Swiper
      modules={[Virtual, Navigation]}
      slidesPerView={1}
      spaceBetween={10}
      navigation={true}
      breakpoints={{
        640: { slidesPerView: 2, spaceBetween: 10 },
        768: { slidesPerView: 3, spaceBetween: 10 },
        900: { slidesPerView: 3, spaceBetween: 10 },
        1024: { slidesPerView: 5, spaceBetween: 10 },
      }}
      className="mySwiper subcategory-slider"
    >
      {subcategories.map((item, index) => {
        const href = `/${category}/${item.id}`;
        
        const imageSrc = placeholderImage;
        const altText = `${item.name} ${category}`;

        return (
          <SwiperSlide key={item.id || index}>
            <Link href={href} passHref legacyBehavior>
              <a className="block h-[450px] flex items-center mx-1.5 group">
                <div className="relative flex justify-center w-full">
                  <div className="relative w-full h-96 rounded-[30px] overflow-hidden lg:mt-[0px] mt-[20px] group-hover:scale-105 duration-100">
                    <Image
                      loading="lazy"
                      unoptimized
                      alt={altText}
                      width={300}
                      height={384}
                      src={imageSrc}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute bottom-1 text-center bg-[#e0006c] text-white w-auto mx-auto py-2 px-3 rounded-[20px] text-sm md:text-base">
                    {item.name}
                  </div>
                </div>
              </a>
            </Link>
          </SwiperSlide>
        );
      })}
    </Swiper>
  );
};

export default Slider;
