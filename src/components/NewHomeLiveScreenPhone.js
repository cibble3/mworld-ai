import { AiOutlineHeart } from "react-icons/ai";
import { RxDotFilled } from "react-icons/rx";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useParams } from "next/navigation";
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
  const param = useParams();
  const href = pathname.includes("/free")
    ? `https://mistressworld.chaturbate.com/${name}/?tour=Limj&b=${name}&signup_notice=1&campaign=1f2Eo`
    : `${chatroomurl}`;

  //   const src = pathname.includes("/free") ? `https:${image}` : `${image}`;
  const target = pathname.includes("/free") && "_blank";
  const alt = [
    `${name} - live ${param?.type} cam model mistressworld`,
    `mistressworld ${param?.type} cam model ${name}`,
    // `${name} - transgender webcam model on tsyum.com`,
    // `${name} - tsyum trans webcam model`,
    // `live trans cam performer -${name}`,
  ];
  return (
    <>
      <div
        className={`${
          isRelated ? "xl:w-4/12" : " xl:w-3/12"
        }  lg:w-4/12 md:w-6/12 px-1 mt-4 mx-auto`}
      >
        <a target="_blank" rel="preconnect" href={href} className="relative">
          <img
            rel="preload"
            height={100}
            width={500}
            blurDataURL={`https:${image}`}
            src={`${image}`}
            alt={alt[Math.floor(Math.random() * alt.length)]}
            // alt={`live  cam performance by ${name}`}
            // className="h-[180px] "
            className="object-contain object-center"
          />

          <div className="text-white px-2 bg-overlay flex items-center  relative ">
            <div className="h-2 w-2 rounded-full bg-[#8FC500] m-2 z-20"></div>
            <span className="z-50">
              {name}
              {age && `(${age})`}
            </span>
          </div>
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
