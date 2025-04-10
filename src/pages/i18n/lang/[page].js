// pages/[lang]/[page].js

import { useRouter } from "next/router";
import { useEffect } from "react";
import ThemeLayout from "@/theme/layouts/ThemeLayout";

const RedirectPage = () => {
  const router = useRouter();
  
  // Don't render anything until router is ready
  if (!router.isReady) {
    return (
      <ThemeLayout>
        <div className="flex justify-center items-center min-h-screen">
          <p>Loading...</p>
        </div>
      </ThemeLayout>
    );
  }

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
  }, [router.query, router.isReady]);

  // Return a minimal ThemeLayout to avoid theme context errors during SSR
  return (
    <ThemeLayout meta={{ meta_title: "Redirecting...", meta_desc: "Please wait while you are redirected." }}>
      <div className="flex justify-center items-center min-h-screen">
        <p>Redirecting...</p>
      </div>
    </ThemeLayout>
  );
};

export default RedirectPage;
