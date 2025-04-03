"use client";
import styles from "../components/navigation/dark-themeLive/dashbpard-dark-theme.module.css";
import Link from "next/link";
import { renderProcessedContent } from "@/helper/helpers";
import Image from "next/image";

const DarkSingleBlogPost = ({ image, title1, title2, post_url }) => {
  const pRegex = /<p>(.*?)<\/p>/s;
  const extractPText = () => {
    return (
      <div
        className="whatever"
        dangerouslySetInnerHTML={{
          __html: title1,
        }}
      ></div>
    );
  };

  const maintitle = { dangerouslySetInnerHTML: { __html: title1 } };
  return (
    <div className="md:w-4/12 lg:w-4/12 sm:w-full mt-4 px-1">
      <div className={styles?.Dashbpardcard}>
        <Link rel="preconnect" title={title1} href={`/blog/${post_url}`}>
          <Image
            height={500}
            width={500}
            className="card-img-top w-full rounded-[10px] object-cover"
            style={{ height: "200px" }}
            src={image}
            alt={`Blog Post: ${title1}`}
            role="button"
          />
        </Link>
        <div className="card-body">
          <div className={`${styles?.cardtext} card-text pt-3  font-bold`}>
            <Link
              rel="preconnect"
              className="blog-title"
              title={title1}
              href={`/blog/${post_url}`}
            >
              {renderProcessedContent(title1, 30)}
            </Link>
          </div>
          <div className={`${styles?.cardtext}  text-[12px] lh mt-2 mb-2`}>
            {renderProcessedContent(title2)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DarkSingleBlogPost;
