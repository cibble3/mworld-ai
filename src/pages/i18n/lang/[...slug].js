// pages/[lang]/[...slug].js

import { useRouter } from "next/router";
import { useEffect } from "react";

const RedirectPage = () => {
  const router = useRouter();

  //   useEffect(() => {
  //     const { lang, slug } = router.query;

  //     if (lang) {
  //       if (!slug || slug.length === 0) {
  //         // If only language is provided, redirect to home page
  //         router.push("/");
  //       } else {
  //         // If language and page are provided
  //         const [page, ...subpages] = slug;
  //         if (page === "girls" || page === "trans") {
  //           // Redirect to page with or without subpages
  //           router.push(
  //             `/${page}${subpages.length > 0 ? "/" + subpages.join("/") : ""}`
  //           );
  //         } else {
  //           // Redirect unknown pages to home page
  //           router.push("/");
  //         }
  //       }
  //     }
  //   }, [router.query]);

  //   return null;
  // };

  //   free but not premium
  //   useEffect(() => {
  //     const { lang, slug } = router.query;

  //     if (lang) {
  //       if (!slug || slug.length === 0) {
  //         // If only language is provided, redirect to home page
  //         router.push("/");
  //       } else {
  //         const [firstSegment, ...remainingSegments] = slug;
  //         // Check if the first segment is 'free'
  //         if (firstSegment === "free") {
  //           // Redirect to the route with 'free' prefix
  //           router.push(
  //             `/${firstSegment}${
  //               remainingSegments.length > 0
  //                 ? "/" + remainingSegments.join("/")
  //                 : ""
  //             }`
  //           );
  //         } else {
  //           // Redirect to the home page for unknown routes
  //           router.push("/");
  //         }
  //       }
  //     }
  //   }, [router.query]);

  //   return null;
  // };
  useEffect(() => {
    const { lang, slug } = router.query;

    if (lang) {
      if (!slug || slug.length === 0) {
        // If only language is provided, redirect to home page
        router.push("/");
      } else {
        const [firstSegment, ...remainingSegments] = slug;
        if (
          firstSegment === "girls" ||
          firstSegment === "trans" ||
          firstSegment === "blog" ||
          (firstSegment.startsWith("free") && slug[1] === "girls") ||
          (firstSegment.startsWith("free") && slug[1] === "trans")
        ) {
          // Redirect to the route with the remaining segments
          router.push(
            `/${firstSegment}${
              remainingSegments.length > 0
                ? "/" + remainingSegments.join("/")
                : ""
            }`
          );
        } else {
          // Redirect to the home page for unknown routes
          router.push("/404");
        }
      }
    }
  }, [router.query]);

  return null;
};

export default RedirectPage;
