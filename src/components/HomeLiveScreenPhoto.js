import { AiOutlineHeart } from "react-icons/ai";
import { RxDotFilled } from "react-icons/rx";
import Image from "next/image";
import { usePathname } from "next/navigation";
const HomeLiveScreenPhoto = ({
  image,
  name,
  tags,
  age,
  performerid,
  chatroomurl,

  ethnicity,
  isPagePremium,
  isRelated = false,
  preload,
  isVideoPage,
  gender,
  // data,
}) => {
  const pathname = usePathname();
  const href = pathname.includes("/free")
    ? // ? `https://tsyum.chaturbate.com/${name}/?tour=Limj&b=${name}&signup_notice=1&campaign=1f2Eo`
      `https://mistressworld.chaturbate.com/${name}/?tour=Limj&b=${name}&signup_notice=1&campaign=1f2Eo`
    : `/chat/${performerid}`;

  const src = pathname.includes("/free") ? `https:${image}` : `${image}`;
  const target = pathname.includes("/free") && "_blank";

  const alt = [
    // `mistressworld cam babe ${name}`,
    // `${name} - mistressworld webcam model on mistressworld.xxx`,
    // `${name} - mistressworld  webcam model`,
    // `live mistressworld cam performer -${name}`,
    // `${name} - live  cam model mistressworld`,
    // `mistressworld cam model ${name}`,
    `${name} - live ${ethnicity} cam model mistressworld`,
    `mistressworld ${ethnicity} cam model ${name}`,
  ];
  return (
    <>
      <div
        className={`${
          isRelated ? "xl:w-4/12" : " xl:w-3/12"
        }  lg:w-4/12 md:w-6/12 px-1 mt-4 mx-auto`}
      >
        <a
          target="_blank"
          rel="preconnect"
          // href={`/chat/${performerid}`}
          // href={href}
          href={chatroomurl}
          // href={`https://mistressworld.chaturbate.com/${name}/?tour=Limj&b=${name}&signup_notice=1&campaign=1f2Eo`}
          className="relative"
        >
          <Image
            rel="preload"
            height={100}
            width={500}
            blurDataURL={`https:${image}`}
            src={`${src}`}
            // alt={alt[Math.floor(Math.random() * alt.length)]}
            alt={`${name} -  cam model mistressworld`}
            className=" object-contain object-center"
          />

          {/* <div className="text-white px-2 bg-overlay "> */}
          {/* <div className="flex justify-between items-center relative z-10"> */}
          <div className="text-white px-2 bg-overlay flex items-center  relative ">
            {/* <RxDotFilled color="#8FC500" fontSize="22px" /> */}
            <div className="h-2 w-2 rounded-full bg-[#8FC500] m-2 z-20"></div>
            <span className="z-50">
              {name}
              {age && `(${age})`}
            </span>
          </div>
          {/* <div>
                  <AiOutlineHeart fontSize="22px" />
                </div> */}
          {/* </div> */}
          {/* </div> */}
        </a>
        <div
          className="mt-3 text-white flex gap-1 flex-wrap"
          style={{ fontSize: "11px" }}
        >
          {tags?.slice(0, 3).map((tag, i) => {
            return (
              <div key={i} className="px-3 py-2 rounded-lg bg-[#2E3033]">
                {tag}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default HomeLiveScreenPhoto;
