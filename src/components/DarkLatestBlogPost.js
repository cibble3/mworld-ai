import Link from "next/link";
import styles from "../components/navigation/dark-themeLive/dashbpard-dark-theme.module.css";
import Image from "next/image";
import { decodeAndSanitizeHTML } from "@/helper/helpers";

const DarkLatestBlogPost = ({ image, title1, title2, post_url }) => {
  const sanitizedTitle = decodeAndSanitizeHTML(title1);

  return (
    <Link rel="preconnect" href={`/blog/${post_url}`}>
      <div
        className={`${styles?.detailblog} md:flex-row flex-col    gap-3 my-5`}
      >
        {/* <div className={`${styles?.blogimgtext} w-[20%]`}> */}
        <div className={` md:w-[30%]`}>
          <img
            src={image}
            width={100}
            height={100}
            className={`${styles?.blogimg} w-full h-20 object-cover`}
            alt=""
          />
        </div>
        <div className=" md:w-[70%]">
          {/* <h5>{title1}</h5> */}
          <h5
            className="text-white line-clamp-1"
            dangerouslySetInnerHTML={{ __html: sanitizedTitle }}
          />
          <p className="line-clamp-3">{title2}</p>
        </div>
      </div>
    </Link>
  );
};

export default DarkLatestBlogPost;
