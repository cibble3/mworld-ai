import { AiOutlineHeart } from "react-icons/ai";
import { RxDotFilled } from "react-icons/rx";
import Link from "next/link";
import Image from "next/image";

const LiveScreenPhoto1 = ({
  image,
  name,
  tags,
  age,
  ethnicity,
  slug,
  isPageFree,
  isRelated = false,
  preload,
}) => {
  const profileLink = `/model/${slug}`;
  const cardHref = isPageFree ? '#' : profileLink;
  const linkTarget = isPageFree ? "_blank" : "";

  const alt = [
    `${name} - live ${ethnicity || 'cam'} model mistressworld`,
    `mistressworld ${ethnicity || 'cam'} model ${name}`,
  ];
  const randomAlt = alt[Math.floor(Math.random() * alt.length)];

  return (
    <>
      <div
        className={`${
          isRelated ? "xl:w-4/12" : " xl:w-3/12"
        }  lg:w-4/12 md:w-6/12  px-1 mt-4`}
      >
        {isPageFree ? (
          <a
            target={linkTarget}
            rel="noopener noreferrer preconnect"
            href={cardHref}
            className="relative inline-block cursor-pointer group"
          >
            <div className="relative w-full" style={{ paddingTop: '75%' }}>
              {preload ? (
                <Image
                  fill
                  sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                  priority={true}
                  src={image || '/placeholder.png'}
                  alt={randomAlt}
                  className="absolute top-0 left-0 w-full h-full object-cover rounded-lg group-hover:scale-105 transition-transform duration-200"
                  onError={(e) => { e.target.src = '/placeholder.png'; }}
                />
              ) : (
                <Image
                  fill
                  sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                  loading="lazy"
                  src={image || '/placeholder.png'}
                  alt={randomAlt}
                  className="absolute top-0 left-0 w-full h-full object-cover rounded-lg group-hover:scale-105 transition-transform duration-200"
                  onError={(e) => { e.target.src = '/placeholder.png'; }}
                />
              )}
            </div>
            <div className="absolute bottom-0 left-0 right-0 text-white px-2 py-1 bg-gradient-to-t from-black/70 via-black/50 to-transparent rounded-b-lg">
              <div className="flex justify-between items-center">
                <div className="flex items-center truncate">
                  <RxDotFilled color="#8FC400" fontSize="22px" className="flex-shrink-0"/>
                  <span className="truncate font-semibold">
                    {name} {age && `(${age})`}
                  </span>
                </div>
                <div className="flex-shrink-0">
                  <AiOutlineHeart fontSize="20px" />
                </div>
              </div>
            </div>
          </a>
        ) : (
          <Link href={cardHref} passHref legacyBehavior>
            <a 
              className="relative inline-block cursor-pointer group"
              target={linkTarget}
            >
              <div className="relative w-full" style={{ paddingTop: '75%' }}>
                {preload ? (
                  <Image
                    fill
                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                    priority={true}
                    src={image || '/placeholder.png'}
                    alt={randomAlt}
                    className="absolute top-0 left-0 w-full h-full object-cover rounded-lg group-hover:scale-105 transition-transform duration-200"
                    onError={(e) => { e.target.src = '/placeholder.png'; }}
                  />
                ) : (
                  <Image
                    fill
                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                    loading="lazy"
                    src={image || '/placeholder.png'}
                    alt={randomAlt}
                    className="absolute top-0 left-0 w-full h-full object-cover rounded-lg group-hover:scale-105 transition-transform duration-200"
                    onError={(e) => { e.target.src = '/placeholder.png'; }}
                  />
                )}
              </div>
              <div className="absolute bottom-0 left-0 right-0 text-white px-2 py-1 bg-gradient-to-t from-black/70 via-black/50 to-transparent rounded-b-lg">
                <div className="flex justify-between items-center">
                  <div className="flex items-center truncate">
                    <RxDotFilled color="#8FC400" fontSize="22px" className="flex-shrink-0"/>
                    <span className="truncate font-semibold">
                      {name} {age && `(${age})`}
                    </span>
                  </div>
                  <div className="flex-shrink-0">
                    <AiOutlineHeart fontSize="20px" />
                  </div>
                </div>
              </div>
            </a>
          </Link>
        )}

        <div
          className="mt-2 text-white flex gap-1 flex-wrap"
          style={{ fontSize: "11px" }}
        >
          {tags?.slice(0, 3).map((tag, i) => {
            return (
              <span key={i} className="px-2 py-1 rounded-full bg-[#2E3033] text-xs">
                {tag}
              </span>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default LiveScreenPhoto1;
