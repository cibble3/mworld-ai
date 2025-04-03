"use client";
import styles from "../components/navigation/dark-themeLive/dashbpard-dark-theme.module.css";
import Link from "next/link";
import { renderProcessedContent } from "@/helper/helpers";
import Image from "next/image";

const Staticblogpost = ({ image, title1, title2, post_url }) => {
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
    // <div className="col-md-6 col-sm-12 col-lg-4 mt-4 px-1">
    <div className=" sm:w-full mt-4 px-1">
      <div className={`${styles?.Dashbpardcard} h-full`}>
        <Link rel="preconnect" title={title1} href={`/blog/${post_url}`}>
          {/* <div
            dangerouslySetInnerHTML={{
              __html: title1,
            }}
          ></div> */}
          <Image
            height={500}
            width={500}
            className="card-img-top w-full rounded-[10px]"
            style={{ height: "200px" }}
            src={image}
            alt={`Blog Post: ${title1}`}
            // alt={`Blog Post: ${{
            //   dangerouslySetInnerHTML: { __html: title1 },
            // }}`}
            // alt={maintitle?.dangerouslySetInnerHTML?.__html}
            // alt={`Blog Post: ${extractPText()}`}
            // alt={
            //   <div
            //     dangerouslySetInnerHTML={{
            //       __html: title1,
            //     }}
            //   ></div>
            // }
            // alt={`Blog Post: ${extractPText()}`}
            role="button"
          />
          {/* <Image
            height={100}
            width={100}
            className="card-img-top w-full"
            style={{ height: "200px" }}
            src={image}
            alt={`Blog Post: ${title1}`}
            role="button"
            onError={(e) => {
           
              // Handle the error, e.g., display a fallback image
            }}
          /> */}
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
            {/* <Link
              href={`/blog/${post_url}`}
              title={title1}
              className={`${styles?.cardtext} text-decoration-underline`}
              aria-label={`Learn more about ${title1}`}
            >
              {" "}
              Learn more
            </Link> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Staticblogpost;
