// pages/[lang]/[page].js

import { useRouter } from "next/router";
import { useEffect } from "react";

const RedirectPage = () => {
  const router = useRouter();

  useEffect(() => {
    const { lang, page, subpage } = router.query;
    // Redirect logic for language-only routes
    // if (lang && !page) {
    //   router.push("/");
    // }
    // Redirect logic for language + page routes
    //     if (lang && page) {
    //       if (page === "girls") {
    //         router.push("/girls");
    //       } else if (page === "trans") {
    //         router.push("/trans");
    //       } else {
    //         // Redirect to home page for unknown page routes
    //         router.push("/");
    //       }
    //     }
    //   }, [router.query]);
    if (lang) {
      if (!page) {
        // Redirect language-only routes to home page
        router.push("/");
      } else {
        if (page === "girls" || page === "trans" || page === "blog") {
          if (subpage) {
            // Redirect to page with subpage
            router.push(`/${page}/${subpage}`);
          } else {
            // Redirect to page without subpage
            router.push(`/${page}`);
          }
        } else {
          // Redirect unknown pages to home page
          router.push("/");
        }
      }
    }
  }, [router.query]);

  return null; // This component does not render anything
};

export default RedirectPage;
